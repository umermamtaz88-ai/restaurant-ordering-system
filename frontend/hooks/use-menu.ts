"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { menuService, type MenuFilters } from "@/services/menu.service";
import type { MenuItemCreate, MenuItemUpdate } from "@/types/api";

export function useMenu(filters?: MenuFilters) {
  return useQuery({
    queryKey: ["menu", filters],
    queryFn: () => menuService.getAll(filters),
  });
}

export function useMenuItem(id: string) {
  return useQuery({
    queryKey: ["menu", id],
    queryFn: () => menuService.getById(id),
    enabled: !!id,
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MenuItemCreate) => menuService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      toast.success("Menu item created successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MenuItemUpdate }) =>
      menuService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      queryClient.invalidateQueries({ queryKey: ["menu", id] });
      toast.success("Menu item updated successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      toast.success("Menu item deleted successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
