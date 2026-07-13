"""Inventory domain model."""

from pydantic import BaseModel, Field


class InventoryItem(BaseModel):
    inventory_id: str
    ingredient_name: str
    quantity: float = Field(ge=0)
    unit: str
    minimum_stock: float = Field(ge=0)
    available: bool = True
