"""Inventory request/response schemas."""

from typing import Optional

from pydantic import BaseModel, Field


class InventoryCreate(BaseModel):
    ingredient_name: str = Field(..., min_length=1, max_length=100, examples=["Mozzarella Cheese"])
    quantity: float = Field(..., ge=0, examples=[50.0])
    unit: str = Field(..., min_length=1, max_length=20, examples=["kg"])
    minimum_stock: float = Field(default=10, ge=0, examples=[10.0])
    available: bool = True


class InventoryUpdate(BaseModel):
    ingredient_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    quantity: Optional[float] = Field(default=None, ge=0)
    unit: Optional[str] = Field(default=None, min_length=1, max_length=20)
    minimum_stock: Optional[float] = Field(default=None, ge=0)
    available: Optional[bool] = None


class InventoryResponse(BaseModel):
    inventory_id: str
    ingredient_name: str
    quantity: float
    unit: str
    minimum_stock: float
    available: bool

    model_config = {"from_attributes": True}
