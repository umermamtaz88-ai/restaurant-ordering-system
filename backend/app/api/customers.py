"""Customer API routes."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.dependencies import get_current_user
from app.schemas.customer import CustomerCreate, CustomerUpdate
from app.services.customer_service import customer_service
from app.utils.response import success_response

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.get(
    "",
    summary="List Customers",
    description="Get all customers with search, filters, and pagination.",
)
async def list_customers(
    q: Optional[str] = Query(None, description="Search by name, email, or phone"),
    name: Optional[str] = Query(None, description="Filter by name"),
    phone: Optional[str] = Query(None, description="Filter by phone"),
    email: Optional[str] = Query(None, description="Filter by email"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    result = customer_service.list_customers(
        owner_id=current_user["user_id"],
        q=q,
        name=name,
        phone=phone,
        email=email,
        page=page,
        limit=limit,
    )
    return success_response("Customers retrieved successfully", result)


@router.get(
    "/{customer_id}",
    summary="Get Customer",
    description="Get a single customer by ID.",
)
async def get_customer(
    customer_id: str, current_user: dict = Depends(get_current_user)
):
    customer = customer_service.get_by_id_for_owner(
        customer_id, current_user["user_id"]
    )
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return success_response("Customer retrieved successfully", customer)


@router.post(
    "",
    summary="Create Customer",
    description="Create a new customer.",
    status_code=201,
)
async def create_customer(
    data: CustomerCreate, current_user: dict = Depends(get_current_user)
):
    customer, error = customer_service.create_customer(data, current_user["user_id"])
    if error:
        raise HTTPException(status_code=400, detail=error)
    return success_response("Customer created successfully", customer)


@router.put(
    "/{customer_id}",
    summary="Update Customer",
    description="Update an existing customer.",
)
async def update_customer(
    customer_id: str,
    data: CustomerUpdate,
    current_user: dict = Depends(get_current_user),
):
    customer, error = customer_service.update_customer(
        customer_id, data, current_user["user_id"]
    )
    if error:
        status = 404 if "not found" in error.lower() else 400
        raise HTTPException(status_code=status, detail=error)
    return success_response("Customer updated successfully", customer)


@router.delete(
    "/{customer_id}",
    summary="Delete Customer",
    description="Delete a customer by ID.",
)
async def delete_customer(
    customer_id: str, current_user: dict = Depends(get_current_user)
):
    if not customer_service.delete_for_owner(customer_id, current_user["user_id"]):
        raise HTTPException(status_code=404, detail="Customer not found")
    return success_response("Customer deleted successfully", None)
