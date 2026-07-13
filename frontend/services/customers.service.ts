import { apiDelete, apiGet, apiPost, apiPut } from "./api";
import type {
  Customer,
  CustomerCreate,
  CustomerUpdate,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api";

export interface CustomerFilters extends PaginationParams {
  q?: string;
  name?: string;
  phone?: string;
  email?: string;
}

export const customersService = {
  getAll: (filters?: CustomerFilters) =>
    apiGet<PaginatedResponse<Customer>>("/api/v1/customers", filters),

  getById: (id: string) => apiGet<Customer>(`/api/v1/customers/${id}`),

  create: (data: CustomerCreate) =>
    apiPost<Customer, CustomerCreate>("/api/v1/customers", data),

  update: (id: string, data: CustomerUpdate) =>
    apiPut<Customer, CustomerUpdate>(`/api/v1/customers/${id}`, data),

  delete: (id: string) => apiDelete<null>(`/api/v1/customers/${id}`),
};
