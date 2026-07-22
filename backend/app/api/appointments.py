from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.appointment import Appointment as AppointmentModel
from app.schemas.appointment import AppointmentCreate, AppointmentResponse, BroadcastEmailRequest
from app.models.doctor import Doctor as DoctorModel
from app.models.tenant import Tenant as TenantModel
from sqlalchemy import or_, and_

router = APIRouter()

@router.post("/", response_model=AppointmentResponse)
def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    # Check if slot is already booked for this doctor on this date
    existing = db.query(AppointmentModel).filter(
        AppointmentModel.doctor_id == appointment.doctor_id,
        AppointmentModel.date == appointment.date,
        AppointmentModel.time_slot == appointment.timeSlot,
        AppointmentModel.status == "Confirmed"
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="This time slot is already booked")

    db_appt = AppointmentModel(
        tenant_id=appointment.tenant_id,
        doctor_id=appointment.doctor_id,
        patient_name=appointment.patient.name,
        patient_mobile=appointment.mobile,
        patient_age=appointment.patient.age,
        patient_gender=appointment.patient.gender,
        patient_email=appointment.patient.email,
        patient_description=appointment.patient.description,
        date=appointment.date,
        time_slot=appointment.timeSlot,
        type=appointment.type
    )
    
    db.add(db_appt)
    db.commit()
    db.refresh(db_appt)

    # Fetch doctor info to trigger email notification
    doctor = db.query(DoctorModel).filter(DoctorModel.id == appointment.doctor_id).first()
    if doctor:
        doctor_email = doctor.email or "doctor@hospital.com"
        patient_email = appointment.patient.email or "patient@example.com"
        
        tenant = db.query(TenantModel).filter(TenantModel.id == appointment.tenant_id).first()
        hospital_name = tenant.name if tenant else "Clinic Administration"
        hospital_logo = tenant.logo_url if tenant else ""
        
        appt_details = {
            "patient_name": appointment.patient.name,
            "patient_age": appointment.patient.age or "N/A",
            "patient_gender": appointment.patient.gender or "N/A",
            "patient_mobile": appointment.mobile,
            "patient_description": appointment.patient.description or "No details provided",
            "doctor_name": doctor.name,
            "doctor_speciality": doctor.speciality,
            "date": appointment.date,
            "time_slot": appointment.timeSlot,
            "type": appointment.type,
            "hospital_name": hospital_name,
            "hospital_logo": hospital_logo
        }
        
        try:
            from app.core.notifications import send_appointment_email
            send_appointment_email(doctor_email, patient_email, appt_details)
        except Exception as e:
            print(f"Failed to send email notification: {e}")

    return db_appt

@router.get("/{tenant_id}", response_model=List[AppointmentResponse])
def get_appointments(
    tenant_id: str, 
    doctor_id: Optional[str] = None, 
    date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(AppointmentModel).filter(AppointmentModel.tenant_id == tenant_id)
    
    if doctor_id:
        query = query.filter(AppointmentModel.doctor_id == doctor_id)
    if date:
        query = query.filter(AppointmentModel.date == date)
        
    return query.all()

@router.post("/broadcast")
def broadcast_email(request: BroadcastEmailRequest, db: Session = Depends(get_db)):
    doctor = db.query(DoctorModel).filter(DoctorModel.id == request.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
        
    # Query all appointments for this doctor at this tenant
    appointments = db.query(AppointmentModel).filter(
        AppointmentModel.tenant_id == request.tenant_id,
        AppointmentModel.doctor_id == request.doctor_id,
        AppointmentModel.status == "Confirmed"
    ).all()
    
    # Extract unique patient emails
    emails = list(set([a.patient_email for a in appointments if a.patient_email]))
    
    if not emails:
        return {"sent_count": 0, "message": "No patients with email addresses found for this doctor"}
        
    sent_count = 0
    from app.core.notifications import send_email_via_smtp
    
    for email in emails:
        success = send_email_via_smtp(email, request.subject, request.message)
        if success:
            sent_count += 1
            
    return {"sent_count": sent_count, "recipients": len(emails)}
