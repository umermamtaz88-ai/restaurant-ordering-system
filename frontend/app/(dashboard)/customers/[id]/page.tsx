"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCustomer } from "@/hooks/use-customers";
import { useOrders } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageLoading } from "@/components/shared/page-loading";
import { ErrorState } from "@/components/ui/error-state";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: customer, isLoading, error, refetch } = useCustomer(id);
  const { data: orders } = useOrders({ q: id, limit: 20 });

  if (isLoading) return <PageLoading />;
  if (error || !customer) return <ErrorState message={error?.message ?? "Customer not found"} onRetry={() => refetch()} />;

  const customerOrders = orders?.items.filter((o) => o.customer_id === id) ?? [];
  const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/customers"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <Avatar name={customer.full_name} size="lg" />
        <div>
          <h1 className="text-2xl font-bold">{customer.full_name}</h1>
          <p className="text-muted-foreground">{customer.email}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Total Orders</p><p className="text-2xl font-bold">{customerOrders.length}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Total Spent</p><p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Member Since</p><p className="text-2xl font-bold">{formatDate(customer.created_at)}</p></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Contact Info</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Phone:</span> {customer.phone}</div>
            {customer.address && <div><span className="text-muted-foreground">Address:</span> {customer.address}</div>}
            {customer.notes && <div><span className="text-muted-foreground">Notes:</span> {customer.notes}</div>}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Order History</CardTitle></CardHeader>
          <CardContent>
            {customerOrders.length > 0 ? (
              <div className="space-y-3">
                {customerOrders.map((order) => (
                  <Link key={order.order_id} href={`/orders/${order.order_id}`} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.order_status} />
                      <span className="font-semibold">{formatCurrency(order.total)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
