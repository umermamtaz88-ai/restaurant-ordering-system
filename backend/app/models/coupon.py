"""Coupon domain model."""

from datetime import date
from typing import Optional

from pydantic import BaseModel, Field

from app.utils.constants import CouponType


class Coupon(BaseModel):
    coupon_id: str
    code: str
    type: CouponType
    value: float = Field(ge=0)
    minimum_order: float = Field(default=0, ge=0)
    expiry_date: date
    active: bool = True
