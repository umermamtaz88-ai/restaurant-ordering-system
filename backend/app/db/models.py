"""SQLAlchemy models matching existing JSON entity structures."""

from typing import Any, Optional

from sqlalchemy import (
    Boolean,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    full_name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(50), nullable=False)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    role: Mapped[str] = mapped_column(String(50), nullable=False, default="customer")
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[str] = mapped_column(String(64), nullable=False)
    updated_at: Mapped[str] = mapped_column(String(64), nullable=False)

    def to_dict(self) -> dict[str, Any]:
        return {
            "user_id": self.user_id,
            "full_name": self.full_name,
            "email": self.email,
            "password_hash": self.password_hash,
            "phone": self.phone,
            "address": self.address,
            "avatar_url": self.avatar_url,
            "role": self.role,
            "is_active": self.is_active,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "User":
        return cls(
            user_id=data["user_id"],
            full_name=data["full_name"],
            email=data["email"],
            password_hash=data["password_hash"],
            phone=data["phone"],
            address=data.get("address"),
            avatar_url=data.get("avatar_url"),
            role=data.get("role", "customer"),
            is_active=data.get("is_active", True),
            created_at=data["created_at"],
            updated_at=data["updated_at"],
        )


class Category(Base):
    __tablename__ = "categories"

    category_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    owner_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[str] = mapped_column(String(64), nullable=False)
    updated_at: Mapped[str] = mapped_column(String(64), nullable=False)

    menu_items: Mapped[list["MenuItem"]] = relationship(back_populates="category")

    def to_dict(self) -> dict[str, Any]:
        result = {
            "category_id": self.category_id,
            "name": self.name,
            "description": self.description,
            "image_url": self.image_url,
            "active": self.active,
            "sort_order": self.sort_order,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
        if self.owner_id is not None:
            result["owner_id"] = self.owner_id
        return result

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "Category":
        return cls(
            category_id=data["category_id"],
            owner_id=data.get("owner_id"),
            name=data["name"],
            description=data.get("description"),
            image_url=data.get("image_url"),
            active=data.get("active", True),
            sort_order=data.get("sort_order", 0),
            created_at=data["created_at"],
            updated_at=data["updated_at"],
        )


class MenuItem(Base):
    __tablename__ = "menu_items"

    item_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    owner_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("categories.category_id"), nullable=False, index=True
    )
    image_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    discount_price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    available: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    preparation_time: Mapped[int] = mapped_column(Integer, nullable=False, default=15)
    calories: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    ingredients: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    allergens: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    spicy_level: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    rating: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    total_reviews: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[str] = mapped_column(String(64), nullable=False)
    updated_at: Mapped[str] = mapped_column(String(64), nullable=False)

    category: Mapped["Category"] = relationship(back_populates="menu_items")

    def to_dict(self) -> dict[str, Any]:
        result = {
            "item_id": self.item_id,
            "name": self.name,
            "description": self.description,
            "category_id": self.category_id,
            "image_url": self.image_url,
            "price": self.price,
            "discount_price": self.discount_price,
            "available": self.available,
            "preparation_time": self.preparation_time,
            "calories": self.calories,
            "ingredients": self.ingredients or [],
            "allergens": self.allergens or [],
            "spicy_level": self.spicy_level,
            "rating": self.rating,
            "total_reviews": self.total_reviews,
            "featured": self.featured,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
        if self.owner_id is not None:
            result["owner_id"] = self.owner_id
        return result

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "MenuItem":
        return cls(
            item_id=data["item_id"],
            owner_id=data.get("owner_id"),
            name=data["name"],
            description=data.get("description"),
            category_id=data["category_id"],
            image_url=data.get("image_url"),
            price=data["price"],
            discount_price=data.get("discount_price"),
            available=data.get("available", True),
            preparation_time=data.get("preparation_time", 15),
            calories=data.get("calories"),
            ingredients=data.get("ingredients") or [],
            allergens=data.get("allergens") or [],
            spicy_level=data.get("spicy_level", 0),
            rating=data.get("rating", 0.0),
            total_reviews=data.get("total_reviews", 0),
            featured=data.get("featured", False),
            created_at=data["created_at"],
            updated_at=data["updated_at"],
        )


class Customer(Base):
    __tablename__ = "customers"

    customer_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    owner_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    full_name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    phone: Mapped[str] = mapped_column(String(50), nullable=False)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[str] = mapped_column(String(64), nullable=False)

    orders: Mapped[list["Order"]] = relationship(back_populates="customer")

    def to_dict(self) -> dict[str, Any]:
        result = {
            "customer_id": self.customer_id,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "notes": self.notes,
            "created_at": self.created_at,
        }
        if self.owner_id is not None:
            result["owner_id"] = self.owner_id
        return result

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "Customer":
        return cls(
            customer_id=data["customer_id"],
            owner_id=data.get("owner_id"),
            full_name=data["full_name"],
            email=data["email"],
            phone=data["phone"],
            address=data.get("address"),
            notes=data.get("notes"),
            created_at=data["created_at"],
        )


class Coupon(Base):
    __tablename__ = "coupons"

    coupon_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    owner_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    code: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    value: Mapped[float] = mapped_column(Float, nullable=False)
    minimum_order: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    expiry_date: Mapped[str] = mapped_column(String(32), nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    def to_dict(self) -> dict[str, Any]:
        result = {
            "coupon_id": self.coupon_id,
            "code": self.code,
            "type": self.type,
            "value": self.value,
            "minimum_order": self.minimum_order,
            "expiry_date": self.expiry_date,
            "active": self.active,
        }
        if self.owner_id is not None:
            result["owner_id"] = self.owner_id
        return result

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "Coupon":
        return cls(
            coupon_id=data["coupon_id"],
            owner_id=data.get("owner_id"),
            code=data["code"],
            type=data["type"],
            value=data["value"],
            minimum_order=data.get("minimum_order", 0.0),
            expiry_date=data["expiry_date"],
            active=data.get("active", True),
        )


class InventoryItem(Base):
    __tablename__ = "inventory"

    inventory_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    owner_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    ingredient_name: Mapped[str] = mapped_column(String(200), nullable=False)
    quantity: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[str] = mapped_column(String(50), nullable=False)
    minimum_stock: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    available: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    def to_dict(self) -> dict[str, Any]:
        result = {
            "inventory_id": self.inventory_id,
            "ingredient_name": self.ingredient_name,
            "quantity": self.quantity,
            "unit": self.unit,
            "minimum_stock": self.minimum_stock,
            "available": self.available,
        }
        if self.owner_id is not None:
            result["owner_id"] = self.owner_id
        return result

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "InventoryItem":
        return cls(
            inventory_id=data["inventory_id"],
            owner_id=data.get("owner_id"),
            ingredient_name=data["ingredient_name"],
            quantity=data["quantity"],
            unit=data["unit"],
            minimum_stock=data.get("minimum_stock", 0.0),
            available=data.get("available", True),
        )


class Order(Base):
    __tablename__ = "orders"

    order_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    owner_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    customer_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("customers.customer_id"), nullable=False, index=True
    )
    order_number: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    order_type: Mapped[str] = mapped_column(String(50), nullable=False)
    items: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    subtotal: Mapped[float] = mapped_column(Float, nullable=False)
    discount: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    tax: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    delivery_fee: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    total: Mapped[float] = mapped_column(Float, nullable=False)
    payment_method: Mapped[str] = mapped_column(String(50), nullable=False)
    payment_status: Mapped[str] = mapped_column(String(50), nullable=False)
    order_status: Mapped[str] = mapped_column(String(50), nullable=False)
    coupon_code: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    estimated_time: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[str] = mapped_column(String(64), nullable=False)
    updated_at: Mapped[str] = mapped_column(String(64), nullable=False)

    customer: Mapped["Customer"] = relationship(back_populates="orders")

    def to_dict(self) -> dict[str, Any]:
        result = {
            "order_id": self.order_id,
            "customer_id": self.customer_id,
            "order_number": self.order_number,
            "order_type": self.order_type,
            "items": self.items or [],
            "subtotal": self.subtotal,
            "discount": self.discount,
            "tax": self.tax,
            "delivery_fee": self.delivery_fee,
            "total": self.total,
            "payment_method": self.payment_method,
            "payment_status": self.payment_status,
            "order_status": self.order_status,
            "coupon_code": self.coupon_code,
            "estimated_time": self.estimated_time,
            "notes": self.notes,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
        if self.owner_id is not None:
            result["owner_id"] = self.owner_id
        return result

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "Order":
        return cls(
            order_id=data["order_id"],
            owner_id=data.get("owner_id"),
            customer_id=data["customer_id"],
            order_number=data["order_number"],
            order_type=data["order_type"],
            items=data.get("items") or [],
            subtotal=data["subtotal"],
            discount=data.get("discount", 0.0),
            tax=data.get("tax", 0.0),
            delivery_fee=data.get("delivery_fee", 0.0),
            total=data["total"],
            payment_method=data["payment_method"],
            payment_status=data["payment_status"],
            order_status=data["order_status"],
            coupon_code=data.get("coupon_code"),
            estimated_time=data.get("estimated_time"),
            notes=data.get("notes"),
            created_at=data["created_at"],
            updated_at=data["updated_at"],
        )


class Setting(Base):
    """Singleton-style settings document (global + optional per-owner overrides)."""

    __tablename__ = "settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    data: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    def to_dict(self) -> dict[str, Any]:
        return dict(self.data or {})

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "Setting":
        return cls(id=1, data=data)


class RevokedToken(Base):
    __tablename__ = "revoked_tokens"

    jti: Mapped[str] = mapped_column(String(128), primary_key=True)

    def to_dict(self) -> dict[str, Any]:
        return {"jti": self.jti}

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "RevokedToken":
        return cls(jti=data["jti"])


class Report(Base):
    """Optional persisted report snapshots (reports.json was empty)."""

    __tablename__ = "reports"

    report_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    owner_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    data: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    def to_dict(self) -> dict[str, Any]:
        result = {"report_id": self.report_id, **(self.data or {})}
        if self.owner_id is not None:
            result["owner_id"] = self.owner_id
        return result

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "Report":
        payload = dict(data)
        report_id = payload.pop("report_id", None) or payload.get("id")
        owner_id = payload.pop("owner_id", None)
        return cls(report_id=str(report_id), owner_id=owner_id, data=payload)
