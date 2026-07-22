from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import engine
from app.models.base import Base

# Import models so they are registered with Base
from app.models import tenant, doctor, otp

# Import routers
from app.api import tenants, doctors, auth

from app.core.config import settings

# Auto-migrate database on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Appointment Booking System", version="1.0.0")

# Setup CORS origins dynamically from environment variables
cors_origins = []
if settings.CLIENT_ORIGIN:
    cors_origins.extend([origin.strip() for origin in settings.CLIENT_ORIGIN.split(",") if origin.strip()])
if settings.CORS_ORIGINS and settings.CORS_ORIGINS != "*":
    cors_origins.extend([origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()])

if settings.CORS_ORIGINS == "*" or not cors_origins:
    cors_origins = ["*"]
else:
    cors_origins = list(set(cors_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
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
