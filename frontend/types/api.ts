export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationMeta {
  total_items: number;
  total_pages: number;
  current_page: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export type OrderType = "Dine In" | "Takeaway" | "Delivery";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Ready"
  | "Out for Delivery"
  | "Delivered"
  | "Completed"
  | "Cancelled";

export type PaymentStatus = "Pending" | "Paid" | "Refunded" | "Failed";

export type PaymentMethod = "Cash" | "Card" | "Online";

export type CouponType = "Percentage" | "Fixed Discount";

export interface Category {
  category_id: string;
  name: string;
  description?: string;
  image_url?: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryCreate {
  name: string;
  description?: string;
  image_url?: string;
  active?: boolean;
  sort_order?: number;
}

export type CategoryUpdate = Partial<CategoryCreate>;

export interface MenuItem {
  item_id: string;
  name: string;
  description?: string;
  category_id: string;
  image_url?: string;
  price: number;
  discount_price?: number;
  available: boolean;
  preparation_time: number;
  calories?: number;
  ingredients: string[];
  allergens: string[];
  spicy_level: number;
  rating: number;
  total_reviews: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItemCreate {
  name: string;
  description?: string;
  category_id: string;
  image_url?: string;
  price: number;
  discount_price?: number;
  available?: boolean;
  preparation_time?: number;
  calories?: number;
  ingredients?: string[];
  allergens?: string[];
  spicy_level?: number;
  featured?: boolean;
}

export type MenuItemUpdate = Partial<MenuItemCreate>;

export interface Customer {
  customer_id: string;
  full_name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  created_at: string;
}

export interface CustomerCreate {
  full_name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
}

export type CustomerUpdate = Partial<CustomerCreate>;

export interface OrderItem {
  item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  order_id: string;
  customer_id: string;
  order_number: string;
  order_type: OrderType;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  coupon_code?: string;
  estimated_time?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderCreateItem {
  item_id: string;
  quantity: number;
}

export interface OrderCreate {
  customer_id: string;
  order_type: OrderType;
  items: OrderCreateItem[];
  payment_method: PaymentMethod;
  coupon_code?: string;
  notes?: string;
}

export interface OrderUpdate {
  order_status?: OrderStatus;
  payment_status?: PaymentStatus;
  payment_method?: PaymentMethod;
  notes?: string;
}

export interface Coupon {
  coupon_id: string;
  code: string;
  type: CouponType;
  value: number;
  minimum_order: number;
  expiry_date: string;
  active: boolean;
}

export interface CouponCreate {
  code: string;
  type: CouponType;
  value: number;
  minimum_order?: number;
  expiry_date: string;
  active?: boolean;
}

export type CouponUpdate = Partial<CouponCreate>;

export interface InventoryItem {
  inventory_id: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
  minimum_stock: number;
  available: boolean;
}

export interface InventoryCreate {
  ingredient_name: string;
  quantity: number;
  unit: string;
  minimum_stock?: number;
  available?: boolean;
}

export type InventoryUpdate = Partial<InventoryCreate>;

export interface DashboardStats {
  total_orders: number;
  todays_orders: number;
  todays_revenue: number;
  monthly_revenue: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  popular_items: {
    item_id: string;
    name: string;
    total_ordered: number;
  }[];
  top_customers: {
    customer_id: string;
    full_name: string;
    total_spent: number;
    order_count: number;
  }[];
  low_stock_items: {
    inventory_id: string;
    ingredient_name: string;
    quantity: number;
    minimum_stock: number;
    unit: string;
  }[];
  average_order_value: number;
}

export interface SalesReport {
  period: string;
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  orders_by_status: Record<string, number>;
}

export interface ItemReport {
  item_id: string;
  name: string;
  total_ordered: number;
  total_revenue: number;
}

export interface RevenueReport {
  total_revenue: number;
  total_orders: number;
  total_discount: number;
  total_tax: number;
  total_delivery_fees: number;
  revenue_by_order_type: Record<string, number>;
  revenue_by_payment_method: Record<string, number>;
}

export interface InventoryReportItem {
  inventory_id: string;
  ingredient_name: string;
  quantity: number;
  minimum_stock: number;
  unit: string;
  available: boolean;
  status: "out_of_stock" | "low_stock" | "in_stock";
}

export interface InventoryReport {
  total_items: number;
  low_stock_count: number;
  out_of_stock_count: number;
  items: InventoryReportItem[];
}

export interface CustomerReport {
  total_customers: number;
  top_customers: {
    customer_id: string;
    full_name: string;
    email: string;
    total_spent: number;
    order_count: number;
  }[];
  new_customers_this_month: number;
}
