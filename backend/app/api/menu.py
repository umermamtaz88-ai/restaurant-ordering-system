"""Menu API routes."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.dependencies import get_current_user
from app.schemas.menu import MenuItemCreate, MenuItemUpdate
from app.services.menu_service import menu_service
from app.utils.response import success_response

router = APIRouter(prefix="/menu", tags=["Menu"])


@router.get(
    "",
    summary="List Menu Items",
    description="Get all menu items with search, filters, and pagination.",
)
async def list_menu_items(
    q: Optional[str] = Query(None, description="Search by name, description, or ingredients"),
    available: Optional[bool] = Query(None, description="Filter by availability"),
    featured: Optional[bool] = Query(None, description="Filter featured items"),
    category_id: Optional[str] = Query(None, description="Filter by category"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    result = menu_service.list_items(
        owner_id=current_user["user_id"],
        q=q,
        available=available,
        featured=featured,
        category_id=category_id,
        min_price=min_price,
        max_price=max_price,
        page=page,
        limit=limit,
    )
    return success_response("Menu items retrieved successfully", result)


@router.get(
    "/{item_id}",
    summary="Get Menu Item",
    description="Get a single menu item by ID.",
)
async def get_menu_item(item_id: str, current_user: dict = Depends(get_current_user)):
    item = menu_service.get_by_id_for_owner(item_id, current_user["user_id"])
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return success_response("Menu item retrieved successfully", item)


@router.post(
    "",
    summary="Create Menu Item",
    description="Create a new menu item.",
    status_code=201,
)
async def create_menu_item(
    data: MenuItemCreate, current_user: dict = Depends(get_current_user)
):
    item, error = menu_service.create_item(data, current_user["user_id"])
    if error:
        raise HTTPException(status_code=400, detail=error)
    return success_response("Menu item created successfully", item)


@router.put(
    "/{item_id}",
    summary="Update Menu Item",
    description="Update an existing menu item.",
)
async def update_menu_item(
    item_id: str,
    data: MenuItemUpdate,
    current_user: dict = Depends(get_current_user),
):
    item, error = menu_service.update_item(item_id, data, current_user["user_id"])
    if error:
        status = 404 if "not found" in error.lower() else 400
        raise HTTPException(status_code=status, detail=error)
    return success_response("Menu item updated successfully", item)


@router.delete(
    "/{item_id}",
    summary="Delete Menu Item",
    description="Delete a menu item by ID.",
)
async def delete_menu_item(
    item_id: str, current_user: dict = Depends(get_current_user)
):
    if not menu_service.delete_for_owner(item_id, current_user["user_id"]):
        raise HTTPException(status_code=404, detail="Menu item not found")
    return success_response("Menu item deleted successfully", None)
