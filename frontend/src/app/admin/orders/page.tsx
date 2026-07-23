"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  AdminModal,
  AdminTable,
  Field,
  inputClass,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/admin.service";
import { ApiError } from "@/services/api";
import { formatPrice } from "@/utils/format";

const STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Delivered",
  "Completed",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState("Pending");
  const [payment, setPayment] = useState("Pending");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.listOrders({ q, limit: 100 });
      setItems(res.data?.items ?? []);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    void load();
  }, [load]);

  const openEdit = (order: Record<string, unknown>) => {
    setEditing(order);
    setStatus(String(order.order_status || "Pending"));
    setPayment(String(order.payment_status || "Pending"));
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await adminService.updateOrder(String(editing.order_id), {
        order_status: status,
        payment_status: payment,
      });
      toast.success("Order updated");
      setEditing(null);
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (order: Record<string, unknown>) => {
    if (!confirm(`Delete ${order.order_number}?`)) return;
    try {
      await adminService.deleteOrder(String(order.order_id));
      toast.success("Order deleted");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Delete failed");
    }
  };

  return (
    <AdminShell title="Orders">
      <div className="mb-4 flex gap-2">
        <input
          className={inputClass}
          placeholder="Search order number…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" className="rounded-xl border-white/20 text-white" onClick={() => void load()}>
          Search
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-white/50">Loading…</p>
      ) : (
        <AdminTable headers={["Order", "Customer", "Type", "Total", "Status", "Actions"]}>
          {items.map((order) => (
            <tr key={String(order.order_id)} className="text-white/85">
              <td className="px-4 py-3 font-medium">{String(order.order_number)}</td>
              <td className="px-4 py-3">{String(order.customer_name || "Guest")}</td>
              <td className="px-4 py-3">{String(order.order_type)}</td>
              <td className="px-4 py-3 text-olive">{formatPrice(Number(order.total || 0))}</td>
              <td className="px-4 py-3">{String(order.order_status)}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="rounded-lg border-white/20 text-white" onClick={() => openEdit(order)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-lg border-red-400/30 text-red-300" onClick={() => void remove(order)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      <AdminModal open={Boolean(editing)} title="Edit order" onClose={() => setEditing(null)}>
        <div className="space-y-3">
          <p className="font-sans text-sm text-white/60">
            {String(editing?.order_number)} · {String(editing?.customer_name || "Guest")}
          </p>
          <Field label="Order status">
            <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Payment status">
            <select className={inputClass} value={payment} onChange={(e) => setPayment(e.target.value)}>
              {["Pending", "Paid", "Refunded", "Failed"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Button variant="secondary" className="w-full rounded-xl" loading={saving} onClick={() => void save()}>
            Save
          </Button>
        </div>
      </AdminModal>
    </AdminShell>
  );
}
