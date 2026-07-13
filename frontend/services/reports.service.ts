import { apiGet } from "./api";
import type {
  CustomerReport,
  InventoryReport,
  ItemReport,
  RevenueReport,
  SalesReport,
} from "@/types/api";

export const reportsService = {
  getDailySales: () => apiGet<SalesReport>("/api/v1/reports/daily-sales"),

  getWeeklySales: () => apiGet<SalesReport>("/api/v1/reports/weekly-sales"),

  getMonthlySales: () => apiGet<SalesReport>("/api/v1/reports/monthly-sales"),

  getMostOrderedItems: (limit = 10) =>
    apiGet<ItemReport[]>("/api/v1/reports/most-ordered-items", { limit }),

  getRevenue: () => apiGet<RevenueReport>("/api/v1/reports/revenue"),

  getInventory: () => apiGet<InventoryReport>("/api/v1/reports/inventory"),

  getCustomers: () => apiGet<CustomerReport>("/api/v1/reports/customers"),
};
