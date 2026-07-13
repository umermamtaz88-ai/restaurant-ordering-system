"""Category domain model."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class Category(BaseModel):
    category_id: str
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    active: bool = True
    sort_order: int = 0
    created_at: datetime
    updated_at: datetime
