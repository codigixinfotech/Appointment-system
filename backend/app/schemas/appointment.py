from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.doctor import DoctorResponse

class PatientInfo(BaseModel):
    name: str
    age: Optional[str] = None
    gender: Optional[str] = None
    email: Optional[str] = None
    description: Optional[str] = None

class AppointmentCreate(BaseModel):
    tenant_id: str
    doctor_id: str
    patient: PatientInfo
    mobile: str
    date: str
    timeSlot: str
    type: str

class AppointmentResponse(BaseModel):
    id: str
    tenant_id: str
    doctor_id: str
    patient_name: str
    patient_mobile: str
    patient_age: Optional[str] = None
    patient_gender: Optional[str] = None
    patient_email: Optional[str] = None
    patient_description: Optional[str] = None
    date: str
    time_slot: str
    type: str
    status: str
    created_at: datetime
    doctor: Optional[DoctorResponse] = None

    class Config:
        orm_mode = True

class BroadcastEmailRequest(BaseModel):
    tenant_id: str
    doctor_id: str
    subject: str
    message: str
