"""Pagination utilities."""

from math import ceil
from typing import Any, Generic, List, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1, description="Page number (1-indexed)")
    limit: int = Field(default=10, ge=1, le=100, description="Items per page")


class PaginatedResult(BaseModel, Generic[T]):
    items: List[Any]
    total_items: int
    total_pages: int
    current_page: int
    has_next: bool
    has_previous: bool


def paginate(items: List[Any], page: int = 1, limit: int = 10) -> PaginatedResult:
    total_items = len(items)
    total_pages = ceil(total_items / limit) if total_items > 0 else 0
    start = (page - 1) * limit
    end = start + limit
    paginated_items = items[start:end]

    return PaginatedResult(
        items=paginated_items,
        total_items=total_items,
        total_pages=total_pages,
        current_page=page,
        has_next=page < total_pages,
        has_previous=page > 1,
    )
