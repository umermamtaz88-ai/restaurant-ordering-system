"""Coupon API routes."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.dependencies import get_current_user
from app.schemas.coupon import CouponCreate, CouponUpdate
from app.services.coupon_service import coupon_service
from app.utils.response import success_response

router = APIRouter(prefix="/coupons", tags=["Coupons"])


@router.get(
    "",
    summary="List Coupons",
    description="Get all coupons with search, filters, and pagination.",
)
async def list_coupons(
    q: Optional[str] = Query(None, description="Search by coupon code"),
    active: Optional[bool] = Query(None, description="Filter by active status"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    result = coupon_service.list_coupons(
        owner_id=current_user["user_id"],
        q=q,
        active=active,
        page=page,
        limit=limit,
    )
    return success_response("Coupons retrieved successfully", result)


@router.get(
    "/{coupon_id}",
    summary="Get Coupon",
    description="Get a single coupon by ID.",
)
async def get_coupon(coupon_id: str, current_user: dict = Depends(get_current_user)):
    coupon = coupon_service.get_by_id_for_owner(coupon_id, current_user["user_id"])
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return success_response("Coupon retrieved successfully", coupon)


@router.post(
    "",
    summary="Create Coupon",
    description="Create a new discount coupon.",
    status_code=201,
)
async def create_coupon(
    data: CouponCreate, current_user: dict = Depends(get_current_user)
):
    coupon, error = coupon_service.create_coupon(data, current_user["user_id"])
    if error:
        raise HTTPException(status_code=400, detail=error)
    return success_response("Coupon created successfully", coupon)


@router.put(
    "/{coupon_id}",
    summary="Update Coupon",
    description="Update an existing coupon.",
)
async def update_coupon(
    coupon_id: str,
    data: CouponUpdate,
    current_user: dict = Depends(get_current_user),
):
    coupon, error = coupon_service.update_coupon(
        coupon_id, data, current_user["user_id"]
    )
    if error:
        status = 404 if "not found" in error.lower() else 400
        raise HTTPException(status_code=status, detail=error)
    return success_response("Coupon updated successfully", coupon)


@router.delete(
    "/{coupon_id}",
    summary="Delete Coupon",
    description="Delete a coupon by ID.",
)
async def delete_coupon(
    coupon_id: str, current_user: dict = Depends(get_current_user)
):
    if not coupon_service.delete_for_owner(coupon_id, current_user["user_id"]):
        raise HTTPException(status_code=404, detail="Coupon not found")
    return success_response("Coupon deleted successfully", None)
