import { apiDelete, apiGet, apiPost, apiPut } from "./api";
import type {
  Coupon,
  CouponCreate,
  CouponUpdate,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api";

export interface CouponFilters extends PaginationParams {
  q?: string;
  active?: boolean;
}

export const couponsService = {
  getAll: (filters?: CouponFilters) =>
    apiGet<PaginatedResponse<Coupon>>("/api/v1/coupons", filters),

  getById: (id: string) => apiGet<Coupon>(`/api/v1/coupons/${id}`),

  create: (data: CouponCreate) =>
    apiPost<Coupon, CouponCreate>("/api/v1/coupons", data),

  update: (id: string, data: CouponUpdate) =>
    apiPut<Coupon, CouponUpdate>(`/api/v1/coupons/${id}`, data),

  delete: (id: string) => apiDelete<null>(`/api/v1/coupons/${id}`),
};
