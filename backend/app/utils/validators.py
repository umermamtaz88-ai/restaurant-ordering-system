"""Shared validation helpers."""

import re
from datetime import datetime
from typing import List, Optional


def validate_email(email: str) -> bool:
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))


def validate_positive_price(price: float) -> bool:
    return price >= 0


def validate_positive_quantity(quantity: int) -> bool:
    return quantity > 0


def check_duplicate(
    items: List[dict],
    field: str,
    value: str,
    exclude_id: Optional[str] = None,
    id_field: str = "id",
) -> bool:
    """Return True if a duplicate exists."""
    value_lower = value.lower() if isinstance(value, str) else value
    for item in items:
        if exclude_id and item.get(id_field) == exclude_id:
            continue
        item_value = item.get(field)
        if item_value is None:
            continue
        compare = item_value.lower() if isinstance(item_value, str) else item_value
        if compare == value_lower:
            return True
    return False


def parse_date(date_str: Optional[str]) -> Optional[datetime]:
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    except ValueError:
        return None


def is_within_date_range(
    date_str: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
) -> bool:
    item_date = parse_date(date_str)
    if not item_date:
        return False
    if start_date:
        start = parse_date(start_date)
        if start and item_date < start:
            return False
    if end_date:
        end = parse_date(end_date)
        if end and item_date > end:
            return False
    return True
