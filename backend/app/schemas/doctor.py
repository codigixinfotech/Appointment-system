from pydantic import BaseModel
from typing import List, Optional

class DoctorBase(BaseModel):
    name: str
    speciality: str
    experience: Optional[str] = None
    address: Optional[str] = None
    online_consult: bool = True
    in_person: bool = True
    education: Optional[str] = None
    languages: Optional[List[str]] = None
    rating: float = 5.0
    bio: Optional[str] = None
    photo: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    in_person_hours: Optional[List[str]] = None
    online_hours: Optional[List[str]] = None
    unavailable_dates: Optional[List[str]] = None
    fee: float = 0.0
    tenant_id: str

class DoctorCreate(DoctorBase):
    pass

class DoctorUpdate(DoctorBase):
    name: Optional[str] = None
    speciality: Optional[str] = None
    tenant_id: Optional[str] = None

class DoctorResponse(DoctorBase):
    id: str
    
    class Config:
        from_attributes = True
