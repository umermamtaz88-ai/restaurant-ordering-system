"""Inventory business logic."""

from typing import Optional

from app.schemas.inventory import InventoryCreate, InventoryUpdate
from app.services.base_service import BaseService
from app.utils.validators import check_duplicate


class InventoryService(BaseService):
    def __init__(self):
        super().__init__("inventory.json", "inventory_id")

    def create_item(
        self, data: InventoryCreate, owner_id: str
    ) -> tuple[Optional[dict], Optional[str]]:
        owner_items = self.filter_owner_items(self.get_all(), owner_id)
        if check_duplicate(
            owner_items, "ingredient_name", data.ingredient_name, id_field="inventory_id"
        ):
            return None, f"Ingredient '{data.ingredient_name}' already exists in inventory"

        item = {
            "inventory_id": self._generate_id("inv"),
            "owner_id": owner_id,
            "ingredient_name": data.ingredient_name,
            "quantity": data.quantity,
            "unit": data.unit,
            "minimum_stock": data.minimum_stock,
            "available": data.available and data.quantity > 0,
        }
        return self.create(item), None

    def update_item(
        self, inventory_id: str, data: InventoryUpdate, owner_id: str
    ) -> tuple[Optional[dict], Optional[str]]:
        existing = self.get_by_id_for_owner(inventory_id, owner_id)
        if not existing:
            return None, "Inventory item not found"

        if data.ingredient_name:
            owner_items = self.filter_owner_items(self.get_all(), owner_id)
            if check_duplicate(
                owner_items,
                "ingredient_name",
                data.ingredient_name,
                exclude_id=inventory_id,
                id_field="inventory_id",
            ):
                return None, f"Ingredient '{data.ingredient_name}' already exists"

        updates = data.model_dump(exclude_unset=True)
        quantity = updates.get("quantity", existing["quantity"])
        if "quantity" in updates and updates["quantity"] < 0:
            return None, "Quantity cannot be negative"
        if "available" not in updates and "quantity" in updates:
            updates["available"] = quantity > 0

        result = self.update_for_owner(inventory_id, owner_id, updates)
        return result, None

    def list_items(
        self,
        owner_id: str,
        q: Optional[str] = None,
        available: Optional[bool] = None,
        low_stock: Optional[bool] = None,
        page: int = 1,
        limit: int = 10,
    ) -> dict:
        items = self.filter_owner_items(self.get_all(), owner_id)

        if available is not None:
            items = [i for i in items if i.get("available") == available]
        if low_stock:
            items = [
                i
                for i in items
                if i.get("quantity", 0) <= i.get("minimum_stock", 0)
            ]

        if q:
            query_lower = q.lower()
            items = [
                i
                for i in items
                if query_lower in i.get("ingredient_name", "").lower()
            ]

        from app.utils.pagination import paginate

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

    def get_low_stock_items(self, owner_id: str) -> list:
        items = self.filter_owner_items(self.get_all(), owner_id)
        return [
            i
            for i in items
            if i.get("quantity", 0) <= i.get("minimum_stock", 0)
        ]


inventory_service = InventoryService()
