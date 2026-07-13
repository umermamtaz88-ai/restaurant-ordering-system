"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  inventoryService,
  type InventoryFilters,
} from "@/services/inventory.service";
import type { InventoryCreate, InventoryUpdate } from "@/types/api";

export function useInventory(filters?: InventoryFilters) {
  return useQuery({
    queryKey: ["inventory", filters],
    queryFn: () => inventoryService.getAll(filters),
  });
}

export function useInventoryItem(id: string) {
  return useQuery({
    queryKey: ["inventory", id],
    queryFn: () => inventoryService.getById(id),
    enabled: !!id,
  });
}

export function useCreateInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InventoryCreate) => inventoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Inventory item created successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: InventoryUpdate }) =>
      inventoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Inventory updated successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => inventoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Inventory item deleted successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
