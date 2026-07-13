"""Coupon business logic."""

from datetime import date
from typing import Optional

from app.schemas.coupon import CouponCreate, CouponUpdate
from app.services.base_service import BaseService
from app.utils.constants import CouponType
from app.utils.validators import check_duplicate


class CouponService(BaseService):
    def __init__(self):
        super().__init__("coupons.json", "coupon_id")

    def create_coupon(
        self, data: CouponCreate, owner_id: str
    ) -> tuple[Optional[dict], Optional[str]]:
        owner_items = self.filter_owner_items(self.get_all(), owner_id)
        if check_duplicate(owner_items, "code", data.code.upper(), id_field="coupon_id"):
            return None, f"Coupon code '{data.code}' already exists"

        if data.type == CouponType.PERCENTAGE and data.value > 100:
            return None, "Percentage discount cannot exceed 100%"

        coupon = {
            "coupon_id": self._generate_id("coup"),
            "owner_id": owner_id,
            "code": data.code.upper(),
            "type": data.type.value,
            "value": data.value,
            "minimum_order": data.minimum_order,
            "expiry_date": data.expiry_date.isoformat(),
            "active": data.active,
        }
        return self.create(coupon), None

    def update_coupon(
        self, coupon_id: str, data: CouponUpdate, owner_id: str
    ) -> tuple[Optional[dict], Optional[str]]:
        existing = self.get_by_id_for_owner(coupon_id, owner_id)
        if not existing:
            return None, "Coupon not found"

        if data.code:
            owner_items = self.filter_owner_items(self.get_all(), owner_id)
            if check_duplicate(
                owner_items,
                "code",
                data.code.upper(),
                exclude_id=coupon_id,
                id_field="coupon_id",
            ):
                return None, f"Coupon code '{data.code}' already exists"

        coupon_type = data.type.value if data.type else existing["type"]
        value = data.value if data.value is not None else existing["value"]
        if coupon_type == CouponType.PERCENTAGE.value and value > 100:
            return None, "Percentage discount cannot exceed 100%"

        updates = data.model_dump(exclude_unset=True)
        if "code" in updates:
            updates["code"] = updates["code"].upper()
        if "type" in updates:
            updates["type"] = updates["type"].value
        if "expiry_date" in updates:
            updates["expiry_date"] = updates["expiry_date"].isoformat()

        result = self.update_for_owner(coupon_id, owner_id, updates)
        return result, None

    def validate_and_calculate_discount(
        self, code: str, subtotal: float, owner_id: str
    ) -> tuple[float, Optional[str]]:
        owner_coupons = self.filter_owner_items(self.get_all(), owner_id)
        coupon = None
        for c in owner_coupons:
            if c.get("code", "").upper() == code.upper():
                coupon = c
                break

        if not coupon:
            return 0.0, f"Coupon '{code}' not found"

        if not coupon.get("active"):
            return 0.0, "Coupon is not active"

        expiry = date.fromisoformat(coupon["expiry_date"])
        if expiry < date.today():
            return 0.0, "Coupon has expired"

        if subtotal < coupon.get("minimum_order", 0):
            return (
                0.0,
                f"Minimum order of ${coupon['minimum_order']:.2f} required for this coupon",
            )

        if coupon["type"] == CouponType.PERCENTAGE.value:
            discount = round(subtotal * (coupon["value"] / 100), 2)
        else:
            discount = min(coupon["value"], subtotal)

        return discount, None

    def list_coupons(
        self,
        owner_id: str,
        q: Optional[str] = None,
        active: Optional[bool] = None,
        page: int = 1,
        limit: int = 10,
    ) -> dict:
        items = self.filter_owner_items(self.get_all(), owner_id)
        if active is not None:
            items = [i for i in items if i.get("active") == active]

        if q:
            query_lower = q.lower()
            items = [i for i in items if query_lower in i.get("code", "").lower()]

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


coupon_service = CouponService()
