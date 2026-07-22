"""PostgreSQL repository with FileManager-compatible interface."""

from typing import Any, List, Optional, Type

from sqlalchemy import delete, select

from app.db.models import (
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
from app.db.session import SessionLocal

# Map legacy JSON filenames to SQLAlchemy models.
ENTITY_MODELS: dict[str, Type] = {
    "users.json": User,
    "categories.json": Category,
    "menu.json": MenuItem,
    "customers.json": Customer,
    "coupons.json": Coupon,
    "inventory.json": InventoryItem,
    "orders.json": Order,
    "reports.json": Report,
    "revoked_tokens.json": RevokedToken,
}

ID_FIELDS: dict[str, str] = {
    "users.json": "user_id",
    "categories.json": "category_id",
    "menu.json": "item_id",
    "customers.json": "customer_id",
    "coupons.json": "coupon_id",
    "inventory.json": "inventory_id",
    "orders.json": "order_id",
    "reports.json": "report_id",
    "revoked_tokens.json": "jti",
}


class DbRepository:
    """Drop-in PostgreSQL replacement for the former JSON FileManager."""

    def __init__(self, filename: str):
        self.filename = filename
        if filename == "settings.json":
            self.model = Setting
            self.id_field = "id"
            self.is_object_store = True
        else:
            if filename not in ENTITY_MODELS:
                raise ValueError(f"Unknown data store: {filename}")
            self.model = ENTITY_MODELS[filename]
            self.id_field = ID_FIELDS[filename]
            self.is_object_store = False

    def read_all(self) -> List[dict]:
        with SessionLocal() as session:
            rows = session.scalars(select(self.model)).all()
            return [row.to_dict() for row in rows]

    def write_all(self, data: List[dict]) -> None:
        """Replace all rows for this entity with the provided list."""
        with SessionLocal() as session:
            session.execute(delete(self.model))
            for item in data:
                session.add(self.model.from_dict(item))
            session.commit()

    def read_object(self) -> dict:
        with SessionLocal() as session:
            row = session.get(Setting, 1)
            if not row:
                return {}
            return row.to_dict()

    def write_object(self, data: dict) -> None:
        with SessionLocal() as session:
            row = session.get(Setting, 1)
            if row:
                row.data = data
            else:
                session.add(Setting(id=1, data=data))
            session.commit()

    def find_by_id(self, id_field: str, id_value: str) -> Optional[dict]:
        with SessionLocal() as session:
            column = getattr(self.model, id_field)
            row = session.scalars(select(self.model).where(column == id_value)).first()
            return row.to_dict() if row else None

    def find_by_field(self, field: str, value: Any) -> Optional[dict]:
        with SessionLocal() as session:
            column = getattr(self.model, field)
            row = session.scalars(select(self.model).where(column == value)).first()
            return row.to_dict() if row else None

    def find_by_ids(self, id_field: str, id_values: list[str]) -> List[dict]:
        if not id_values:
            return []
        with SessionLocal() as session:
            column = getattr(self.model, id_field)
            rows = session.scalars(select(self.model).where(column.in_(id_values))).all()
            return [row.to_dict() for row in rows]

    def find_index_by_id(self, id_field: str, id_value: str) -> Optional[int]:
        items = self.read_all()
        for index, item in enumerate(items):
            if item.get(id_field) == id_value:
                return index
        return None

    def insert(self, data: dict) -> dict:
        with SessionLocal() as session:
            row = self.model.from_dict(data)
            session.add(row)
            session.commit()
            session.refresh(row)
            return row.to_dict()

    def update_by_id(self, id_field: str, id_value: str, updates: dict) -> Optional[dict]:
        with SessionLocal() as session:
            column = getattr(self.model, id_field)
            row = session.scalars(select(self.model).where(column == id_value)).first()
            if not row:
                return None
            current = row.to_dict()
            for key, value in updates.items():
                if value is not None:
                    current[key] = value
            # Re-bind updated fields onto the ORM instance
            for key, value in current.items():
                if hasattr(row, key):
                    setattr(row, key, value)
            if self.model is Setting:
                row.data = current
            session.commit()
            session.refresh(row)
            return row.to_dict()

    def delete_by_id(self, id_field: str, id_value: str) -> bool:
        with SessionLocal() as session:
            column = getattr(self.model, id_field)
            row = session.scalars(select(self.model).where(column == id_value)).first()
            if not row:
                return False
            session.delete(row)
            session.commit()
            return True


# Backward-compatible alias used by existing services.
class FileManager(DbRepository):
    """Alias kept so imports of FileManager continue to work against PostgreSQL."""

    pass
