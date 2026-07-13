"""Common schema definitions."""

from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationMeta(BaseModel):
    total_items: int
    total_pages: int
    current_page: int
    has_next: bool
    has_previous: bool


class PaginatedData(BaseModel, Generic[T]):
    items: List[T]
    pagination: PaginationMeta


class SearchQuery(BaseModel):
    q: Optional[str] = Field(default=None, description="Search query string")
