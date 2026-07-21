from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey
import uuid

Base = declarative_base()

class TenantModelMixin:
    """
    Mixin that adds a tenant_id to any model and establishes the relationship.
    This ensures that data is isolated by tenant.
    """
    @declared_attr
    def tenant_id(cls):
        return Column(String(36), ForeignKey('tenants.id', ondelete='CASCADE'), nullable=False, index=True)

class TimestampMixin:
    """
    Mixin for adding created_at and updated_at timestamps.
    """
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

def generate_uuid():
    return str(uuid.uuid4())
