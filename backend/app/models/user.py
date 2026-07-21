from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from app.models.base import Base, TenantModelMixin, TimestampMixin, generate_uuid

class User(Base, TenantModelMixin, TimestampMixin):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    
    # Roles: SUPER_ADMIN, TENANT_ADMIN, MANAGER, STAFF, RECEPTIONIST, CUSTOMER
    role = Column(String(50), default="CUSTOMER", nullable=False)
    
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)

    # Relationships
    tenant = relationship("Tenant") # TenantModelMixin sets up tenant_id foreign key
