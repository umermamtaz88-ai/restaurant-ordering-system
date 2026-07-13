"""One-time migration of JSON backup data into Neon PostgreSQL."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

from app.db.models import (  # noqa: E402
    Category,
    Coupon,
    Customer,
    InventoryItem,
    MenuItem,
    Order,
    Report,
    RevokedToken,
    Setting,
    User,
)
from app.db.session import SessionLocal, init_db  # noqa: E402

DATABASE_DIR = Path(__file__).resolve().parent / "app" / "database"


def _load_json(name: str):
    path = DATABASE_DIR / name
    if not path.exists():
        print(f"  skip {name} (missing)")
        return None
    content = path.read_text(encoding="utf-8").strip()
    if not content:
        return [] if name != "settings.json" else {}
    return json.loads(content)


def _clear_tables(session) -> None:
    # Delete in FK-safe order
    for model in (
        Order,
        MenuItem,
        Category,
        Customer,
        Coupon,
        InventoryItem,
        Report,
        RevokedToken,
        User,
        Setting,
    ):
        session.query(model).delete()
    session.commit()


def migrate() -> dict[str, int]:
    init_db()
    counts: dict[str, int] = {}

    with SessionLocal() as session:
        _clear_tables(session)

        users = _load_json("users.json") or []
        for item in users:
            session.add(User.from_dict(item))
        counts["users"] = len(users)

        categories = _load_json("categories.json") or []
        for item in categories:
            session.add(Category.from_dict(item))
        counts["categories"] = len(categories)
        session.flush()

        menu = _load_json("menu.json") or []
        for item in menu:
            session.add(MenuItem.from_dict(item))
        counts["menu"] = len(menu)

        customers = _load_json("customers.json") or []
        for item in customers:
            session.add(Customer.from_dict(item))
        counts["customers"] = len(customers)
        session.flush()

        coupons = _load_json("coupons.json") or []
        for item in coupons:
            session.add(Coupon.from_dict(item))
        counts["coupons"] = len(coupons)

        inventory = _load_json("inventory.json") or []
        for item in inventory:
            session.add(InventoryItem.from_dict(item))
        counts["inventory"] = len(inventory)

        orders = _load_json("orders.json") or []
        for item in orders:
            session.add(Order.from_dict(item))
        counts["orders"] = len(orders)

        reports = _load_json("reports.json") or []
        for item in reports:
            if "report_id" not in item and "id" in item:
                item = {**item, "report_id": item["id"]}
            elif "report_id" not in item:
                continue
            session.add(Report.from_dict(item))
        counts["reports"] = len(reports)

        revoked = _load_json("revoked_tokens.json") or []
        for item in revoked:
            if item.get("jti"):
                session.add(RevokedToken.from_dict(item))
        counts["revoked_tokens"] = len(revoked)

        settings = _load_json("settings.json")
        if isinstance(settings, dict) and settings:
            session.add(Setting(id=1, data=settings))
            counts["settings"] = 1
        else:
            counts["settings"] = 0

        session.commit()

    return counts


if __name__ == "__main__":
    try:
        result = migrate()
        print("Migration complete:")
        for key, value in result.items():
            print(f"  {key}: {value}")
        print(f"  TOTAL: {sum(result.values())}")
    except Exception as exc:
        print(f"Migration failed: {exc}", file=sys.stderr)
        raise
