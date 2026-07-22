"""Order API routes."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.dependencies import get_current_user, require_kitchen_staff
from app.schemas.order import (
    KitchenStatusUpdate,
    OrderCreate,
    OrderUpdate,
    StorefrontCheckoutRequest,
)
from app.services.order_service import order_service
from app.utils.constants import OrderStatus, OrderType, PaymentStatus
from app.utils.response import success_response

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get(
    "",
    summary="List Orders",
    description="Get all orders with search, filters, and pagination.",
)
async def list_orders(
    q: Optional[str] = Query(None, description="Search by order number or customer ID"),
    order_status: Optional[OrderStatus] = Query(None, description="Filter by order status"),
    payment_status: Optional[PaymentStatus] = Query(
        None, description="Filter by payment status"
    ),
    order_type: Optional[OrderType] = Query(None, description="Filter by order type"),
    start_date: Optional[str] = Query(None, description="Filter from date (ISO format)"),
    end_date: Optional[str] = Query(None, description="Filter to date (ISO format)"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    result = order_service.list_orders(
        owner_id=current_user["user_id"],
        q=q,
        order_status=order_status.value if order_status else None,
        payment_status=payment_status.value if payment_status else None,
        order_type=order_type.value if order_type else None,
        start_date=start_date,
        end_date=end_date,
        page=page,
        limit=limit,
    )
    return success_response("Orders retrieved successfully", result)


@router.get(
    "/kitchen",
    summary="Kitchen Order Queue",
    description="List café orders for kitchen staff (chef / admin / owner).",
)
async def kitchen_queue(
    active_only: bool = Query(True, description="Hide completed/cancelled/delivered"),
    q: Optional[str] = Query(None, description="Search order number"),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    _staff: dict = Depends(require_kitchen_staff),
):
    result = order_service.list_kitchen_orders(
        active_only=active_only,
        q=q,
        page=page,
        limit=limit,
    )
    return success_response("Kitchen queue retrieved successfully", result)


@router.put(
    "/{order_id}/kitchen-status",
    summary="Update Kitchen Order Status",
    description="Advance an order status from the kitchen board.",
)
async def kitchen_update_status(
    order_id: str,
    data: KitchenStatusUpdate,
    _staff: dict = Depends(require_kitchen_staff),
):
    order, error = order_service.update_kitchen_status(order_id, data.order_status)
    if error:
        raise HTTPException(status_code=404, detail=error)
    return success_response("Order status updated", order)


@router.post(
    "/checkout",
    summary="Storefront Checkout",
    description=(
        "Place an order from the public café storefront cart. "
        "Creates/links a customer for the authenticated user and persists the order."
    ),
    status_code=201,
)
async def storefront_checkout(
    data: StorefrontCheckoutRequest,
    current_user: dict = Depends(get_current_user),
):
    try:
        order, error = order_service.create_storefront_order(data, current_user)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    if error:
        raise HTTPException(status_code=400, detail=error)
    return success_response("Order placed successfully", order)


@router.get(
    "/{order_id}",
    summary="Get Order",
    description="Get a single order by ID.",
)
async def get_order(order_id: str, current_user: dict = Depends(get_current_user)):
    order = order_service.get_by_id_for_owner(order_id, current_user["user_id"])
    if not order:
        # Kitchen staff may look up any order
        role = (current_user.get("role") or "").lower()
        if role in {"chef", "admin", "owner"}:
            order = order_service.get_by_id(order_id)
            if order:
                order = order_service._enrich_order_for_kitchen(order)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return success_response("Order retrieved successfully", order)


@router.post(
    "",
    summary="Create Order",
    description=(
        "Create a new order. Validates items, applies coupons, calculates tax "
        "and delivery fees, and generates a unique order number."
    ),
    status_code=201,
)
async def create_order(data: OrderCreate, current_user: dict = Depends(get_current_user)):
    order, error = order_service.create_order(data, current_user["user_id"])
    if error:
        raise HTTPException(status_code=400, detail=error)
    return success_response("Order created successfully", order)


@router.put(
    "/{order_id}",
    summary="Update Order",
    description="Update order status, payment status, or notes.",
)
async def update_order(
    order_id: str,
    data: OrderUpdate,
    current_user: dict = Depends(get_current_user),
):
    order, error = order_service.update_order(order_id, data, current_user["user_id"])
    if error:
        raise HTTPException(status_code=404, detail=error)
    return success_response("Order updated successfully", order)


@router.delete(
    "/{order_id}",
    summary="Delete Order",
    description="Delete an order by ID.",
)
async def delete_order(order_id: str, current_user: dict = Depends(get_current_user)):
    if not order_service.delete_for_owner(order_id, current_user["user_id"]):
        raise HTTPException(status_code=404, detail="Order not found")
    return success_response("Order deleted successfully", None)
