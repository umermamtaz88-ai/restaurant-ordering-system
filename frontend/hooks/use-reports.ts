"use client";

import { useQuery } from "@tanstack/react-query";
import { reportsService } from "@/services/reports.service";

export function useReports() {
  const dailySales = useQuery({
    queryKey: ["reports", "daily-sales"],
    queryFn: () => reportsService.getDailySales(),
  });

  const weeklySales = useQuery({
    queryKey: ["reports", "weekly-sales"],
    queryFn: () => reportsService.getWeeklySales(),
  });

  const monthlySales = useQuery({
    queryKey: ["reports", "monthly-sales"],
    queryFn: () => reportsService.getMonthlySales(),
  });

  const mostOrderedItems = useQuery({
    queryKey: ["reports", "most-ordered-items"],
    queryFn: () => reportsService.getMostOrderedItems(10),
  });

  const revenue = useQuery({
    queryKey: ["reports", "revenue"],
    queryFn: () => reportsService.getRevenue(),
  });

  const inventory = useQuery({
    queryKey: ["reports", "inventory"],
    queryFn: () => reportsService.getInventory(),
  });

  const customers = useQuery({
    queryKey: ["reports", "customers"],
    queryFn: () => reportsService.getCustomers(),
  });

  const isLoading =
    dailySales.isLoading ||
    weeklySales.isLoading ||
    monthlySales.isLoading ||
    mostOrderedItems.isLoading ||
    revenue.isLoading ||
    inventory.isLoading ||
    customers.isLoading;

  return {
    dailySales,
    weeklySales,
    monthlySales,
    mostOrderedItems,
    revenue,
    inventory,
    customers,
    isLoading,
  };
}
