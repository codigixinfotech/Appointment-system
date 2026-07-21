from sqlalchemy import Column, String, Boolean, Text, JSON
from sqlalchemy.orm import relationship
from app.models.base import Base, TimestampMixin, generate_uuid

class Tenant(Base, TimestampMixin):
    __tablename__ = "tenants"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    name = Column(String(255), nullable=False)
    brand_name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    
    # Contact Info
    address = Column(Text, nullable=True)
    phone = Column(String(50), nullable=True)
    emergency_phone = Column(String(50), nullable=True)
    
    # Config
    working_hours = Column(JSON, nullable=True)
    map_embed_url = Column(Text, nullable=True)
    upi_id = Column(String(100), nullable=True)
    google_place_id = Column(String(255), nullable=True)
    
    # Branding
    logo_url = Column(String(1024), nullable=True)
    primary_color = Column(String(50), default="#883b4b")
    secondary_color = Column(String(50), default="#db2777")
    accent_color = Column(String(50), default="#f59e0b")
    background_color = Column(String(50), default="#fdfbfb")
    surface_color = Column(String(50), default="#ffffff")
    text_color = Column(String(50), default="#1f2937")
    subtext_color = Column(String(50), default="#6b7280")
    
    # Status
    is_active = Column(Boolean, default=True)

    # Relationships
    doctors = relationship("Doctor", back_populates="tenant", cascade="all, delete")
