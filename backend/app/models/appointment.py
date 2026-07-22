from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.models.base import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String(36), ForeignKey("tenants.id"))
    doctor_id = Column(String(36), ForeignKey("doctors.id"))
    patient_name = Column(String(255), nullable=False)
    patient_mobile = Column(String(50), nullable=False)
    patient_age = Column(String(50))
    patient_gender = Column(String(50))
    patient_email = Column(String(255))
    patient_description = Column(String(1000))
    date = Column(String(50), nullable=False)  # ISO string or YYYY-MM-DD
    time_slot = Column(String(50), nullable=False)  # e.g., "10:00 AM"
    type = Column(String(50), default="Clinic") # e.g. "Online" or "Clinic"
    status = Column(String(50), default="Confirmed")
    created_at = Column(DateTime, default=datetime.utcnow)

    tenant = relationship("Tenant")
    doctor = relationship("Doctor")
