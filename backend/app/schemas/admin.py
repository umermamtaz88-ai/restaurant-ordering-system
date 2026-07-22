"""Admin-only request schemas."""

from typing import Optional

from pydantic import BaseModel, EmailStr, Field


ALLOWED_ADMIN_ROLES = ("customer", "chef", "admin", "owner")


class AdminUserCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    phone: str = Field(..., min_length=5, max_length=20)
    role: str = Field(default="customer", examples=["customer", "chef", "admin"])
    is_active: bool = True


class AdminUserUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    phone: Optional[str] = None
    address: Optional[str] = None
    role: Optional[str] = Field(default=None, examples=["customer", "chef", "admin"])
    is_active: Optional[bool] = None
    password: Optional[str] = Field(default=None, min_length=8)
