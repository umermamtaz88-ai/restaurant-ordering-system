"""Base service with common CRUD operations (PostgreSQL-backed)."""

from datetime import datetime, timezone
from typing import Any, Callable, Dict, List, Optional
from uuid import uuid4

from app.db.repository import DbRepository
from app.utils.pagination import paginate


class BaseService:
    """Abstract base for PostgreSQL-backed entity services."""

    def __init__(self, filename: str, id_field: str):
        self.store = DbRepository(filename)
        self.id_field = id_field

    def _generate_id(self, prefix: str) -> str:
        return f"{prefix}-{uuid4().hex[:8]}"

    def _now(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    def get_all(self) -> List[dict]:
        return self.store.read_all()

    def get_by_id(self, entity_id: str) -> Optional[dict]:
        return self.store.find_by_id(self.id_field, entity_id)

    def belongs_to_owner(self, item: dict, owner_id: str) -> bool:
        return item.get("owner_id") == owner_id

    def filter_owner_items(self, items: List[dict], owner_id: str) -> List[dict]:
        return [i for i in items if i.get("owner_id") == owner_id]

    def get_by_id_for_owner(self, entity_id: str, owner_id: str) -> Optional[dict]:
        item = self.get_by_id(entity_id)
        if item and self.belongs_to_owner(item, owner_id):
            return item
        return None

    def delete_for_owner(self, entity_id: str, owner_id: str) -> bool:
        if not self.get_by_id_for_owner(entity_id, owner_id):
            return False
        return self.delete(entity_id)

    def update_for_owner(
        self, entity_id: str, owner_id: str, updates: dict
    ) -> Optional[dict]:
        if not self.get_by_id_for_owner(entity_id, owner_id):
            return None
        return self.update(entity_id, updates)

    def create(self, data: dict) -> dict:
        return self.store.insert(data)

    def update(self, entity_id: str, updates: dict) -> Optional[dict]:
        return self.store.update_by_id(self.id_field, entity_id, updates)

    def delete(self, entity_id: str) -> bool:
        return self.store.delete_by_id(self.id_field, entity_id)

    def search(
        self,
        query: Optional[str],
        search_fields: List[str],
        filters: Optional[Dict[str, Any]] = None,
        filter_fn: Optional[Callable[[dict], bool]] = None,
        page: int = 1,
        limit: int = 10,
    ) -> dict:
        items = self.get_all()

        if filters:
            for field, value in filters.items():
                if value is not None:
                    items = [i for i in items if i.get(field) == value]

        if filter_fn:
            items = [i for i in items if filter_fn(i)]

        if query:
            query_lower = query.lower()
            items = [
                i
                for i in items
                if any(
                    query_lower in str(i.get(f, "")).lower()
                    for f in search_fields
                )
            ]

        result = paginate(items, page, limit)
        return {
            "items": result.items,
            "pagination": {
                "total_items": result.total_items,
                "total_pages": result.total_pages,
                "current_page": result.current_page,
                "has_next": result.has_next,
                "has_previous": result.has_previous,
            },
        }
