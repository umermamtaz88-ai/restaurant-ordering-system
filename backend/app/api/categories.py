"""Category API routes."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.dependencies import get_current_user
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.services.category_service import category_service
from app.utils.response import success_response

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get(
    "",
    summary="List Categories",
    description="Get all categories with search, filters, and pagination.",
)
async def list_categories(
    q: Optional[str] = Query(None, description="Search by name or description"),
    active: Optional[bool] = Query(None, description="Filter by active status"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    result = category_service.list_categories(
        owner_id=current_user["user_id"],
        q=q,
        active=active,
        page=page,
        limit=limit,
    )
    return success_response("Categories retrieved successfully", result)


@router.get(
    "/{category_id}",
    summary="Get Category",
    description="Get a single category by ID.",
)
async def get_category(
    category_id: str, current_user: dict = Depends(get_current_user)
):
    category = category_service.get_by_id_for_owner(
        category_id, current_user["user_id"]
    )
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return success_response("Category retrieved successfully", category)


@router.post(
    "",
    summary="Create Category",
    description="Create a new menu category.",
    status_code=201,
)
async def create_category(
    data: CategoryCreate, current_user: dict = Depends(get_current_user)
):
    category, error = category_service.create_category(data, current_user["user_id"])
    if error:
        raise HTTPException(status_code=400, detail=error)
    return success_response("Category created successfully", category)


@router.put(
    "/{category_id}",
    summary="Update Category",
    description="Update an existing category.",
)
async def update_category(
    category_id: str,
    data: CategoryUpdate,
    current_user: dict = Depends(get_current_user),
):
    category, error = category_service.update_category(
        category_id, data, current_user["user_id"]
    )
    if error:
        status = 404 if "not found" in error.lower() else 400
        raise HTTPException(status_code=status, detail=error)
    return success_response("Category updated successfully", category)


@router.delete(
    "/{category_id}",
    summary="Delete Category",
    description="Delete a category by ID.",
)
async def delete_category(
    category_id: str, current_user: dict = Depends(get_current_user)
):
    if not category_service.delete_for_owner(category_id, current_user["user_id"]):
        raise HTTPException(status_code=404, detail="Category not found")
    return success_response("Category deleted successfully", None)
