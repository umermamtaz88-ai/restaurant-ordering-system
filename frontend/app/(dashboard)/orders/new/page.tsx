"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useCreateOrder } from "@/hooks/use-orders";
import { useCustomers } from "@/hooks/use-customers";
import { useMenu } from "@/hooks/use-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ORDER_TYPES, PAYMENT_METHODS } from "@/lib/constants";
import type { OrderType, PaymentMethod } from "@/types/api";

interface OrderLineItem {
  item_id: string;
  quantity: number;
}

export default function NewOrderPage() {
  const router = useRouter();
  const createOrder = useCreateOrder();
  const { data: customers } = useCustomers({ limit: 100 });
  const { data: menuItems } = useMenu({ limit: 100, available: true });

  const [customerId, setCustomerId] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("Dine In");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [couponCode, setCouponCode] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<OrderLineItem[]>([{ item_id: "", quantity: 1 }]);

  const addItem = () => setItems([...items, { item_id: "", quantity: 1 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: keyof OrderLineItem, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = items.filter((i) => i.item_id && i.quantity > 0);
    if (!customerId || validItems.length === 0) return;

    createOrder.mutate({
      customer_id: customerId,
      order_type: orderType,
      items: validItems,
      payment_method: paymentMethod,
      coupon_code: couponCode || undefined,
      notes: notes || undefined,
    }, { onSuccess: (data) => router.push(`/orders/${data.order_id}`) });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/orders"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-bold">Create Order</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Order Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Customer *</label>
              <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required className="mt-1">
                <option value="">Select Customer</option>
                {customers?.items.map((c) => (
                  <option key={c.customer_id} value={c.customer_id}>{c.full_name}</option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Order Type *</label>
                <Select value={orderType} onChange={(e) => setOrderType(e.target.value as OrderType)} className="mt-1">
                  {ORDER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Payment Method *</label>
                <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="mt-1">
                  {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </Select>
              </div>
            </div>
            <Input placeholder="Coupon Code (optional)" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
            <Textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Items</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="h-4 w-4" />Add Item</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1">
                  <Select value={item.item_id} onChange={(e) => updateItem(index, "item_id", e.target.value)} required>
                    <option value="">Select Item</option>
                    {menuItems?.items.map((m) => (
                      <option key={m.item_id} value={m.item_id}>{m.name} (${m.price})</option>
                    ))}
                  </Select>
                </div>
                <Input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, "quantity", Number(e.target.value))} className="w-20" />
                {items.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Button type="submit" disabled={createOrder.isPending || !customerId} className="w-full">
          {createOrder.isPending ? "Creating Order..." : "Create Order"}
        </Button>
      </form>
    </div>
  );
}
