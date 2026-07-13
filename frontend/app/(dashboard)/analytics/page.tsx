"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import { useReports } from "@/hooks/use-reports";
import { useDashboard } from "@/hooks/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatisticCard } from "@/components/ui/statistic-card";
import { PageLoading } from "@/components/shared/page-loading";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, TrendingUp, Percent, Truck } from "lucide-react";

export default function AnalyticsPage() {
  const { dailySales, weeklySales, monthlySales, revenue, isLoading } = useReports();
  const { data: dashboard } = useDashboard();

  if (isLoading) return <PageLoading />;

  const trendData = [
    { period: "Daily", revenue: dailySales.data?.total_revenue ?? 0, orders: dailySales.data?.total_orders ?? 0 },
    { period: "Weekly", revenue: weeklySales.data?.total_revenue ?? 0, orders: weeklySales.data?.total_orders ?? 0 },
    { period: "Monthly", revenue: monthlySales.data?.total_revenue ?? 0, orders: monthlySales.data?.total_orders ?? 0 },
  ];

  const paymentData = revenue.data
    ? Object.entries(revenue.data.revenue_by_payment_method).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Deep dive into your business performance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticCard title="Total Revenue" value={formatCurrency(revenue.data?.total_revenue ?? 0)} icon={DollarSign} />
        <StatisticCard title="Total Orders" value={revenue.data?.total_orders ?? 0} icon={TrendingUp} />
        <StatisticCard title="Total Tax" value={formatCurrency(revenue.data?.total_tax ?? 0)} icon={Percent} />
        <StatisticCard title="Delivery Fees" value={formatCurrency(revenue.data?.total_delivery_fees ?? 0)} icon={Truck} />
      </div>

      <Card>
        <CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Orders Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                <Bar dataKey="orders" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Payment Methods</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={paymentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {dashboard && (
        <Card>
          <CardHeader><CardTitle>Key Metrics Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-xl font-bold">{formatCurrency(dashboard.average_order_value)}</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">Total Discounts</p>
                <p className="text-xl font-bold">{formatCurrency(revenue.data?.total_discount ?? 0)}</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-xl font-bold">
                  {dashboard.total_orders > 0
                    ? `${Math.round((dashboard.completed_orders / dashboard.total_orders) * 100)}%`
                    : "0%"}
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">Cancellation Rate</p>
                <p className="text-xl font-bold">
                  {dashboard.total_orders > 0
                    ? `${Math.round((dashboard.cancelled_orders / dashboard.total_orders) * 100)}%`
                    : "0%"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
