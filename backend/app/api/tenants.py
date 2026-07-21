from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.tenant import Tenant as TenantModel
from app.schemas.tenant import TenantCreate, TenantUpdate, TenantResponse

router = APIRouter()

@router.get("/", response_model=List[TenantResponse])
def get_all_tenants(db: Session = Depends(get_db)):
    return db.query(TenantModel).all()

@router.get("/{tenant_id}", response_model=TenantResponse)
def get_tenant(tenant_id: str, db: Session = Depends(get_db)):
    tenant = db.query(TenantModel).filter(TenantModel.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant

@router.post("/", response_model=TenantResponse)
def create_tenant(tenant: TenantCreate, db: Session = Depends(get_db)):
    db_tenant = TenantModel(**tenant.dict())
    db.add(db_tenant)
    db.commit()
    db.refresh(db_tenant)
    return db_tenant

@router.put("/{tenant_id}", response_model=TenantResponse)
def update_tenant(tenant_id: str, tenant_update: TenantUpdate, db: Session = Depends(get_db)):
    db_tenant = db.query(TenantModel).filter(TenantModel.id == tenant_id).first()
    if not db_tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    
    update_data = tenant_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_tenant, key, value)
        
    db.commit()
    db.refresh(db_tenant)
    return db_tenant
