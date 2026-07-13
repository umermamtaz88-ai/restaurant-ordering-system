"""Application settings loader."""

from typing import Optional

from app.utils.constants import DEFAULT_DELIVERY_FEE, DEFAULT_TAX_RATE
from app.db.repository import DbRepository


class SettingsService:
    def __init__(self):
        self.store = DbRepository("settings.json")

    def _defaults(self) -> dict:
        return {
            "tax_rate": DEFAULT_TAX_RATE,
            "delivery_fee": DEFAULT_DELIVERY_FEE,
            "min_delivery_order": 15.0,
            "restaurant_name": "Restaurant Order System",
            "currency": "USD",
        }

    def get_settings(self, owner_id: Optional[str] = None) -> dict:
        settings = self.store.read_object()
        defaults = self._defaults()

        if owner_id and isinstance(settings.get("owners"), dict):
            owner_settings = settings["owners"].get(owner_id, {})
            return {
                "tax_rate": owner_settings.get("tax_rate", defaults["tax_rate"]),
                "delivery_fee": owner_settings.get("delivery_fee", defaults["delivery_fee"]),
                "min_delivery_order": owner_settings.get(
                    "min_delivery_order", defaults["min_delivery_order"]
                ),
                "restaurant_name": owner_settings.get(
                    "restaurant_name", defaults["restaurant_name"]
                ),
                "currency": owner_settings.get("currency", defaults["currency"]),
            }

        return {
            "tax_rate": settings.get("tax_rate", defaults["tax_rate"]),
            "delivery_fee": settings.get("delivery_fee", defaults["delivery_fee"]),
            "min_delivery_order": settings.get("min_delivery_order", defaults["min_delivery_order"]),
            "restaurant_name": settings.get("restaurant_name", defaults["restaurant_name"]),
            "currency": settings.get("currency", defaults["currency"]),
        }

    def update_settings(self, owner_id: str, updates: dict) -> dict:
        settings = self.store.read_object()
        if "owners" not in settings or not isinstance(settings["owners"], dict):
            settings["owners"] = {}

        current = settings["owners"].get(owner_id, {})
        current.update({k: v for k, v in updates.items() if v is not None})
        settings["owners"][owner_id] = current
        self.store.write_object(settings)
        return self.get_settings(owner_id)


settings_service = SettingsService()
