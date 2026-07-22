import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get base url from environment or fallback to localhost
ENV_BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")
BASE_URL = f"{ENV_BASE_URL.rstrip('/')}/api"

# 1. Create Tenant (Hospital)
tenant_data = {
    "name": "Healthplix Dermatologist Clinic",
    "brand_name": "Healthplix",
    "slug": "dr-jalpa-desai-dermatologist",
    "address": "123 Health Ave, Mumbai, Maharashtra",
    "phone": "+91 9876543210",
    "emergency_phone": "+91 9999999999",
    "working_hours": [
        {"label": "Mon - Sat", "time": "10:00 AM - 08:00 PM", "isEmergency": False},
        {"label": "Sun", "time": "Closed", "isEmergency": False}
    ],
    "map_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.828659102462!2d72.89746351543883!3d19.07119105707767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c627a20bcaa9%3A0xb2fd3bcfeac00511!2sMumbai!5e0!3m2!1sen!2sin!4v1625055000000!5m2!1sen!2sin",
    "google_place_id": "ChIJwe1EZjDG5zsRaYxkjY_tpF0",
    "logo_url": "https://www.healthplix.com/wp-content/uploads/2021/11/Healthplix-logo.png",
    "primary_color": "#0d9488",
    "secondary_color": "#0f766e",
    "accent_color": "#f59e0b",
    "background_color": "#f8fafc",
    "surface_color": "#ffffff",
    "text_color": "#1e293b",
    "subtext_color": "#64748b"
}

tenant_res = requests.post(f"{BASE_URL}/tenants/", json=tenant_data)
if tenant_res.status_code != 200:
    print("Failed to create tenant", tenant_res.text)
    exit(1)

tenant = tenant_res.json()
tenant_id = tenant["id"]
print(f"Created Tenant: {tenant['name']} (ID: {tenant_id})")

# 2. Create Doctor
doctor_data = {
    "name": "Dr. Jalpa Desai",
    "speciality": "Dermatologist",
    "experience": "10+ Years",
    "address": "Healthplix Clinic, Mumbai",
    "online_consult": True,
    "in_person": True,
    "education": "MBBS, MD - Dermatology",
    "languages": ["English", "Hindi", "Gujarati"],
    "rating": 4.9,
    "bio": "Dr. Jalpa Desai is a renowned Dermatologist with over 10 years of experience in treating various skin, hair, and nail conditions. She specializes in clinical and cosmetic dermatology.",
    "photo": "https://i.pravatar.cc/300?img=47",
    "email": "dr.jalpa@healthplix.com",
    "phone": "+91 9876543210",
    "in_person_hours": ["10:00 AM", "11:00 AM", "12:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"],
    "online_hours": ["02:00 PM", "03:00 PM"],
    "unavailable_dates": [],
    "tenant_id": tenant_id
}

doctor_res = requests.post(f"{BASE_URL}/doctors/", json=doctor_data)
if doctor_res.status_code != 200:
    print("Failed to create doctor", doctor_res.text)
    exit(1)

doctor = doctor_res.json()
print(f"Created Doctor: {doctor['name']} (ID: {doctor['id']})")
print("Seed data successfully added to the MySQL database!")
