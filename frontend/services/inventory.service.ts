import { apiDelete, apiGet, apiPost, apiPut } from "./api";
import type {
  InventoryCreate,
  InventoryItem,
  InventoryUpdate,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api";

export interface InventoryFilters extends PaginationParams {
  q?: string;
  available?: boolean;
  low_stock?: boolean;
}

export const inventoryService = {
  getAll: (filters?: InventoryFilters) =>
    apiGet<PaginatedResponse<InventoryItem>>("/api/v1/inventory", filters),

  getById: (id: string) => apiGet<InventoryItem>(`/api/v1/inventory/${id}`),

  create: (data: InventoryCreate) =>
    apiPost<InventoryItem, InventoryCreate>("/api/v1/inventory", data),

  update: (id: string, data: InventoryUpdate) =>
    apiPut<InventoryItem, InventoryUpdate>(`/api/v1/inventory/${id}`, data),

  delete: (id: string) => apiDelete<null>(`/api/v1/inventory/${id}`),
};
