"""Health check endpoint."""

from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    summary="Health Check",
    description="Returns the health status of the API server.",
    response_model=dict,
    status_code=200,
)
async def health_check():
    return {"status": "healthy"}
