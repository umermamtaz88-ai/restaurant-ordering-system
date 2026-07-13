"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useDashboard } from "@/hooks/use-dashboard";
import { useOrders } from "@/hooks/use-orders";
import { StatisticCard } from "@/components/ui/statistic-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/shared/page-loading";
import { ErrorState } from "@/components/ui/error-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";

const CHART_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function DashboardPage() {
  const { data: stats, isLoading, error, refetch } = useDashboard();
  const { data: recentOrders } = useOrders({ page: 1, limit: 5 });

  if (isLoading) return <PageLoading />;
  if (error || !stats) {
    return (
      <ErrorState
        message={error?.message ?? "Failed to load dashboard"}
        onRetry={() => refetch()}
      />
    );
  }

  const orderStatusData = [
    { name: "Pending", value: stats.pending_orders },
    { name: "Completed", value: stats.completed_orders },
    { name: "Cancelled", value: stats.cancelled_orders },
  ].filter((d) => d.value > 0);

  const revenueData = [
    { name: "Today", revenue: stats.todays_revenue },
    { name: "Monthly", revenue: stats.monthly_revenue },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/reports">
            <Button variant="outline">View Reports</Button>
          </Link>
          <Link href="/orders">
            <Button>
              <Plus className="h-4 w-4" />
              New Order
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Today's Revenue"
          value={formatCurrency(stats.todays_revenue)}
          icon={DollarSign}
        />
        <StatisticCard
          title="Today's Orders"
          value={stats.todays_orders}
          icon={ShoppingBag}
        />
        <StatisticCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthly_revenue)}
          icon={TrendingUp}
        />
        <StatisticCard
          title="Avg Order Value"
          value={formatCurrency(stats.average_order_value)}
          icon={DollarSign}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatisticCard
          title="Pending Orders"
          value={stats.pending_orders}
          icon={Clock}
          className="border-amber-200 dark:border-amber-900/30"
        />
        <StatisticCard
          title="Completed Orders"
          value={stats.completed_orders}
          icon={CheckCircle}
          className="border-emerald-200 dark:border-emerald-900/30"
        />
        <StatisticCard
          title="Cancelled Orders"
          value={stats.cancelled_orders}
          icon={XCircle}
          className="border-red-200 dark:border-red-900/30"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value ?? 0))}
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {orderStatusData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-20 text-center text-sm text-muted-foreground">
                No order data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Popular Items</CardTitle>
            <Link href="/menu" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.popular_items.length > 0 ? (
              stats.popular_items.map((item, i) => (
                <div key={item.item_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.total_ordered} orders
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No data yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Top Customers</CardTitle>
            <Link href="/customers" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.top_customers.length > 0 ? (
              stats.top_customers.map((customer) => (
                <div key={customer.customer_id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{customer.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {customer.order_count} orders
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatCurrency(customer.total_spent)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No data yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Low Stock
            </CardTitle>
            <Link href="/inventory" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.low_stock_items.length > 0 ? (
              stats.low_stock_items.map((item) => (
                <div key={item.inventory_id} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.ingredient_name}</span>
                  <span className="text-sm text-destructive">
                    {item.quantity} {item.unit}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">All stock levels healthy</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link href="/orders">
            <Button variant="ghost" size="sm">
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Payment</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders?.items.map((order) => (
                  <tr key={order.order_id} className="border-b border-border/50">
                    <td className="py-3">
                      <Link
                        href={`/orders/${order.order_id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="py-3">{order.order_type}</td>
                    <td className="py-3">
                      <StatusBadge status={order.order_status} />
                    </td>
                    <td className="py-3">
                      <StatusBadge status={order.payment_status} type="payment" />
                    </td>
                    <td className="py-3 font-medium">{formatCurrency(order.total)}</td>
                    <td className="py-3 text-muted-foreground">
                      {formatDateTime(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
