"""Report generation business logic."""

from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone

from app.services.customer_service import customer_service
from app.services.inventory_service import inventory_service
from app.services.menu_service import menu_service
from app.services.order_service import order_service


class ReportService:
    def _owner_orders(self, owner_id: str) -> list:
        return order_service.filter_owner_items(order_service.get_all(), owner_id)

    def _filter_orders_by_period(self, orders: list, days: int) -> list:
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        filtered = []
        for order in orders:
            created = order.get("created_at", "")
            try:
                order_date = datetime.fromisoformat(created.replace("Z", "+00:00"))
                if order_date >= cutoff:
                    filtered.append(order)
            except ValueError:
                continue
        return filtered

    def _sales_report(self, orders: list, period: str) -> dict:
        total_revenue = sum(o.get("total", 0) for o in orders)
        total_orders = len(orders)
        avg = round(total_revenue / total_orders, 2) if total_orders else 0.0

        status_counts: dict = defaultdict(int)
        for order in orders:
            status_counts[order.get("order_status", "Unknown")] += 1

        return {
            "period": period,
            "total_orders": total_orders,
            "total_revenue": round(total_revenue, 2),
            "average_order_value": avg,
            "orders_by_status": dict(status_counts),
        }

    def daily_sales(self, owner_id: str) -> dict:
        orders = self._filter_orders_by_period(self._owner_orders(owner_id), 1)
        return self._sales_report(orders, "Daily")

    def weekly_sales(self, owner_id: str) -> dict:
        orders = self._filter_orders_by_period(self._owner_orders(owner_id), 7)
        return self._sales_report(orders, "Weekly")

    def monthly_sales(self, owner_id: str) -> dict:
        orders = self._filter_orders_by_period(self._owner_orders(owner_id), 30)
        return self._sales_report(orders, "Monthly")

    def most_ordered_items(self, owner_id: str, limit: int = 10) -> list:
        orders = self._owner_orders(owner_id)
        item_counter: Counter = Counter()
        revenue_counter: dict = defaultdict(float)

        for order in orders:
            for item in order.get("items", []):
                item_id = item["item_id"]
                qty = item.get("quantity", 0)
                item_counter[item_id] += qty
                revenue_counter[item_id] += item.get("total_price", 0)

        owner_menu = menu_service.filter_owner_items(menu_service.get_all(), owner_id)
        menu_items = {i["item_id"]: i for i in owner_menu}
        results = []
        for item_id, count in item_counter.most_common(limit):
            menu_item = menu_items.get(item_id, {})
            results.append(
                {
                    "item_id": item_id,
                    "name": menu_item.get("name", "Unknown"),
                    "total_ordered": count,
                    "total_revenue": round(revenue_counter[item_id], 2),
                }
            )
        return results

    def revenue_report(self, owner_id: str) -> dict:
        orders = self._owner_orders(owner_id)
        total_revenue = sum(o.get("total", 0) for o in orders)
        total_discount = sum(o.get("discount", 0) for o in orders)
        total_tax = sum(o.get("tax", 0) for o in orders)
        total_delivery = sum(o.get("delivery_fee", 0) for o in orders)

        by_order_type: dict = defaultdict(float)
        by_payment: dict = defaultdict(float)
        for order in orders:
            by_order_type[order.get("order_type", "Unknown")] += order.get("total", 0)
            by_payment[order.get("payment_method", "Unknown")] += order.get("total", 0)

        return {
            "total_revenue": round(total_revenue, 2),
            "total_orders": len(orders),
            "total_discount": round(total_discount, 2),
            "total_tax": round(total_tax, 2),
            "total_delivery_fees": round(total_delivery, 2),
            "revenue_by_order_type": {k: round(v, 2) for k, v in by_order_type.items()},
            "revenue_by_payment_method": {k: round(v, 2) for k, v in by_payment.items()},
        }

    def inventory_report(self, owner_id: str) -> dict:
        items = inventory_service.filter_owner_items(
            inventory_service.get_all(), owner_id
        )
        low_stock = [
            i for i in items if i.get("quantity", 0) <= i.get("minimum_stock", 0)
        ]
        out_of_stock = [i for i in items if i.get("quantity", 0) == 0]

        return {
            "total_items": len(items),
            "low_stock_count": len(low_stock),
            "out_of_stock_count": len(out_of_stock),
            "items": [
                {
                    "inventory_id": i["inventory_id"],
                    "ingredient_name": i["ingredient_name"],
                    "quantity": i["quantity"],
                    "minimum_stock": i["minimum_stock"],
                    "unit": i["unit"],
                    "available": i.get("available", True),
                    "status": (
                        "out_of_stock"
                        if i.get("quantity", 0) == 0
                        else "low_stock"
                        if i.get("quantity", 0) <= i.get("minimum_stock", 0)
                        else "in_stock"
                    ),
                }
                for i in items
            ],
        }

    def customer_report(self, owner_id: str) -> dict:
        customers = customer_service.filter_owner_items(
            customer_service.get_all(), owner_id
        )
        orders = self._owner_orders(owner_id)
        now = datetime.now(timezone.utc)
        month_str = now.strftime("%Y-%m")

        new_this_month = sum(
            1 for c in customers if c.get("created_at", "").startswith(month_str)
        )

        customer_totals: dict = defaultdict(lambda: {"spent": 0.0, "orders": 0})
        for order in orders:
            cid = order.get("customer_id")
            customer_totals[cid]["spent"] += order.get("total", 0)
            customer_totals[cid]["orders"] += 1

        customer_map = {c["customer_id"]: c for c in customers}
        top = sorted(
            [
                {
                    "customer_id": cid,
                    "full_name": customer_map.get(cid, {}).get("full_name", "Unknown"),
                    "email": customer_map.get(cid, {}).get("email", ""),
                    "total_spent": round(data["spent"], 2),
                    "order_count": data["orders"],
                }
                for cid, data in customer_totals.items()
            ],
            key=lambda x: x["total_spent"],
            reverse=True,
        )[:10]

        return {
            "total_customers": len(customers),
            "top_customers": top,
            "new_customers_this_month": new_this_month,
        }


report_service = ReportService()
