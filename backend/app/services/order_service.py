"""Order business logic and workflow."""

from datetime import datetime, timezone
from typing import Optional

from app.schemas.order import OrderCreate, OrderUpdate, StorefrontCheckoutRequest
from app.services.base_service import BaseService
from app.services.coupon_service import coupon_service
from app.services.customer_service import customer_service
from app.services.menu_service import menu_service
from app.services.settings_service import settings_service
from app.utils.constants import OrderStatus, OrderType, PaymentMethod, PaymentStatus
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

    def create_storefront_order(
        self, data: StorefrontCheckoutRequest, user: dict
    ) -> tuple[Optional[dict], Optional[str]]:
        """Place an order from the café frontend cart (static menu products)."""
        delivery_type = (data.delivery_type or "").strip().lower()
        payment_raw = (data.payment_method or "").strip().lower()

        type_map = {
            "delivery": OrderType.DELIVERY,
            "pickup": OrderType.TAKEAWAY,
            "takeaway": OrderType.TAKEAWAY,
            "dine_in": OrderType.DINE_IN,
            "dine-in": OrderType.DINE_IN,
        }
        payment_map = {
            "card": PaymentMethod.CARD,
            "cash": PaymentMethod.CASH,
            "wallet": PaymentMethod.ONLINE,
            "online": PaymentMethod.ONLINE,
        }

        order_type = type_map.get(delivery_type)
        payment_method = payment_map.get(payment_raw)
        if not order_type:
            return None, "Invalid delivery type. Use delivery or pickup."
        if not payment_method:
            return None, "Invalid payment method. Use card, cash, or wallet."

        owner_id = user["user_id"]
        customer = self._ensure_customer_for_user(user, data)

        order_items = []
        subtotal = 0.0
        for item in data.items:
            line_total = round(item.unit_price * item.quantity, 2)
            subtotal += line_total
            order_items.append(
                {
                    "item_id": item.product_id,
                    "name": item.name,
                    "quantity": item.quantity,
                    "unit_price": round(item.unit_price, 2),
                    "total_price": line_total,
                }
            )

        subtotal = round(subtotal, 2)
        settings = settings_service.get_settings(owner_id)
        tax = round(subtotal * settings["tax_rate"], 2)

        delivery_fee = 0.0
        if order_type == OrderType.DELIVERY:
            if subtotal < settings["min_delivery_order"]:
                # Keep cafe UX friendly: still allow checkout but charge delivery
                pass
            delivery_fee = settings["delivery_fee"]
            if subtotal >= 35:  # free delivery threshold matching frontend default
                delivery_fee = 0.0

        total = round(subtotal + tax + delivery_fee, 2)
        address_parts = [
            part for part in [data.address, data.city, data.zip_code] if part
        ]
        address_note = ", ".join(address_parts)
        notes = data.notes or ""
        if address_note:
            notes = f"{notes}\nDelivery address: {address_note}".strip()

        now = self._now()
        order = {
            "order_id": self._generate_id("ord"),
            "owner_id": owner_id,
            "customer_id": customer["customer_id"],
            "order_number": self._generate_order_number(owner_id),
            "order_type": order_type.value,
            "items": order_items,
            "subtotal": subtotal,
            "discount": 0.0,
            "tax": tax,
            "delivery_fee": delivery_fee,
            "total": total,
            "payment_method": payment_method.value,
            "payment_status": PaymentStatus.PENDING.value,
            "order_status": OrderStatus.PENDING.value,
            "coupon_code": None,
            "estimated_time": 25 if order_type == OrderType.DELIVERY else 15,
            "notes": notes or None,
            "created_at": now,
            "updated_at": now,
        }
        return self.create(order), None

    def _ensure_customer_for_user(
        self, user: dict, data: StorefrontCheckoutRequest
    ) -> dict:
        owner_id = user["user_id"]
        email = (user.get("email") or "").lower()
        customers = customer_service.filter_owner_items(
            customer_service.get_all(), owner_id
        )
        for customer in customers:
            if customer.get("email", "").lower() == email:
                # Refresh address if provided
                if data.address and not customer.get("address"):
                    customer_service.update_for_owner(
                        customer["customer_id"],
                        owner_id,
                        {
                            "address": ", ".join(
                                p
                                for p in [data.address, data.city, data.zip_code]
                                if p
                            )
                        },
                    )
                    refreshed = customer_service.get_by_id_for_owner(
                        customer["customer_id"], owner_id
                    )
                    return refreshed or customer
                return customer

        address = ", ".join(
            p for p in [data.address, data.city, data.zip_code] if p
        ) or user.get("address")

        from app.schemas.customer import CustomerCreate

        created, error = customer_service.create_customer(
            CustomerCreate(
                full_name=user.get("full_name") or "Customer",
                email=email,
                phone=user.get("phone") or "+10000000000",
                address=address,
                notes="Created from storefront checkout",
            ),
            owner_id,
        )
        if error or not created:
            # Last resort placeholder if duplicate race occurs
            raise ValueError(error or "Unable to create customer for order")
        return created

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

    def list_kitchen_orders(
        self,
        *,
        active_only: bool = True,
        q: Optional[str] = None,
        page: int = 1,
        limit: int = 50,
    ) -> dict:
        """Café-wide queue for kitchen staff (not scoped to a single owner)."""
        items = list(self.get_all())

        closed = {
            OrderStatus.COMPLETED.value,
            OrderStatus.CANCELLED.value,
            OrderStatus.DELIVERED.value,
        }
        if active_only:
            items = [i for i in items if i.get("order_status") not in closed]
        else:
            # Drop cancelled noise when showing finished tickets too
            items = [
                i for i in items if i.get("order_status") != OrderStatus.CANCELLED.value
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

        items.sort(key=lambda o: o.get("created_at") or "", reverse=False)

        from app.utils.pagination import paginate

        result = paginate(items, page, limit)
        page_items = self._enrich_orders_batch(result.items)
        return {
            "items": page_items,
            "pagination": {
                "total_items": result.total_items,
                "total_pages": result.total_pages,
                "current_page": result.current_page,
                "has_next": result.has_next,
                "has_previous": result.has_previous,
            },
        }

    def _enrich_orders_batch(self, orders: list[dict]) -> list[dict]:
        customer_ids = list(
            {o.get("customer_id") for o in orders if o.get("customer_id")}
        )
        customers = {
            c["customer_id"]: c
            for c in customer_service.store.find_by_ids("customer_id", customer_ids)
        }
        enriched = []
        for order in orders:
            payload = dict(order)
            customer = customers.get(order.get("customer_id"))
            if customer:
                payload["customer_name"] = customer.get("full_name")
                payload["customer_phone"] = customer.get("phone")
                payload["customer_email"] = customer.get("email")
            else:
                payload["customer_name"] = None
                payload["customer_phone"] = None
                payload["customer_email"] = None
            enriched.append(payload)
        return enriched

    def _enrich_order_for_kitchen(self, order: dict) -> dict:
        return self._enrich_orders_batch([order])[0]

    def update_kitchen_status(
        self, order_id: str, order_status: OrderStatus
    ) -> tuple[Optional[dict], Optional[str]]:
        existing = self.get_by_id(order_id)
        if not existing:
            return None, "Order not found"

        updates = {
            "order_status": order_status.value,
            "updated_at": self._now(),
        }
        # Mark paid when handoff completes for card/online storefront flow
        if order_status in (
            OrderStatus.COMPLETED,
            OrderStatus.DELIVERED,
        ) and existing.get("payment_status") == PaymentStatus.PENDING.value:
            updates["payment_status"] = PaymentStatus.PAID.value

        updated = self.update(order_id, updates)
        if not updated:
            return None, "Unable to update order"
        return self._enrich_order_for_kitchen(updated), None


order_service = OrderService()
