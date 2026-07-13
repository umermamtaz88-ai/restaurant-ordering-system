"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";
import { useOrders } from "@/hooks/use-orders";
import { useSearch, usePagination } from "@/hooks/use-pagination";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { PageLoading } from "@/components/shared/page-loading";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { ORDER_STATUSES, PAYMENT_STATUSES, ORDER_TYPES } from "@/lib/constants";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { OrderStatus, OrderType, PaymentStatus } from "@/types/api";

export default function OrdersPage() {
  const { search, setSearch, debouncedSearch } = useSearch();
  const { page, setPage, resetPage } = usePagination();
  const [orderStatus, setOrderStatus] = useState<OrderStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [orderType, setOrderType] = useState<OrderType | "">("");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error, refetch } = useOrders({
    page,
    limit: 10,
    q: debouncedSearch || undefined,
    order_status: orderStatus || undefined,
    payment_status: paymentStatus || undefined,
    order_type: orderType || undefined,
  });

  if (isLoading) return <PageLoading />;
  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and track all restaurant orders</p>
        </div>
        <Link href="/orders/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          value={search}
          onChange={(v) => { setSearch(v); resetPage(); }}
          placeholder="Search orders..."
          className="flex-1"
        />
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="flex flex-wrap gap-4 pt-6">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <Select
                value={orderStatus}
                onChange={(e) => { setOrderStatus(e.target.value as OrderStatus | ""); resetPage(); }}
              >
                <option value="">All Statuses</option>
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Payment</label>
              <Select
                value={paymentStatus}
                onChange={(e) => { setPaymentStatus(e.target.value as PaymentStatus | ""); resetPage(); }}
              >
                <option value="">All Payments</option>
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Type</label>
              <Select
                value={orderType}
                onChange={(e) => { setOrderType(e.target.value as OrderType | ""); resetPage(); }}
              >
                <option value="">All Types</option>
                {ORDER_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {data && data.items.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Order #</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Payment</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((order) => (
                  <tr key={order.order_id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/orders/${order.order_id}`} className="font-medium text-primary hover:underline">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{order.order_type}</td>
                    <td className="px-6 py-4"><StatusBadge status={order.order_status} /></td>
                    <td className="px-6 py-4"><StatusBadge status={order.payment_status} type="payment" /></td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(order.total)}</td>
                    <td className="px-6 py-4 text-muted-foreground">{formatDateTime(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={data.pagination} onPageChange={setPage} className="px-4" />
        </Card>
      ) : (
        <EmptyState title="No orders found" description="Try adjusting your search or filters." />
      )}
    </div>
  );
}
