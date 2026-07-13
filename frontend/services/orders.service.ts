import { apiDelete, apiGet, apiPost, apiPut } from "./api";
import type {
  Order,
  OrderCreate,
  OrderStatus,
  OrderType,
  OrderUpdate,
  PaginatedResponse,
  PaginationParams,
  PaymentStatus,
} from "@/types/api";

export interface OrderFilters extends PaginationParams {
  q?: string;
  order_status?: OrderStatus;
  payment_status?: PaymentStatus;
  order_type?: OrderType;
  start_date?: string;
  end_date?: string;
}

export const ordersService = {
  getAll: (filters?: OrderFilters) =>
    apiGet<PaginatedResponse<Order>>("/api/v1/orders", filters),

  getById: (id: string) => apiGet<Order>(`/api/v1/orders/${id}`),

  create: (data: OrderCreate) => apiPost<Order, OrderCreate>("/api/v1/orders", data),

  update: (id: string, data: OrderUpdate) =>
    apiPut<Order, OrderUpdate>(`/api/v1/orders/${id}`, data),

  delete: (id: string) => apiDelete<null>(`/api/v1/orders/${id}`),
};
