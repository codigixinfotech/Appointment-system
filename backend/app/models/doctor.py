from sqlalchemy import Column, String, Boolean, Text, JSON, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base, TimestampMixin, generate_uuid, TenantModelMixin

class Doctor(Base, TimestampMixin, TenantModelMixin):
    __tablename__ = "doctors"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    name = Column(String(255), nullable=False)
    speciality = Column(String(255), nullable=False)
    experience = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    
    online_consult = Column(Boolean, default=True)
    in_person = Column(Boolean, default=True)
    
    education = Column(Text, nullable=True)
    languages = Column(JSON, nullable=True)
    rating = Column(Float, default=5.0)
    bio = Column(Text, nullable=True)
    photo = Column(String(1024), nullable=True)
    
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    
    in_person_hours = Column(JSON, nullable=True)
    online_hours = Column(JSON, nullable=True)
    unavailable_dates = Column(JSON, nullable=True)

    # Relationships
    tenant = relationship("Tenant", back_populates="doctors")
