"""Menu item domain model."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class MenuItem(BaseModel):
    item_id: str
    name: str
    description: Optional[str] = None
    category_id: str
    image_url: Optional[str] = None
    price: float = Field(ge=0)
    discount_price: Optional[float] = Field(default=None, ge=0)
    available: bool = True
    preparation_time: int = Field(default=15, ge=0, description="Minutes")
    calories: Optional[int] = Field(default=None, ge=0)
    ingredients: List[str] = []
    allergens: List[str] = []
    spicy_level: int = Field(default=0, ge=0, le=5)
    rating: float = Field(default=0.0, ge=0, le=5)
    total_reviews: int = Field(default=0, ge=0)
    featured: bool = False
    created_at: datetime
    updated_at: datetime
