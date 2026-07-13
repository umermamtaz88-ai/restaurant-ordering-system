import type { OrderStatus, PaymentStatus } from "@/types/api";

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Delivered",
  "Completed",
  "Cancelled",
];

export const PAYMENT_STATUSES: PaymentStatus[] = [
  "Pending",
  "Paid",
  "Refunded",
  "Failed",
];

export const ORDER_TYPES = ["Dine In", "Takeaway", "Delivery"] as const;

export const PAYMENT_METHODS = ["Cash", "Card", "Online"] as const;

export const COUPON_TYPES = ["Percentage", "Fixed Discount"] as const;

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Preparing: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Ready: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  "Out for Delivery": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  Delivered: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  Completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  Refunded: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Orders", href: "/orders", icon: "ShoppingBag" },
  { label: "Menu", href: "/menu", icon: "UtensilsCrossed" },
  { label: "Categories", href: "/categories", icon: "Tags" },
  { label: "Customers", href: "/customers", icon: "Users" },
  { label: "Coupons", href: "/coupons", icon: "Ticket" },
  { label: "Inventory", href: "/inventory", icon: "Package" },
  { label: "Reports", href: "/reports", icon: "FileBarChart" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;
