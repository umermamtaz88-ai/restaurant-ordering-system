"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useOrder, useUpdateOrder, useDeleteOrder } from "@/hooks/use-orders";
import { useCustomer } from "@/hooks/use-customers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { PageLoading } from "@/components/shared/page-loading";
import { ErrorState } from "@/components/ui/error-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ORDER_STATUSES, PAYMENT_STATUSES, PAYMENT_METHODS } from "@/lib/constants";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus, PaymentStatus, PaymentMethod } from "@/types/api";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: order, isLoading, error, refetch } = useOrder(id);
  const { data: customer } = useCustomer(order?.customer_id ?? "");
  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) return <PageLoading />;
  if (error || !order) {
    return <ErrorState message={error?.message ?? "Order not found"} onRetry={() => refetch()} />;
  }

  const handleStatusChange = (field: string, value: string) => {
    updateOrder.mutate({ id, data: { [field]: value } });
  };

  const handleDelete = () => {
    deleteOrder.mutate(id, {
      onSuccess: () => router.push("/orders"),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/orders">
          <Button variant="ghost" size="icon" aria-label="Back to orders">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{order.order_number}</h1>
          <p className="text-muted-foreground">{formatDateTime(order.created_at)}</p>
        </div>
        <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.item_id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.unit_price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.total_price)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
                {order.discount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="text-success">-{formatCurrency(order.discount)}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatCurrency(order.tax)}</span></div>
                {order.delivery_fee > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Delivery Fee</span><span>{formatCurrency(order.delivery_fee)}</span></div>}
                <div className="flex justify-between text-base font-bold"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
              <CardContent><p className="text-sm">{order.notes}</p></CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Order Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Current Status</p>
                <StatusBadge status={order.order_status} />
              </div>
              <Select
                value={order.order_status}
                onChange={(e) => handleStatusChange("order_status", e.target.value as OrderStatus)}
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Payment</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Status</p>
                <StatusBadge status={order.payment_status} type="payment" />
              </div>
              <Select
                value={order.payment_status}
                onChange={(e) => handleStatusChange("payment_status", e.target.value as PaymentStatus)}
              >
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Method</p>
                <Select
                  value={order.payment_method}
                  onChange={(e) => handleStatusChange("payment_method", e.target.value as PaymentMethod)}
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
            <CardContent>
              {customer ? (
                <div className="space-y-1">
                  <p className="font-medium">{customer.full_name}</p>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                  <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  <Link href={`/customers/${customer.customer_id}`} className="text-sm text-primary hover:underline">
                    View profile
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Loading customer...</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span>{order.order_type}</span></div>
              {order.coupon_code && <div className="flex justify-between"><span className="text-muted-foreground">Coupon</span><span>{order.coupon_code}</span></div>}
              {order.estimated_time && <div className="flex justify-between"><span className="text-muted-foreground">Est. Time</span><span>{order.estimated_time} min</span></div>}
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Order"
        description="Are you sure you want to delete this order? This action cannot be undone."
        confirmLabel="Delete"
        destructive
        loading={deleteOrder.isPending}
      />
    </div>
  );
}
