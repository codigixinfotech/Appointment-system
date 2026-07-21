from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.otp import OTPVerification
from pydantic import BaseModel
import random
import datetime
import traceback
from app.core.config import settings

try:
    from twilio.rest import Client
except ImportError:
    Client = None

router = APIRouter()

class SendOTPRequest(BaseModel):
    mobile: str

class VerifyOTPRequest(BaseModel):
    mobile: str
    otp_code: str

@router.post("/send-otp")
def send_otp(request: SendOTPRequest, db: Session = Depends(get_db)):
    # Generate 4-digit OTP
    code = f"{random.randint(0, 9999):04d}"
    
    # Expiration: 5 minutes from now
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=5)
    
    new_otp = OTPVerification(
        mobile=request.mobile,
        otp_code=code,
        expires_at=expires_at
    )
    db.add(new_otp)
    db.commit()
    
    # Format the phone number (assuming India +91 if exactly 10 digits)
    phone_number = request.mobile
    if len(phone_number) == 10 and phone_number.isdigit():
        phone_number = f"+91{phone_number}"

    use_twilio = settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN and settings.TWILIO_FROM_NUMBER and Client
    
    if use_twilio:
        try:
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            message = client.messages.create(
                body=f"Your Appointment System OTP is: {code}",
                from_=settings.TWILIO_FROM_NUMBER,
                to=phone_number
            )
            print(f"Twilio SMS sent successfully! SID: {message.sid}")
            print(f"[DEBUG] OTP for {phone_number} is: {code}")
        except Exception as e:
            print(f"Twilio SMS Failed: {e}")
            traceback.print_exc()
            # Do not raise 500 here so the user can still receive the debug_otp in the UI
            print(f"[DEBUG] Twilio failed, but OTP for {phone_number} is: {code}")
    else:
        # Simulate sending SMS
        print(f"\n==========================================")
        print(f"SMS SENT TO {phone_number}")
        print(f"Your Appointment System OTP is: {code}")
        print(f"==========================================\n")
    
    return {"message": "OTP sent successfully", "debug_otp": code}

@router.post("/verify-otp")
def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    # Find the most recent unused OTP for this mobile
    otp_record = db.query(OTPVerification).filter(
        OTPVerification.mobile == request.mobile,
        OTPVerification.is_used == False
    ).order_by(OTPVerification.created_at.desc()).first()
    
    if not otp_record:
        raise HTTPException(status_code=400, detail="No active OTP found for this number")
        
    if otp_record.expires_at < datetime.datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP has expired")
        
    if otp_record.otp_code != request.otp_code:
        raise HTTPException(status_code=400, detail="Invalid OTP code")
        
    # Mark as used
    otp_record.is_used = True
    db.commit()
    
    return {"message": "OTP verified successfully", "verified": True}
