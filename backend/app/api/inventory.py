"""Inventory API routes."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.dependencies import get_current_user
from app.schemas.inventory import InventoryCreate, InventoryUpdate
from app.services.inventory_service import inventory_service
from app.utils.response import success_response

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.get(
    "",
    summary="List Inventory Items",
    description="Get all inventory items with search, filters, and pagination.",
)
async def list_inventory(
    q: Optional[str] = Query(None, description="Search by ingredient name"),
    available: Optional[bool] = Query(None, description="Filter by availability"),
    low_stock: Optional[bool] = Query(None, description="Filter low stock items"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    result = inventory_service.list_items(
        owner_id=current_user["user_id"],
        q=q,
        available=available,
        low_stock=low_stock,
        page=page,
        limit=limit,
    )
    return success_response("Inventory items retrieved successfully", result)


@router.get(
    "/{inventory_id}",
    summary="Get Inventory Item",
    description="Get a single inventory item by ID.",
)
async def get_inventory_item(
    inventory_id: str, current_user: dict = Depends(get_current_user)
):
    item = inventory_service.get_by_id_for_owner(
        inventory_id, current_user["user_id"]
    )
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return success_response("Inventory item retrieved successfully", item)


@router.post(
    "",
    summary="Create Inventory Item",
    description="Add a new ingredient to inventory.",
    status_code=201,
)
async def create_inventory_item(
    data: InventoryCreate, current_user: dict = Depends(get_current_user)
):
    item, error = inventory_service.create_item(data, current_user["user_id"])
    if error:
        raise HTTPException(status_code=400, detail=error)
    return success_response("Inventory item created successfully", item)


@router.put(
    "/{inventory_id}",
    summary="Update Inventory Item",
    description="Update an existing inventory item.",
)
async def update_inventory_item(
    inventory_id: str,
    data: InventoryUpdate,
    current_user: dict = Depends(get_current_user),
):
    item, error = inventory_service.update_item(
        inventory_id, data, current_user["user_id"]
    )
    if error:
        status = 404 if "not found" in error.lower() else 400
        raise HTTPException(status_code=status, detail=error)
    return success_response("Inventory item updated successfully", item)


@router.delete(
    "/{inventory_id}",
    summary="Delete Inventory Item",
    description="Delete an inventory item by ID.",
)
async def delete_inventory_item(
    inventory_id: str, current_user: dict = Depends(get_current_user)
):
    if not inventory_service.delete_for_owner(inventory_id, current_user["user_id"]):
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return success_response("Inventory item deleted successfully", None)
