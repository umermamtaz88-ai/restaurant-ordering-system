"""Order domain models."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from app.utils.constants import (
    OrderStatus,
    OrderType,
    PaymentMethod,
    PaymentStatus,
)


class OrderItem(BaseModel):
    item_id: str
    name: str
    quantity: int = Field(ge=1)
    unit_price: float = Field(ge=0)
    total_price: float = Field(ge=0)


class Order(BaseModel):
    order_id: str
    customer_id: str
    order_number: str
    order_type: OrderType
    items: List[OrderItem]
    subtotal: float = Field(ge=0)
    discount: float = Field(default=0, ge=0)
    tax: float = Field(ge=0)
    delivery_fee: float = Field(default=0, ge=0)
    total: float = Field(ge=0)
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    order_status: OrderStatus
    coupon_code: Optional[str] = None
    estimated_time: Optional[int] = Field(default=None, ge=0, description="Minutes")
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
