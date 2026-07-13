"""Category request/response schemas."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, examples=["Pizza"])
    description: Optional[str] = Field(default=None, examples=["Delicious pizzas"])
    image_url: Optional[str] = Field(default=None, examples=["https://example.com/pizza.jpg"])
    active: bool = True
    sort_order: int = Field(default=0, ge=0)


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] = None
    image_url: Optional[str] = None
    active: Optional[bool] = None
    sort_order: Optional[int] = Field(default=None, ge=0)


class CategoryResponse(BaseModel):
    category_id: str
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    active: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
