"""Dashboard API routes."""

from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.services.dashboard_service import dashboard_service
from app.utils.response import success_response

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get(
    "",
    summary="Dashboard Statistics",
    description=(
        "Returns key business metrics including orders, revenue, popular items, "
        "top customers, and low stock alerts for the authenticated user."
    ),
)
async def get_dashboard(current_user: dict = Depends(get_current_user)):
    stats = dashboard_service.get_stats(current_user["user_id"])
    return success_response("Dashboard statistics retrieved successfully", stats)
