"""Menu request/response schemas."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class MenuItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=150, examples=["Margherita Pizza"])
    description: Optional[str] = Field(
        default=None, examples=["Classic pizza with tomato and mozzarella"]
    )
    category_id: str = Field(..., examples=["cat-001"])
    image_url: Optional[str] = Field(default=None, examples=["https://example.com/margherita.jpg"])
    price: float = Field(..., gt=0, examples=[12.99])
    discount_price: Optional[float] = Field(default=None, ge=0, examples=[10.99])
    available: bool = True
    preparation_time: int = Field(default=15, ge=0, examples=[20])
    calories: Optional[int] = Field(default=None, ge=0, examples=[850])
    ingredients: List[str] = Field(default=[], examples=[["tomato", "mozzarella", "basil"]])
    allergens: List[str] = Field(default=[], examples=[["gluten", "dairy"]])
    spicy_level: int = Field(default=0, ge=0, le=5, examples=[0])
    featured: bool = False


class MenuItemUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=150)
    description: Optional[str] = None
    category_id: Optional[str] = None
    image_url: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    discount_price: Optional[float] = Field(default=None, ge=0)
    available: Optional[bool] = None
    preparation_time: Optional[int] = Field(default=None, ge=0)
    calories: Optional[int] = Field(default=None, ge=0)
    ingredients: Optional[List[str]] = None
    allergens: Optional[List[str]] = None
    spicy_level: Optional[int] = Field(default=None, ge=0, le=5)
    featured: Optional[bool] = None


class MenuItemResponse(BaseModel):
    item_id: str
    name: str
    description: Optional[str] = None
    category_id: str
    image_url: Optional[str] = None
    price: float
    discount_price: Optional[float] = None
    available: bool
    preparation_time: int
    calories: Optional[int] = None
    ingredients: List[str]
    allergens: List[str]
    spicy_level: int
    rating: float
    total_reviews: int
    featured: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
