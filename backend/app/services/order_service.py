"""Order business logic and workflow."""

from datetime import datetime, timezone
from typing import Optional

from app.schemas.order import OrderCreate, OrderUpdate
from app.services.base_service import BaseService
from app.services.coupon_service import coupon_service
from app.services.customer_service import customer_service
from app.services.menu_service import menu_service
from app.services.settings_service import settings_service
from app.utils.constants import OrderStatus, OrderType, PaymentStatus
from app.utils.validators import is_within_date_range


class OrderService(BaseService):
    def __init__(self):
        super().__init__("orders.json", "order_id")

    def _generate_order_number(self, owner_id: str) -> str:
        now = datetime.now(timezone.utc)
        date_part = now.strftime("%Y%m%d")
        owner_orders = self.filter_owner_items(self.get_all(), owner_id)
        today_orders = [
            o
            for o in owner_orders
            if o.get("order_number", "").startswith(f"ORD-{date_part}")
        ]
        sequence = len(today_orders) + 1
        return f"ORD-{date_part}-{sequence:04d}"

    def create_order(
        self, data: OrderCreate, owner_id: str
    ) -> tuple[Optional[dict], Optional[str]]:
        customer = customer_service.get_by_id_for_owner(data.customer_id, owner_id)
        if not customer:
            return None, f"Customer '{data.customer_id}' not found"

        order_items = []
        subtotal = 0.0
        max_prep_time = 0

        for item_input in data.items:
            menu_item = menu_service.get_by_id_for_owner(item_input.item_id, owner_id)
            if not menu_item:
                return None, f"Menu item '{item_input.item_id}' not found"
            if not menu_item.get("available"):
                return None, f"Menu item '{menu_item['name']}' is not available"

            unit_price = menu_service.get_effective_price(menu_item)
            total_price = round(unit_price * item_input.quantity, 2)
            subtotal += total_price
            max_prep_time = max(max_prep_time, menu_item.get("preparation_time", 15))

            order_items.append(
                {
                    "item_id": item_input.item_id,
                    "name": menu_item["name"],
                    "quantity": item_input.quantity,
                    "unit_price": unit_price,
                    "total_price": total_price,
                }
            )

        subtotal = round(subtotal, 2)
        discount = 0.0
        coupon_code = None

        if data.coupon_code:
            discount, error = coupon_service.validate_and_calculate_discount(
                data.coupon_code, subtotal, owner_id
            )
            if error:
                return None, error
            coupon_code = data.coupon_code.upper()

        settings = settings_service.get_settings(owner_id)
        taxable_amount = subtotal - discount
        tax = round(taxable_amount * settings["tax_rate"], 2)

        delivery_fee = 0.0
        if data.order_type == OrderType.DELIVERY:
            delivery_fee = settings["delivery_fee"]
            if subtotal < settings["min_delivery_order"]:
                return (
                    None,
                    f"Minimum order of ${settings['min_delivery_order']:.2f} required for delivery",
                )

        total = round(subtotal - discount + tax + delivery_fee, 2)

        if total < 0:
            return None, "Invalid order total"

        now = self._now()
        order = {
            "order_id": self._generate_id("ord"),
            "owner_id": owner_id,
            "customer_id": data.customer_id,
            "order_number": self._generate_order_number(owner_id),
            "order_type": data.order_type.value,
            "items": order_items,
            "subtotal": subtotal,
            "discount": discount,
            "tax": tax,
            "delivery_fee": delivery_fee,
            "total": total,
            "payment_method": data.payment_method.value,
            "payment_status": PaymentStatus.PENDING.value,
            "order_status": OrderStatus.PENDING.value,
            "coupon_code": coupon_code,
            "estimated_time": max_prep_time
            + (30 if data.order_type == OrderType.DELIVERY else 0),
            "notes": data.notes,
            "created_at": now,
            "updated_at": now,
        }

        return self.create(order), None

    def update_order(
        self, order_id: str, data: OrderUpdate, owner_id: str
    ) -> tuple[Optional[dict], Optional[str]]:
        existing = self.get_by_id_for_owner(order_id, owner_id)
        if not existing:
            return None, "Order not found"

        updates = {}
        if data.order_status is not None:
            updates["order_status"] = data.order_status.value
        if data.payment_status is not None:
            updates["payment_status"] = data.payment_status.value
        if data.payment_method is not None:
            updates["payment_method"] = data.payment_method.value
        if data.notes is not None:
            updates["notes"] = data.notes

        updates["updated_at"] = self._now()
        result = self.update_for_owner(order_id, owner_id, updates)
        return result, None

    def list_orders(
        self,
        owner_id: str,
        q: Optional[str] = None,
        order_status: Optional[str] = None,
        payment_status: Optional[str] = None,
        order_type: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
    ) -> dict:
        items = self.filter_owner_items(self.get_all(), owner_id)

        if order_status:
            items = [i for i in items if i.get("order_status") == order_status]
        if payment_status:
            items = [i for i in items if i.get("payment_status") == payment_status]
        if order_type:
            items = [i for i in items if i.get("order_type") == order_type]
        if start_date or end_date:
            items = [
                i
                for i in items
                if is_within_date_range(i.get("created_at", ""), start_date, end_date)
            ]

        if q:
            query_lower = q.lower()
            items = [
                i
                for i in items
                if query_lower in i.get("order_number", "").lower()
                or query_lower in i.get("order_id", "").lower()
                or query_lower in i.get("customer_id", "").lower()
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


order_service = OrderService()
