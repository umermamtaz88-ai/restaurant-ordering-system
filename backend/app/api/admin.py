"""Admin panel API — users, global café data, and full CRUD controls."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.dependencies import require_admin
from app.schemas.admin import AdminUserCreate, AdminUserUpdate
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.schemas.coupon import CouponCreate, CouponUpdate
from app.schemas.customer import CustomerCreate, CustomerUpdate
from app.schemas.inventory import InventoryCreate, InventoryUpdate
from app.schemas.menu import MenuItemCreate, MenuItemUpdate
from app.schemas.order import OrderUpdate
from app.services.admin_service import admin_service
from app.services.category_service import category_service
from app.services.coupon_service import coupon_service
from app.services.customer_service import customer_service
from app.services.inventory_service import inventory_service
from app.services.menu_service import menu_service
from app.utils.constants import OrderStatus
from app.utils.response import success_response

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats", summary="Admin dashboard stats")
async def admin_stats(_admin: dict = Depends(require_admin)):
    return success_response("Admin stats retrieved", admin_service.get_global_stats())


# ── Users ─────────────────────────────────────────────────


@router.get("/users", summary="List all users")
async def admin_list_users(
    q: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    _admin: dict = Depends(require_admin),
):
    return success_response(
        "Users retrieved",
        admin_service.list_users(q=q, role=role, page=page, limit=limit),
    )


@router.post("/users", summary="Create user", status_code=201)
async def admin_create_user(
    data: AdminUserCreate,
    _admin: dict = Depends(require_admin),
):
    user, error = admin_service.create_user(data)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return success_response("User created", user)


@router.put("/users/{user_id}", summary="Update user")
async def admin_update_user(
    user_id: str,
    data: AdminUserUpdate,
    _admin: dict = Depends(require_admin),
):
    user, error = admin_service.update_user(user_id, data)
    if error:
        raise HTTPException(status_code=404 if error == "User not found" else 400, detail=error)
    return success_response("User updated", user)


@router.delete("/users/{user_id}", summary="Delete user")
async def admin_delete_user(
    user_id: str,
    admin: dict = Depends(require_admin),
):
    ok, error = admin_service.delete_user(user_id, admin["user_id"])
    if not ok:
        raise HTTPException(status_code=400, detail=error)
    return success_response("User deleted", None)


# ── Orders ────────────────────────────────────────────────


@router.get("/orders", summary="List all orders")
async def admin_list_orders(
    q: Optional[str] = Query(None),
    order_status: Optional[OrderStatus] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    _admin: dict = Depends(require_admin),
):
    return success_response(
        "Orders retrieved",
        admin_service.list_all_orders(
            q=q,
            order_status=order_status.value if order_status else None,
            page=page,
            limit=limit,
        ),
    )


@router.put("/orders/{order_id}", summary="Update any order")
async def admin_update_order(
    order_id: str,
    data: OrderUpdate,
    _admin: dict = Depends(require_admin),
):
    updates = data.model_dump(exclude_unset=True)
    for key in ("order_status", "payment_status", "payment_method"):
        if key in updates and updates[key] is not None:
            updates[key] = updates[key].value if hasattr(updates[key], "value") else updates[key]
    order, error = admin_service.update_order_global(order_id, updates)
    if error:
        raise HTTPException(status_code=404, detail=error)
    return success_response("Order updated", order)


@router.delete("/orders/{order_id}", summary="Delete any order")
async def admin_delete_order(order_id: str, _admin: dict = Depends(require_admin)):
    if not admin_service.delete_order_global(order_id):
        raise HTTPException(status_code=404, detail="Order not found")
    return success_response("Order deleted", None)


# ── Menu ──────────────────────────────────────────────────


@router.get("/menu", summary="List all menu items")
async def admin_list_menu(
    q: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    _admin: dict = Depends(require_admin),
):
    return success_response(
        "Menu retrieved", admin_service.list_all_menu(q=q, page=page, limit=limit)
    )


@router.post("/menu", summary="Create menu item", status_code=201)
async def admin_create_menu(
    data: MenuItemCreate,
    admin: dict = Depends(require_admin),
):
    if not category_service.get_by_id(data.category_id):
        raise HTTPException(status_code=400, detail="Category not found")
    if data.discount_price is not None and data.discount_price >= data.price:
        raise HTTPException(
            status_code=400, detail="Discount price must be less than regular price"
        )
    now = menu_service._now()
    item = menu_service.create(
        {
            "item_id": menu_service._generate_id("item"),
            "owner_id": admin["user_id"],
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
    )
    return success_response("Menu item created", item)


@router.put("/menu/{item_id}", summary="Update any menu item")
async def admin_update_menu(
    item_id: str,
    data: MenuItemUpdate,
    _admin: dict = Depends(require_admin),
):
    existing = menu_service.get_by_id(item_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Menu item not found")
    updates = data.model_dump(exclude_unset=True)
    updates["updated_at"] = menu_service._now()
    updated = menu_service.update(item_id, updates)
    return success_response("Menu item updated", updated)


@router.delete("/menu/{item_id}", summary="Delete any menu item")
async def admin_delete_menu(item_id: str, _admin: dict = Depends(require_admin)):
    if not admin_service.delete_menu_global(item_id):
        raise HTTPException(status_code=404, detail="Menu item not found")
    return success_response("Menu item deleted", None)


# ── Categories ────────────────────────────────────────────


@router.get("/categories", summary="List all categories")
async def admin_list_categories(
    q: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    _admin: dict = Depends(require_admin),
):
    return success_response(
        "Categories retrieved",
        admin_service.list_all_categories(q=q, page=page, limit=limit),
    )


@router.post("/categories", summary="Create category", status_code=201)
async def admin_create_category(
    data: CategoryCreate,
    admin: dict = Depends(require_admin),
):
    item, error = category_service.create_category(data, admin["user_id"])
    if error:
        raise HTTPException(status_code=400, detail=error)
    return success_response("Category created", item)


@router.put("/categories/{category_id}", summary="Update any category")
async def admin_update_category(
    category_id: str,
    data: CategoryUpdate,
    _admin: dict = Depends(require_admin),
):
    if not category_service.get_by_id(category_id):
        raise HTTPException(status_code=404, detail="Category not found")
    updates = data.model_dump(exclude_unset=True)
    updates["updated_at"] = category_service._now()
    updated = category_service.update(category_id, updates)
    return success_response("Category updated", updated)


@router.delete("/categories/{category_id}", summary="Delete any category")
async def admin_delete_category(
    category_id: str, _admin: dict = Depends(require_admin)
):
    if not admin_service.delete_category_global(category_id):
        raise HTTPException(status_code=404, detail="Category not found")
    return success_response("Category deleted", None)


# ── Customers ─────────────────────────────────────────────


@router.get("/customers", summary="List all customers")
async def admin_list_customers(
    q: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    _admin: dict = Depends(require_admin),
):
    return success_response(
        "Customers retrieved",
        admin_service.list_all_customers(q=q, page=page, limit=limit),
    )


@router.post("/customers", summary="Create customer", status_code=201)
async def admin_create_customer(
    data: CustomerCreate,
    admin: dict = Depends(require_admin),
):
    item, error = customer_service.create_customer(data, admin["user_id"])
    if error:
        raise HTTPException(status_code=400, detail=error)
    return success_response("Customer created", item)


@router.put("/customers/{customer_id}", summary="Update any customer")
async def admin_update_customer(
    customer_id: str,
    data: CustomerUpdate,
    _admin: dict = Depends(require_admin),
):
    if not customer_service.get_by_id(customer_id):
        raise HTTPException(status_code=404, detail="Customer not found")
    updates = data.model_dump(exclude_unset=True)
    updated = customer_service.update(customer_id, updates)
    return success_response("Customer updated", updated)


@router.delete("/customers/{customer_id}", summary="Delete any customer")
async def admin_delete_customer(
    customer_id: str, _admin: dict = Depends(require_admin)
):
    if not admin_service.delete_customer_global(customer_id):
        raise HTTPException(status_code=404, detail="Customer not found")
    return success_response("Customer deleted", None)


# ── Coupons ───────────────────────────────────────────────


@router.get("/coupons", summary="List all coupons")
async def admin_list_coupons(
    q: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    _admin: dict = Depends(require_admin),
):
    return success_response(
        "Coupons retrieved",
        admin_service.list_all_coupons(q=q, page=page, limit=limit),
    )


@router.post("/coupons", summary="Create coupon", status_code=201)
async def admin_create_coupon(
    data: CouponCreate,
    admin: dict = Depends(require_admin),
):
    item, error = coupon_service.create_coupon(data, admin["user_id"])
    if error:
        raise HTTPException(status_code=400, detail=error)
    return success_response("Coupon created", item)


@router.put("/coupons/{coupon_id}", summary="Update any coupon")
async def admin_update_coupon(
    coupon_id: str,
    data: CouponUpdate,
    _admin: dict = Depends(require_admin),
):
    if not coupon_service.get_by_id(coupon_id):
        raise HTTPException(status_code=404, detail="Coupon not found")
    updates = data.model_dump(exclude_unset=True)
    if "type" in updates and updates["type"] is not None:
        updates["type"] = updates["type"].value
    if "expiry_date" in updates and updates["expiry_date"] is not None:
        updates["expiry_date"] = str(updates["expiry_date"])
    updated = coupon_service.update(coupon_id, updates)
    return success_response("Coupon updated", updated)


@router.delete("/coupons/{coupon_id}", summary="Delete any coupon")
async def admin_delete_coupon(coupon_id: str, _admin: dict = Depends(require_admin)):
    if not admin_service.delete_coupon_global(coupon_id):
        raise HTTPException(status_code=404, detail="Coupon not found")
    return success_response("Coupon deleted", None)


# ── Inventory ─────────────────────────────────────────────


@router.get("/inventory", summary="List all inventory")
async def admin_list_inventory(
    q: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    _admin: dict = Depends(require_admin),
):
    return success_response(
        "Inventory retrieved",
        admin_service.list_all_inventory(q=q, page=page, limit=limit),
    )


@router.post("/inventory", summary="Create inventory item", status_code=201)
async def admin_create_inventory(
    data: InventoryCreate,
    admin: dict = Depends(require_admin),
):
    item, error = inventory_service.create_item(data, admin["user_id"])
    if error:
        raise HTTPException(status_code=400, detail=error)
    return success_response("Inventory item created", item)


@router.put("/inventory/{inventory_id}", summary="Update any inventory item")
async def admin_update_inventory(
    inventory_id: str,
    data: InventoryUpdate,
    _admin: dict = Depends(require_admin),
):
    if not inventory_service.get_by_id(inventory_id):
        raise HTTPException(status_code=404, detail="Inventory item not found")
    updates = data.model_dump(exclude_unset=True)
    updated = inventory_service.update(inventory_id, updates)
    return success_response("Inventory item updated", updated)


@router.delete("/inventory/{inventory_id}", summary="Delete any inventory item")
async def admin_delete_inventory(
    inventory_id: str, _admin: dict = Depends(require_admin)
):
    if not admin_service.delete_inventory_global(inventory_id):
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return success_response("Inventory item deleted", None)
