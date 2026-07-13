"""Reports API routes."""

from fastapi import APIRouter, Depends, Query

from app.core.dependencies import get_current_user
from app.services.report_service import report_service
from app.utils.response import success_response

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get(
    "/daily-sales",
    summary="Daily Sales Report",
    description="Sales report for the last 24 hours for the authenticated user.",
)
async def daily_sales(current_user: dict = Depends(get_current_user)):
    report = report_service.daily_sales(current_user["user_id"])
    return success_response("Daily sales report generated", report)


@router.get(
    "/weekly-sales",
    summary="Weekly Sales Report",
    description="Sales report for the last 7 days for the authenticated user.",
)
async def weekly_sales(current_user: dict = Depends(get_current_user)):
    report = report_service.weekly_sales(current_user["user_id"])
    return success_response("Weekly sales report generated", report)


@router.get(
    "/monthly-sales",
    summary="Monthly Sales Report",
    description="Sales report for the last 30 days for the authenticated user.",
)
async def monthly_sales(current_user: dict = Depends(get_current_user)):
    report = report_service.monthly_sales(current_user["user_id"])
    return success_response("Monthly sales report generated", report)


@router.get(
    "/most-ordered-items",
    summary="Most Ordered Items",
    description="List of most frequently ordered menu items for the authenticated user.",
)
async def most_ordered_items(
    limit: int = Query(10, ge=1, le=50),
    current_user: dict = Depends(get_current_user),
):
    items = report_service.most_ordered_items(current_user["user_id"], limit=limit)
    return success_response("Most ordered items report generated", items)


@router.get(
    "/revenue",
    summary="Revenue Report",
    description=(
        "Comprehensive revenue breakdown by order type and payment method "
        "for the authenticated user."
    ),
)
async def revenue_report(current_user: dict = Depends(get_current_user)):
    report = report_service.revenue_report(current_user["user_id"])
    return success_response("Revenue report generated", report)


@router.get(
    "/inventory",
    summary="Inventory Report",
    description="Inventory status including low stock and out of stock items.",
)
async def inventory_report(current_user: dict = Depends(get_current_user)):
    report = report_service.inventory_report(current_user["user_id"])
    return success_response("Inventory report generated", report)


@router.get(
    "/customers",
    summary="Customer Report",
    description="Customer analytics including top customers and new signups.",
)
async def customer_report(current_user: dict = Depends(get_current_user)):
    report = report_service.customer_report(current_user["user_id"])
    return success_response("Customer report generated", report)
