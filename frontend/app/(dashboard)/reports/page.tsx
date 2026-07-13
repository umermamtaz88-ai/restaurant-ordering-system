"use client";

import { Download } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { useReports } from "@/hooks/use-reports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { StatisticCard } from "@/components/ui/statistic-card";
import { PageLoading } from "@/components/shared/page-loading";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function ReportsPage() {
  const [period, setPeriod] = useState("daily");
  const { dailySales, weeklySales, monthlySales, mostOrderedItems, revenue, inventory, customers, isLoading } = useReports();

  if (isLoading) return <PageLoading />;

  const salesData = period === "daily" ? dailySales.data : period === "weekly" ? weeklySales.data : monthlySales.data;

  const handleExport = () => {
    const data = {
      sales: salesData,
      revenue: revenue.data,
      items: mostOrderedItems.data,
      inventory: inventory.data,
      customers: customers.data,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Sales, revenue, and business analytics</p>
        </div>
        <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4" />Export</Button>
      </div>

      <Tabs
        tabs={[
          { id: "daily", label: "Daily" },
          { id: "weekly", label: "Weekly" },
          { id: "monthly", label: "Monthly" },
        ]}
        activeTab={period}
        onTabChange={setPeriod}
        className="max-w-md"
      />

      {salesData && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatisticCard title="Total Orders" value={salesData.total_orders} icon={ShoppingBag} />
          <StatisticCard title="Total Revenue" value={formatCurrency(salesData.total_revenue)} icon={DollarSign} />
          <StatisticCard title="Avg Order Value" value={formatCurrency(salesData.average_order_value)} icon={DollarSign} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {salesData && (
          <Card>
            <CardHeader><CardTitle>Orders by Status ({salesData.period})</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={Object.entries(salesData.orders_by_status).map(([name, value]) => ({ name, value }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {revenue.data && (
          <Card>
            <CardHeader><CardTitle>Revenue by Order Type</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={Object.entries(revenue.data.revenue_by_order_type).map(([name, value]) => ({ name, value }))}
                    cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value"
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  >
                    {Object.keys(revenue.data.revenue_by_order_type).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {mostOrderedItems.data && mostOrderedItems.data.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Most Ordered Items</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Item</th>
                    <th className="pb-3 font-medium">Total Ordered</th>
                    <th className="pb-3 font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {mostOrderedItems.data.map((item) => (
                    <tr key={item.item_id} className="border-b border-border/50">
                      <td className="py-3 font-medium">{item.name}</td>
                      <td className="py-3">{item.total_ordered}</td>
                      <td className="py-3">{formatCurrency(item.total_revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {inventory.data && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />Inventory Report</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><p className="text-2xl font-bold">{inventory.data.total_items}</p><p className="text-xs text-muted-foreground">Total</p></div>
                <div><p className="text-2xl font-bold text-warning">{inventory.data.low_stock_count}</p><p className="text-xs text-muted-foreground">Low Stock</p></div>
                <div><p className="text-2xl font-bold text-destructive">{inventory.data.out_of_stock_count}</p><p className="text-xs text-muted-foreground">Out of Stock</p></div>
              </div>
            </CardContent>
          </Card>
        )}

        {customers.data && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Customer Report</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div><p className="text-2xl font-bold">{customers.data.total_customers}</p><p className="text-xs text-muted-foreground">Total Customers</p></div>
                <div><p className="text-2xl font-bold text-primary">{customers.data.new_customers_this_month}</p><p className="text-xs text-muted-foreground">New This Month</p></div>
              </div>
              <div className="space-y-2">
                {customers.data.top_customers.slice(0, 5).map((c) => (
                  <div key={c.customer_id} className="flex justify-between text-sm">
                    <span>{c.full_name}</span>
                    <span className="font-medium">{formatCurrency(c.total_spent)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
