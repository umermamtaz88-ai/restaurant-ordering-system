"""Customer request/response schemas."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class CustomerCreate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=150, examples=["John Doe"])
    email: str = Field(..., examples=["john@example.com"])
    phone: str = Field(..., min_length=5, max_length=20, examples=["+1234567890"])
    address: Optional[str] = Field(default=None, examples=["123 Main St, City"])
    notes: Optional[str] = Field(default=None, examples=["Prefers contactless delivery"])


class CustomerUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=1, max_length=150)
    email: Optional[str] = None
    phone: Optional[str] = Field(default=None, min_length=5, max_length=20)
    address: Optional[str] = None
    notes: Optional[str] = None


class CustomerResponse(BaseModel):
    customer_id: str
    full_name: str
    email: str
    phone: str
    address: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
