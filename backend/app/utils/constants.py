"""Application constants and enumerations."""

from enum import Enum


class OrderType(str, Enum):
    DINE_IN = "Dine In"
    TAKEAWAY = "Takeaway"
    DELIVERY = "Delivery"


class OrderStatus(str, Enum):
    PENDING = "Pending"
    CONFIRMED = "Confirmed"
    PREPARING = "Preparing"
    READY = "Ready"
    OUT_FOR_DELIVERY = "Out for Delivery"
    DELIVERED = "Delivered"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"


class PaymentStatus(str, Enum):
    PENDING = "Pending"
    PAID = "Paid"
    REFUNDED = "Refunded"
    FAILED = "Failed"


class PaymentMethod(str, Enum):
    CASH = "Cash"
    CARD = "Card"
    ONLINE = "Online"


class CouponType(str, Enum):
    PERCENTAGE = "Percentage"
    FIXED = "Fixed Discount"


DEFAULT_TAX_RATE = 0.08
DEFAULT_DELIVERY_FEE = 4.99
MIN_DELIVERY_ORDER = 15.0
