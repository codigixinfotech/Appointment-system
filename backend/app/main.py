from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import engine
from app.models.base import Base

# Import models so they are registered with Base
from app.models import tenant, doctor, otp

# Import routers
from app.api import tenants, doctors, auth

# Auto-migrate database on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Appointment Booking System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev only, update in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Multi-Tenant SaaS Appointment Booking API"}

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(tenants.router, prefix="/api/tenants", tags=["Tenants"])
app.include_router(doctors.router, prefix="/api/doctors", tags=["Doctors"])
