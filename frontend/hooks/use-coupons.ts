"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  couponsService,
  type CouponFilters,
} from "@/services/coupons.service";
import type { CouponCreate, CouponUpdate } from "@/types/api";

export function useCoupons(filters?: CouponFilters) {
  return useQuery({
    queryKey: ["coupons", filters],
    queryFn: () => couponsService.getAll(filters),
  });
}

export function useCoupon(id: string) {
  return useQuery({
    queryKey: ["coupons", id],
    queryFn: () => couponsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CouponCreate) => couponsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon created successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CouponUpdate }) =>
      couponsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon updated successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => couponsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon deleted successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
