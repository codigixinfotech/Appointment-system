from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class WorkingHourSchema(BaseModel):
    label: str
    time: str
    isEmergency: bool

class ThemeSchema(BaseModel):
    primaryColor: str
    secondaryColor: str
    accentColor: str
    backgroundColor: str
    surfaceColor: str
    textColor: str
    subtextColor: str

class TenantBase(BaseModel):
    name: str
    brand_name: str
    slug: str
    address: Optional[str] = None
    phone: Optional[str] = None
    emergency_phone: Optional[str] = None
    working_hours: Optional[List[Dict[str, Any]]] = None
    map_embed_url: Optional[str] = None
    upi_id: Optional[str] = None
    google_place_id: Optional[str] = None
    
    logo_url: Optional[str] = None
    primary_color: str = "#883b4b"
    secondary_color: str = "#db2777"
    accent_color: str = "#f59e0b"
    background_color: str = "#fdfbfb"
    surface_color: str = "#ffffff"
    text_color: str = "#1f2937"
    subtext_color: str = "#6b7280"

class TenantCreate(TenantBase):
    pass

class TenantUpdate(TenantBase):
    name: Optional[str] = None
    brand_name: Optional[str] = None
    slug: Optional[str] = None

class TenantResponse(TenantBase):
    id: str
    
    class Config:
        from_attributes = True
