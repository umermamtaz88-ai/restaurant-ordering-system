"""Coupon request/response schemas."""

from datetime import date
from typing import Optional

from pydantic import BaseModel, Field

from app.utils.constants import CouponType


class CouponCreate(BaseModel):
    code: str = Field(..., min_length=3, max_length=20, examples=["SAVE10"])
    type: CouponType = Field(..., examples=["Percentage"])
    value: float = Field(..., gt=0, examples=[10])
    minimum_order: float = Field(default=0, ge=0, examples=[25.0])
    expiry_date: date = Field(..., examples=["2026-12-31"])
    active: bool = True


class CouponUpdate(BaseModel):
    code: Optional[str] = Field(default=None, min_length=3, max_length=20)
    type: Optional[CouponType] = None
    value: Optional[float] = Field(default=None, gt=0)
    minimum_order: Optional[float] = Field(default=None, ge=0)
    expiry_date: Optional[date] = None
    active: Optional[bool] = None


class CouponResponse(BaseModel):
    coupon_id: str
    code: str
    type: CouponType
    value: float
    minimum_order: float
    expiry_date: date
    active: bool

    model_config = {"from_attributes": True}
