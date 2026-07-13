import { apiDelete, apiGet, apiPost, apiPut } from "./api";
import type {
  Category,
  CategoryCreate,
  CategoryUpdate,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api";

export interface CategoryFilters extends PaginationParams {
  q?: string;
  active?: boolean;
}

export const categoriesService = {
  getAll: (filters?: CategoryFilters) =>
    apiGet<PaginatedResponse<Category>>("/api/v1/categories", filters),

  getById: (id: string) => apiGet<Category>(`/api/v1/categories/${id}`),

  create: (data: CategoryCreate) =>
    apiPost<Category, CategoryCreate>("/api/v1/categories", data),

  update: (id: string, data: CategoryUpdate) =>
    apiPut<Category, CategoryUpdate>(`/api/v1/categories/${id}`, data),

  delete: (id: string) => apiDelete<null>(`/api/v1/categories/${id}`),
};
