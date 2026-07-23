import { apiRequest } from "@/services/api";

export type AdminList<T> = {
  items: T[];
  pagination: {
    total_items: number;
    total_pages: number;
    current_page: number;
    has_next: boolean;
    has_previous: boolean;
  };
};

export type AdminStats = {
  total_orders: number;
  todays_orders: number;
  todays_revenue: number;
  total_revenue: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  total_users: number;
  total_customers: number;
  total_menu_items: number;
  available_menu_items: number;
  low_stock_items: Array<{
    inventory_id: string;
    ingredient_name: string;
    quantity: number;
    unit: string;
    minimum_stock: number;
  }>;
  recent_orders: Array<{
    order_id: string;
    order_number: string;
    total: number;
    order_status: string;
    customer_name?: string | null;
    created_at?: string;
  }>;
};

export type AdminUser = {
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  address?: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

function qs(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") search.set(k, String(v));
  });
  const s = search.toString();
  return s ? `?${s}` : "";
}

export const adminService = {
  stats() {
    return apiRequest<AdminStats>("/api/v1/admin/stats", { method: "GET", auth: true });
  },

  listUsers(params: { q?: string; role?: string; page?: number; limit?: number } = {}) {
    return apiRequest<AdminList<AdminUser>>(
      `/api/v1/admin/users${qs(params)}`,
      { method: "GET", auth: true },
    );
  },
  createUser(body: Record<string, unknown>) {
    return apiRequest<AdminUser>("/api/v1/admin/users", {
      method: "POST",
      body,
      auth: true,
    });
  },
  updateUser(id: string, body: Record<string, unknown>) {
    return apiRequest<AdminUser>(`/api/v1/admin/users/${id}`, {
      method: "PUT",
      body,
      auth: true,
    });
  },
  deleteUser(id: string) {
    return apiRequest<null>(`/api/v1/admin/users/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },

  listOrders(params: { q?: string; order_status?: string; page?: number; limit?: number } = {}) {
    return apiRequest<AdminList<Record<string, unknown>>>(
      `/api/v1/admin/orders${qs(params)}`,
      { method: "GET", auth: true },
    );
  },
  updateOrder(id: string, body: Record<string, unknown>) {
    return apiRequest<Record<string, unknown>>(`/api/v1/admin/orders/${id}`, {
      method: "PUT",
      body,
      auth: true,
    });
  },
  deleteOrder(id: string) {
    return apiRequest<null>(`/api/v1/admin/orders/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },

  listMenu(params: { q?: string; page?: number; limit?: number } = {}) {
    return apiRequest<AdminList<Record<string, unknown>>>(
      `/api/v1/admin/menu${qs(params)}`,
      { method: "GET", auth: true },
    );
  },
  createMenu(body: Record<string, unknown>) {
    return apiRequest<Record<string, unknown>>("/api/v1/admin/menu", {
      method: "POST",
      body,
      auth: true,
    });
  },
  updateMenu(id: string, body: Record<string, unknown>) {
    return apiRequest<Record<string, unknown>>(`/api/v1/admin/menu/${id}`, {
      method: "PUT",
      body,
      auth: true,
    });
  },
  deleteMenu(id: string) {
    return apiRequest<null>(`/api/v1/admin/menu/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },

  listCategories(params: { q?: string; page?: number; limit?: number } = {}) {
    return apiRequest<AdminList<Record<string, unknown>>>(
      `/api/v1/admin/categories${qs(params)}`,
      { method: "GET", auth: true },
    );
  },
  createCategory(body: Record<string, unknown>) {
    return apiRequest<Record<string, unknown>>("/api/v1/admin/categories", {
      method: "POST",
      body,
      auth: true,
    });
  },
  updateCategory(id: string, body: Record<string, unknown>) {
    return apiRequest<Record<string, unknown>>(`/api/v1/admin/categories/${id}`, {
      method: "PUT",
      body,
      auth: true,
    });
  },
  deleteCategory(id: string) {
    return apiRequest<null>(`/api/v1/admin/categories/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },

  listCustomers(params: { q?: string; page?: number; limit?: number } = {}) {
    return apiRequest<AdminList<Record<string, unknown>>>(
      `/api/v1/admin/customers${qs(params)}`,
      { method: "GET", auth: true },
    );
  },
  createCustomer(body: Record<string, unknown>) {
    return apiRequest<Record<string, unknown>>("/api/v1/admin/customers", {
      method: "POST",
      body,
      auth: true,
    });
  },
  updateCustomer(id: string, body: Record<string, unknown>) {
    return apiRequest<Record<string, unknown>>(`/api/v1/admin/customers/${id}`, {
      method: "PUT",
      body,
      auth: true,
    });
  },
  deleteCustomer(id: string) {
    return apiRequest<null>(`/api/v1/admin/customers/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },

  listCoupons(params: { q?: string; page?: number; limit?: number } = {}) {
    return apiRequest<AdminList<Record<string, unknown>>>(
      `/api/v1/admin/coupons${qs(params)}`,
      { method: "GET", auth: true },
    );
  },
  createCoupon(body: Record<string, unknown>) {
    return apiRequest<Record<string, unknown>>("/api/v1/admin/coupons", {
      method: "POST",
      body,
      auth: true,
    });
  },
  updateCoupon(id: string, body: Record<string, unknown>) {
    return apiRequest<Record<string, unknown>>(`/api/v1/admin/coupons/${id}`, {
      method: "PUT",
      body,
      auth: true,
    });
  },
  deleteCoupon(id: string) {
    return apiRequest<null>(`/api/v1/admin/coupons/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },

  listInventory(params: { q?: string; page?: number; limit?: number } = {}) {
    return apiRequest<AdminList<Record<string, unknown>>>(
      `/api/v1/admin/inventory${qs(params)}`,
      { method: "GET", auth: true },
    );
  },
  createInventory(body: Record<string, unknown>) {
    return apiRequest<Record<string, unknown>>("/api/v1/admin/inventory", {
      method: "POST",
      body,
      auth: true,
    });
  },
  updateInventory(id: string, body: Record<string, unknown>) {
    return apiRequest<Record<string, unknown>>(`/api/v1/admin/inventory/${id}`, {
      method: "PUT",
      body,
      auth: true,
    });
  },
  deleteInventory(id: string) {
    return apiRequest<null>(`/api/v1/admin/inventory/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },
};
