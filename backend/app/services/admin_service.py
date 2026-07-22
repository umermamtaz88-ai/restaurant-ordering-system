"""Admin business logic — global (non-owner-scoped) control of café data."""

from typing import Any, Optional

from app.core.auth import public_user_profile
from app.core.security import (
    hash_password,
    normalize_phone,
    validate_password_strength,
    validate_phone,
)
from app.db.repository import DbRepository
from app.schemas.admin import AdminUserCreate, AdminUserUpdate, ALLOWED_ADMIN_ROLES
from app.services.auth_service import auth_service
from app.services.category_service import category_service
from app.services.coupon_service import coupon_service
from app.services.customer_service import customer_service
from app.services.inventory_service import inventory_service
from app.services.menu_service import menu_service
from app.services.order_service import order_service
from app.utils.constants import OrderStatus, PaymentStatus
from app.utils.pagination import paginate
from app.utils.validators import validate_email


class AdminService:
    def __init__(self):
        self.users = DbRepository("users.json")

    # ── Users ──────────────────────────────────────────────

    def list_users(
        self,
        *,
        q: Optional[str] = None,
        role: Optional[str] = None,
        page: int = 1,
        limit: int = 50,
    ) -> dict:
        items = [public_user_profile(u) for u in self.users.read_all()]
        if role:
            items = [u for u in items if (u.get("role") or "").lower() == role.lower()]
        if q:
            ql = q.lower()
            items = [
                u
                for u in items
                if ql in (u.get("full_name") or "").lower()
                or ql in (u.get("email") or "").lower()
                or ql in (u.get("phone") or "").lower()
            ]
        items.sort(key=lambda u: u.get("created_at") or "", reverse=True)
        return self._page(items, page, limit)

    def create_user(self, data: AdminUserCreate) -> tuple[Optional[dict], Optional[str]]:
        if not validate_email(data.email):
            return None, "Invalid email format"
        password_error = validate_password_strength(data.password)
        if password_error:
            return None, password_error
        if not validate_phone(data.phone):
            return None, "Invalid phone number format"
        role = (data.role or "customer").lower()
        if role not in ALLOWED_ADMIN_ROLES:
            return None, f"Invalid role. Use: {', '.join(ALLOWED_ADMIN_ROLES)}"
        if auth_service.get_user_by_email(data.email):
            return None, f"User with email '{data.email}' already exists"

        now = auth_service._now()
        user = {
            "user_id": auth_service._generate_user_id(),
            "full_name": data.full_name.strip(),
            "email": data.email.lower(),
            "password_hash": hash_password(data.password),
            "phone": normalize_phone(data.phone),
            "address": None,
            "avatar_url": None,
            "role": role,
            "is_active": data.is_active,
            "created_at": now,
            "updated_at": now,
        }
        created = self.users.insert(user)
        return public_user_profile(created), None

    def update_user(
        self, user_id: str, data: AdminUserUpdate
    ) -> tuple[Optional[dict], Optional[str]]:
        existing = self.users.find_by_id("user_id", user_id)
        if not existing:
            return None, "User not found"

        updates: dict[str, Any] = {}
        if data.full_name is not None:
            updates["full_name"] = data.full_name.strip()
        if data.phone is not None:
            if not validate_phone(data.phone):
                return None, "Invalid phone number format"
            updates["phone"] = normalize_phone(data.phone)
        if data.address is not None:
            updates["address"] = data.address
        if data.role is not None:
            role = data.role.lower()
            if role not in ALLOWED_ADMIN_ROLES:
                return None, f"Invalid role. Use: {', '.join(ALLOWED_ADMIN_ROLES)}"
            updates["role"] = role
        if data.is_active is not None:
            updates["is_active"] = data.is_active
        if data.password is not None:
            password_error = validate_password_strength(data.password)
            if password_error:
                return None, password_error
            updates["password_hash"] = hash_password(data.password)

        updates["updated_at"] = auth_service._now()
        updated = self.users.update_by_id("user_id", user_id, updates)
        if not updated:
            return None, "Unable to update user"
        return public_user_profile(updated), None

    def delete_user(self, user_id: str, actor_id: str) -> tuple[bool, Optional[str]]:
        if user_id == actor_id:
            return False, "Cannot delete your own admin account"
        if not self.users.delete_by_id("user_id", user_id):
            return False, "User not found"
        return True, None

    # ── Global lists ───────────────────────────────────────

    def list_all_orders(
        self,
        *,
        q: Optional[str] = None,
        order_status: Optional[str] = None,
        page: int = 1,
        limit: int = 50,
    ) -> dict:
        items = list(order_service.get_all())
        if order_status:
            items = [i for i in items if i.get("order_status") == order_status]
        if q:
            ql = q.lower()
            items = [
                i
                for i in items
                if ql in (i.get("order_number") or "").lower()
                or ql in (i.get("order_id") or "").lower()
                or ql in (i.get("customer_id") or "").lower()
            ]
        items.sort(key=lambda o: o.get("created_at") or "", reverse=True)
        page_data = self._page(items, page, limit)
        page_data["items"] = order_service._enrich_orders_batch(page_data["items"])
        return page_data

    def list_all_menu(self, *, q: Optional[str] = None, page: int = 1, limit: int = 50) -> dict:
        items = list(menu_service.get_all())
        if q:
            ql = q.lower()
            items = [
                i
                for i in items
                if ql in (i.get("name") or "").lower()
                or ql in (i.get("item_id") or "").lower()
            ]
        items.sort(key=lambda i: i.get("name") or "")
        return self._page(items, page, limit)

    def list_all_categories(
        self, *, q: Optional[str] = None, page: int = 1, limit: int = 50
    ) -> dict:
        items = list(category_service.get_all())
        if q:
            ql = q.lower()
            items = [i for i in items if ql in (i.get("name") or "").lower()]
        items.sort(key=lambda i: i.get("sort_order", 0))
        return self._page(items, page, limit)

    def list_all_customers(
        self, *, q: Optional[str] = None, page: int = 1, limit: int = 50
    ) -> dict:
        items = list(customer_service.get_all())
        if q:
            ql = q.lower()
            items = [
                i
                for i in items
                if ql in (i.get("full_name") or "").lower()
                or ql in (i.get("email") or "").lower()
                or ql in (i.get("phone") or "").lower()
            ]
        items.sort(key=lambda i: i.get("created_at") or "", reverse=True)
        return self._page(items, page, limit)

    def list_all_coupons(
        self, *, q: Optional[str] = None, page: int = 1, limit: int = 50
    ) -> dict:
        items = list(coupon_service.get_all())
        if q:
            ql = q.lower()
            items = [i for i in items if ql in (i.get("code") or "").lower()]
        return self._page(items, page, limit)

    def list_all_inventory(
        self, *, q: Optional[str] = None, page: int = 1, limit: int = 50
    ) -> dict:
        items = list(inventory_service.get_all())
        if q:
            ql = q.lower()
            items = [
                i for i in items if ql in (i.get("ingredient_name") or "").lower()
            ]
        return self._page(items, page, limit)

    def get_global_stats(self) -> dict:
        orders = order_service.get_all()
        users = self.users.read_all()
        menu = menu_service.get_all()
        customers = customer_service.get_all()
        inventory = inventory_service.get_all()

        from datetime import datetime, timezone

        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        todays = [o for o in orders if (o.get("created_at") or "").startswith(today)]
        completed = [
            o
            for o in orders
            if o.get("order_status")
            in (OrderStatus.COMPLETED.value, OrderStatus.DELIVERED.value)
        ]
        pending = [
            o
            for o in orders
            if o.get("order_status")
            in (
                OrderStatus.PENDING.value,
                OrderStatus.CONFIRMED.value,
                OrderStatus.PREPARING.value,
                OrderStatus.READY.value,
            )
        ]

        def revenue(rows: list) -> float:
            return round(sum(float(o.get("total") or 0) for o in rows), 2)

        low_stock = [
            i
            for i in inventory
            if float(i.get("quantity") or 0) <= float(i.get("minimum_stock") or 0)
        ]

        return {
            "total_orders": len(orders),
            "todays_orders": len(todays),
            "todays_revenue": revenue(todays),
            "total_revenue": revenue(completed),
            "pending_orders": len(pending),
            "completed_orders": len(completed),
            "cancelled_orders": sum(
                1 for o in orders if o.get("order_status") == OrderStatus.CANCELLED.value
            ),
            "total_users": len(users),
            "total_customers": len(customers),
            "total_menu_items": len(menu),
            "available_menu_items": sum(1 for m in menu if m.get("available")),
            "low_stock_items": low_stock[:10],
            "recent_orders": order_service._enrich_orders_batch(
                sorted(orders, key=lambda o: o.get("created_at") or "", reverse=True)[:8]
            ),
        }

    def update_order_global(self, order_id: str, updates: dict) -> tuple[Optional[dict], Optional[str]]:
        existing = order_service.get_by_id(order_id)
        if not existing:
            return None, "Order not found"
        updates["updated_at"] = order_service._now()
        if (
            updates.get("order_status") in (
                OrderStatus.COMPLETED.value,
                OrderStatus.DELIVERED.value,
            )
            and existing.get("payment_status") == PaymentStatus.PENDING.value
        ):
            updates.setdefault("payment_status", PaymentStatus.PAID.value)
        updated = order_service.update(order_id, updates)
        if not updated:
            return None, "Unable to update order"
        return order_service._enrich_order_for_kitchen(updated), None

    def delete_order_global(self, order_id: str) -> bool:
        return order_service.delete(order_id)

    def delete_menu_global(self, item_id: str) -> bool:
        return menu_service.delete(item_id)

    def delete_category_global(self, category_id: str) -> bool:
        return category_service.delete(category_id)

    def delete_customer_global(self, customer_id: str) -> bool:
        return customer_service.delete(customer_id)

    def delete_coupon_global(self, coupon_id: str) -> bool:
        return coupon_service.delete(coupon_id)

    def delete_inventory_global(self, inventory_id: str) -> bool:
        return inventory_service.delete(inventory_id)

    @staticmethod
    def _page(items: list, page: int, limit: int) -> dict:
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


admin_service = AdminService()
