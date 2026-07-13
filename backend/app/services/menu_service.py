"""Menu business logic."""

from typing import Optional

from app.schemas.menu import MenuItemCreate, MenuItemUpdate
from app.services.base_service import BaseService
from app.services.category_service import category_service
from app.utils.validators import check_duplicate


class MenuService(BaseService):
    def __init__(self):
        super().__init__("menu.json", "item_id")

    def create_item(
        self, data: MenuItemCreate, owner_id: str
    ) -> tuple[Optional[dict], Optional[str]]:
        if not category_service.get_by_id_for_owner(data.category_id, owner_id):
            return None, f"Category '{data.category_id}' not found"

        owner_items = self.filter_owner_items(self.get_all(), owner_id)
        if check_duplicate(owner_items, "name", data.name, id_field="item_id"):
            return None, f"Menu item with name '{data.name}' already exists"

        if data.discount_price is not None and data.discount_price >= data.price:
            return None, "Discount price must be less than regular price"

        now = self._now()
        item = {
            "item_id": self._generate_id("item"),
            "owner_id": owner_id,
            "name": data.name,
            "description": data.description,
            "category_id": data.category_id,
            "image_url": data.image_url,
            "price": data.price,
            "discount_price": data.discount_price,
            "available": data.available,
            "preparation_time": data.preparation_time,
            "calories": data.calories,
            "ingredients": data.ingredients,
            "allergens": data.allergens,
            "spicy_level": data.spicy_level,
            "rating": 0.0,
            "total_reviews": 0,
            "featured": data.featured,
            "created_at": now,
            "updated_at": now,
        }
        return self.create(item), None

    def update_item(
        self, item_id: str, data: MenuItemUpdate, owner_id: str
    ) -> tuple[Optional[dict], Optional[str]]:
        existing = self.get_by_id_for_owner(item_id, owner_id)
        if not existing:
            return None, "Menu item not found"

        if data.category_id and not category_service.get_by_id_for_owner(
            data.category_id, owner_id
        ):
            return None, f"Category '{data.category_id}' not found"

        if data.name:
            owner_items = self.filter_owner_items(self.get_all(), owner_id)
            if check_duplicate(
                owner_items, "name", data.name, exclude_id=item_id, id_field="item_id"
            ):
                return None, f"Menu item with name '{data.name}' already exists"

        price = data.price if data.price is not None else existing["price"]
        discount = (
            data.discount_price
            if data.discount_price is not None
            else existing.get("discount_price")
        )
        if discount is not None and discount >= price:
            return None, "Discount price must be less than regular price"

        updates = data.model_dump(exclude_unset=True)
        updates["updated_at"] = self._now()
        result = self.update_for_owner(item_id, owner_id, updates)
        return result, None

    def list_items(
        self,
        owner_id: str,
        q: Optional[str] = None,
        available: Optional[bool] = None,
        featured: Optional[bool] = None,
        category_id: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        page: int = 1,
        limit: int = 10,
    ) -> dict:
        items = self.filter_owner_items(self.get_all(), owner_id)

        if available is not None:
            items = [i for i in items if i.get("available") == available]
        if featured is not None:
            items = [i for i in items if i.get("featured") == featured]
        if category_id:
            items = [i for i in items if i.get("category_id") == category_id]
        if min_price is not None:
            items = [i for i in items if i.get("price", 0) >= min_price]
        if max_price is not None:
            items = [i for i in items if i.get("price", 0) <= max_price]

        if q:
            query_lower = q.lower()
            items = [
                i
                for i in items
                if query_lower in i.get("name", "").lower()
                or query_lower in (i.get("description") or "").lower()
                or any(query_lower in ing.lower() for ing in i.get("ingredients", []))
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

    def get_effective_price(self, item: dict) -> float:
        discount = item.get("discount_price")
        if discount is not None and discount < item["price"]:
            return discount
        return item["price"]


menu_service = MenuService()
