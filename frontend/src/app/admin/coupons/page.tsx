"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminModal, AdminTable, Field, inputClass } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/admin.service";
import { ApiError } from "@/services/api";

const empty = {
  code: "",
  type: "Percentage",
  value: "10",
  minimum_order: "0",
  expiry_date: "2026-12-31",
  active: true,
};

export default function AdminCouponsPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.listCoupons({ limit: 100 });
      setItems(res.data?.items ?? []);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      const body = {
        code: form.code.toUpperCase(),
        type: form.type,
        value: Number(form.value),
        minimum_order: Number(form.minimum_order) || 0,
        expiry_date: form.expiry_date,
        active: form.active,
      };
      if (editingId) {
        await adminService.updateCoupon(editingId, body);
        toast.success("Coupon updated");
      } else {
        await adminService.createCoupon(body);
        toast.success("Coupon created");
      }
      setOpen(false);
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title="Coupons"
      actions={
        <Button
          variant="secondary"
          className="rounded-xl"
          onClick={() => {
            setEditingId(null);
            setForm(empty);
            setOpen(true);
          }}
        >
          <Plus className="size-4" />
          Add coupon
        </Button>
      }
    >
      {loading ? (
        <p className="text-sm text-white/50">Loading…</p>
      ) : (
        <AdminTable headers={["Code", "Type", "Value", "Active", "Actions"]}>
          {items.map((item) => (
            <tr key={String(item.coupon_id)} className="text-white/85">
              <td className="px-4 py-3 font-medium">{String(item.code)}</td>
              <td className="px-4 py-3">{String(item.type)}</td>
              <td className="px-4 py-3">{String(item.value)}</td>
              <td className="px-4 py-3">{item.active ? "Yes" : "No"}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg border-white/20 text-white"
                    onClick={() => {
                      setEditingId(String(item.coupon_id));
                      setForm({
                        code: String(item.code || ""),
                        type: String(item.type || "Percentage"),
                        value: String(item.value ?? ""),
                        minimum_order: String(item.minimum_order ?? 0),
                        expiry_date: String(item.expiry_date || "2026-12-31").slice(0, 10),
                        active: Boolean(item.active),
                      });
                      setOpen(true);
                    }}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg border-red-400/30 text-red-300"
                    onClick={async () => {
                      if (!confirm(`Delete ${item.code}?`)) return;
                      try {
                        await adminService.deleteCoupon(String(item.coupon_id));
                        toast.success("Deleted");
                        await load();
                      } catch (error) {
                        toast.error(error instanceof ApiError ? error.message : "Delete failed");
                      }
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      <AdminModal open={open} title={editingId ? "Edit coupon" : "Add coupon"} onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <Field label="Code">
            <input className={inputClass} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          </Field>
          <Field label="Type">
            <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="Percentage">Percentage</option>
              <option value="Fixed Discount">Fixed Discount</option>
            </select>
          </Field>
          <Field label="Value">
            <input className={inputClass} type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </Field>
          <Field label="Minimum order">
            <input className={inputClass} type="number" value={form.minimum_order} onChange={(e) => setForm({ ...form, minimum_order: e.target.value })} />
          </Field>
          <Field label="Expiry date">
            <input className={inputClass} type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
          </Field>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Active
          </label>
          <Button variant="secondary" className="w-full rounded-xl" loading={saving} onClick={() => void save()}>
            Save
          </Button>
        </div>
      </AdminModal>
    </AdminShell>
  );
}
