import { apiDelete, apiGet, apiPost, apiPut } from "./api";
import type {
  MenuItem,
  MenuItemCreate,
  MenuItemUpdate,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api";

export interface MenuFilters extends PaginationParams {
  q?: string;
  available?: boolean;
  featured?: boolean;
  category_id?: string;
  min_price?: number;
  max_price?: number;
}

export const menuService = {
  getAll: (filters?: MenuFilters) =>
    apiGet<PaginatedResponse<MenuItem>>("/api/v1/menu", filters),

  getById: (id: string) => apiGet<MenuItem>(`/api/v1/menu/${id}`),

  create: (data: MenuItemCreate) =>
    apiPost<MenuItem, MenuItemCreate>("/api/v1/menu", data),

  update: (id: string, data: MenuItemUpdate) =>
    apiPut<MenuItem, MenuItemUpdate>(`/api/v1/menu/${id}`, data),

  delete: (id: string) => apiDelete<null>(`/api/v1/menu/${id}`),
};
