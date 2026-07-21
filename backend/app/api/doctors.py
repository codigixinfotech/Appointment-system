from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.doctor import Doctor as DoctorModel
from app.schemas.doctor import DoctorCreate, DoctorUpdate, DoctorResponse

router = APIRouter()

@router.get("/tenant/{tenant_id}", response_model=List[DoctorResponse])
def get_doctors_by_tenant(tenant_id: str, db: Session = Depends(get_db)):
    return db.query(DoctorModel).filter(DoctorModel.tenant_id == tenant_id).all()

@router.post("/", response_model=DoctorResponse)
def create_doctor(doctor: DoctorCreate, db: Session = Depends(get_db)):
    db_doctor = DoctorModel(**doctor.dict())
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

@router.put("/{doctor_id}", response_model=DoctorResponse)
def update_doctor(doctor_id: str, doctor_update: DoctorUpdate, db: Session = Depends(get_db)):
    db_doctor = db.query(DoctorModel).filter(DoctorModel.id == doctor_id).first()
    if not db_doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    update_data = doctor_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_doctor, key, value)
        
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

@router.delete("/{doctor_id}")
def delete_doctor(doctor_id: str, db: Session = Depends(get_db)):
    db_doctor = db.query(DoctorModel).filter(DoctorModel.id == doctor_id).first()
    if not db_doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    db.delete(db_doctor)
    db.commit()
    return {"message": "Doctor deleted successfully"}
