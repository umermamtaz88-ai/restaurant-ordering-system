import { apiRequest } from "@/services/api";

export type StorefrontOrderItemPayload = {
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
};

export type StorefrontCheckoutPayload = {
  delivery_type: "delivery" | "pickup";
  payment_method: "card" | "cash" | "wallet";
  items: StorefrontOrderItemPayload[];
  notes?: string;
  address?: string;
  city?: string;
  zip_code?: string;
};

export type PlacedOrder = {
  order_id: string;
  order_number: string;
  total: number;
  order_status: string;
  payment_status: string;
  order_type?: string;
  created_at?: string;
  updated_at?: string;
  notes?: string | null;
  estimated_time?: number | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
  items?: Array<{
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
};

type OrderListData = {
  items: PlacedOrder[];
  pagination: {
    total_items: number;
    total_pages: number;
    current_page: number;
    has_next: boolean;
    has_previous: boolean;
  };
};

export const orderService = {
  checkout(payload: StorefrontCheckoutPayload) {
    return apiRequest<PlacedOrder>("/api/v1/orders/checkout", {
      method: "POST",
      body: payload,
      auth: true,
    });
  },

  list(page = 1, limit = 20) {
    return apiRequest<OrderListData>(
      `/api/v1/orders?page=${page}&limit=${limit}`,
      {
        method: "GET",
        auth: true,
      },
    );
  },

  kitchenQueue(activeOnly = true, page = 1, limit = 50) {
    return apiRequest<OrderListData>(
      `/api/v1/orders/kitchen?active_only=${activeOnly}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        auth: true,
      },
    );
  },

  updateKitchenStatus(orderId: string, orderStatus: string) {
    return apiRequest<PlacedOrder>(`/api/v1/orders/${orderId}/kitchen-status`, {
      method: "PUT",
      body: { order_status: orderStatus },
      auth: true,
    });
  },
};
