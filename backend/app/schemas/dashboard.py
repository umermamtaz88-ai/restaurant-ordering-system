"""Dashboard and report response schemas."""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class DashboardStats(BaseModel):
    total_orders: int
    todays_orders: int
    todays_revenue: float
    monthly_revenue: float
    pending_orders: int
    completed_orders: int
    cancelled_orders: int
    popular_items: List[Dict[str, Any]]
    top_customers: List[Dict[str, Any]]
    low_stock_items: List[Dict[str, Any]]
    average_order_value: float


class SalesReport(BaseModel):
    period: str
    total_orders: int
    total_revenue: float
    average_order_value: float
    orders_by_status: Dict[str, int]


class ItemReport(BaseModel):
    item_id: str
    name: str
    total_ordered: int
    total_revenue: float


class RevenueReport(BaseModel):
    total_revenue: float
    total_orders: int
    total_discount: float
    total_tax: float
    total_delivery_fees: float
    revenue_by_order_type: Dict[str, float]
    revenue_by_payment_method: Dict[str, float]


class InventoryReport(BaseModel):
    total_items: int
    low_stock_count: int
    out_of_stock_count: int
    items: List[Dict[str, Any]]


class CustomerReport(BaseModel):
    total_customers: int
    top_customers: List[Dict[str, Any]]
    new_customers_this_month: int
