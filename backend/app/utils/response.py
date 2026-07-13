"""Standard API response helpers."""

from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: Optional[T] = None


def success_response(message: str, data: Any = None) -> dict:
    return {"success": True, "message": message, "data": data}


def error_response(message: str) -> dict:
    return {"success": False, "message": message, "data": None}
