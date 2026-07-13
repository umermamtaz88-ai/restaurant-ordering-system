"""Customer domain model."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Customer(BaseModel):
    customer_id: str
    full_name: str
    email: str
    phone: str
    address: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
