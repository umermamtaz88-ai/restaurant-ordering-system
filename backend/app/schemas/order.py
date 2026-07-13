"""Order request/response schemas."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from app.utils.constants import (
    OrderStatus,
    OrderType,
    PaymentMethod,
    PaymentStatus,
)


class OrderItemCreate(BaseModel):
    item_id: str = Field(..., examples=["item-001"])
    quantity: int = Field(..., ge=1, examples=[2])


class OrderCreate(BaseModel):
    customer_id: str = Field(..., examples=["cust-001"])
    order_type: OrderType = Field(..., examples=["Delivery"])
    items: List[OrderItemCreate] = Field(..., min_length=1)
    payment_method: PaymentMethod = Field(..., examples=["Card"])
    coupon_code: Optional[str] = Field(default=None, examples=["SAVE10"])
    notes: Optional[str] = Field(default=None, examples=["Extra napkins please"])


class OrderUpdate(BaseModel):
    order_status: Optional[OrderStatus] = None
    payment_status: Optional[PaymentStatus] = None
    payment_method: Optional[PaymentMethod] = None
    notes: Optional[str] = None


class OrderItemResponse(BaseModel):
    item_id: str
    name: str
    quantity: int
    unit_price: float
    total_price: float


class OrderResponse(BaseModel):
    order_id: str
    customer_id: str
    order_number: str
    order_type: OrderType
    items: List[OrderItemResponse]
    subtotal: float
    discount: float
    tax: float
    delivery_fee: float
    total: float
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    order_status: OrderStatus
    coupon_code: Optional[str] = None
    estimated_time: Optional[int] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
