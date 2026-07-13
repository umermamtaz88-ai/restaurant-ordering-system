import { apiGet } from "./api";
import type { DashboardStats } from "@/types/api";

export const dashboardService = {
  getStats: () => apiGet<DashboardStats>("/api/v1/dashboard"),
};
