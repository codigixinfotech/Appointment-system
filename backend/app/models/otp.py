from sqlalchemy import Column, String, DateTime, Boolean
from app.models.base import Base
import uuid
import datetime

class OTPVerification(Base):
    __tablename__ = "otp_verifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    mobile = Column(String(20), index=True)
    otp_code = Column(String(6))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime)
    is_used = Column(Boolean, default=False)
