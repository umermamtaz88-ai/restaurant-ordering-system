"""Category business logic."""

from typing import Optional

from app.schemas.category import CategoryCreate, CategoryUpdate
from app.services.base_service import BaseService
from app.utils.validators import check_duplicate


class CategoryService(BaseService):
    def __init__(self):
        super().__init__("categories.json", "category_id")

    def create_category(
        self, data: CategoryCreate, owner_id: str
    ) -> tuple[Optional[dict], Optional[str]]:
        owner_items = self.filter_owner_items(self.get_all(), owner_id)
        if check_duplicate(owner_items, "name", data.name, id_field="category_id"):
            return None, f"Category with name '{data.name}' already exists"

        now = self._now()
        category = {
            "category_id": self._generate_id("cat"),
            "owner_id": owner_id,
            "name": data.name,
            "description": data.description,
            "image_url": data.image_url,
            "active": data.active,
            "sort_order": data.sort_order,
            "created_at": now,
            "updated_at": now,
        }
        return self.create(category), None

    def update_category(
        self, category_id: str, data: CategoryUpdate, owner_id: str
    ) -> tuple[Optional[dict], Optional[str]]:
        existing = self.get_by_id_for_owner(category_id, owner_id)
        if not existing:
            return None, "Category not found"

        if data.name:
            owner_items = self.filter_owner_items(self.get_all(), owner_id)
            if check_duplicate(
                owner_items,
                "name",
                data.name,
                exclude_id=category_id,
                id_field="category_id",
            ):
                return None, f"Category with name '{data.name}' already exists"

        updates = data.model_dump(exclude_unset=True)
        updates["updated_at"] = self._now()
        result = self.update_for_owner(category_id, owner_id, updates)
        return result, None

    def list_categories(
        self,
        owner_id: str,
        q: Optional[str] = None,
        active: Optional[bool] = None,
        page: int = 1,
        limit: int = 10,
    ) -> dict:
        return self.search(
            query=q,
            search_fields=["name", "description"],
            filters={"active": active} if active is not None else None,
            filter_fn=lambda i: i.get("owner_id") == owner_id,
            page=page,
            limit=limit,
        )


category_service = CategoryService()
