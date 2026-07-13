"""Dashboard analytics business logic."""

from collections import Counter
from datetime import datetime, timezone

from app.services.customer_service import customer_service
from app.services.inventory_service import inventory_service
from app.services.menu_service import menu_service
from app.services.order_service import order_service
from app.utils.constants import OrderStatus


class DashboardService:
    def get_stats(self, owner_id: str) -> dict:
        orders = order_service.filter_owner_items(order_service.get_all(), owner_id)
        now = datetime.now(timezone.utc)
        today_str = now.strftime("%Y-%m-%d")
        month_str = now.strftime("%Y-%m")

        total_orders = len(orders)
        todays_orders = [
            o for o in orders if o.get("created_at", "").startswith(today_str)
        ]
        monthly_orders = [
            o for o in orders if o.get("created_at", "").startswith(month_str)
        ]

        todays_revenue = sum(o.get("total", 0) for o in todays_orders)
        monthly_revenue = sum(o.get("total", 0) for o in monthly_orders)

        pending_orders = sum(
            1 for o in orders if o.get("order_status") == OrderStatus.PENDING.value
        )
        completed_orders = sum(
            1 for o in orders if o.get("order_status") == OrderStatus.COMPLETED.value
        )
        cancelled_orders = sum(
            1 for o in orders if o.get("order_status") == OrderStatus.CANCELLED.value
        )

        item_counter: Counter = Counter()
        for order in orders:
            for item in order.get("items", []):
                item_counter[item["item_id"]] += item.get("quantity", 0)

        popular_items = []
        owner_menu = menu_service.filter_owner_items(menu_service.get_all(), owner_id)
        menu_items = {i["item_id"]: i for i in owner_menu}
        for item_id, count in item_counter.most_common(5):
            menu_item = menu_items.get(item_id, {})
            popular_items.append(
                {
                    "item_id": item_id,
                    "name": menu_item.get("name", "Unknown"),
                    "total_ordered": count,
                }
            )

        customer_totals: dict = {}
        for order in orders:
            cid = order.get("customer_id")
            customer_totals[cid] = customer_totals.get(cid, 0) + order.get("total", 0)

        owner_customers = customer_service.filter_owner_items(
            customer_service.get_all(), owner_id
        )
        customers = {c["customer_id"]: c for c in owner_customers}
        top_customers = sorted(
            [
                {
                    "customer_id": cid,
                    "full_name": customers.get(cid, {}).get("full_name", "Unknown"),
                    "total_spent": total,
                    "order_count": sum(
                        1 for o in orders if o.get("customer_id") == cid
                    ),
                }
                for cid, total in customer_totals.items()
            ],
            key=lambda x: x["total_spent"],
            reverse=True,
        )[:5]

        low_stock = inventory_service.get_low_stock_items(owner_id)
        low_stock_items = [
            {
                "inventory_id": i["inventory_id"],
                "ingredient_name": i["ingredient_name"],
                "quantity": i["quantity"],
                "minimum_stock": i["minimum_stock"],
                "unit": i["unit"],
            }
            for i in low_stock
        ]

        total_revenue = sum(o.get("total", 0) for o in orders)
        average_order_value = round(total_revenue / total_orders, 2) if total_orders else 0.0

        return {
            "total_orders": total_orders,
            "todays_orders": len(todays_orders),
            "todays_revenue": round(todays_revenue, 2),
            "monthly_revenue": round(monthly_revenue, 2),
            "pending_orders": pending_orders,
            "completed_orders": completed_orders,
            "cancelled_orders": cancelled_orders,
            "popular_items": popular_items,
            "top_customers": top_customers,
            "low_stock_items": low_stock_items,
            "average_order_value": average_order_value,
        }


dashboard_service = DashboardService()
