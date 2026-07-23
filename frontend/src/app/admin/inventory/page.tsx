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
  ingredient_name: "",
  quantity: "10",
  unit: "kg",
  minimum_stock: "5",
  available: true,
};

export default function AdminInventoryPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.listInventory({ limit: 100 });
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
        ingredient_name: form.ingredient_name,
        quantity: Number(form.quantity),
        unit: form.unit,
        minimum_stock: Number(form.minimum_stock),
        available: form.available,
      };
      if (editingId) {
        await adminService.updateInventory(editingId, body);
        toast.success("Inventory updated");
      } else {
        await adminService.createInventory(body);
        toast.success("Inventory created");
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
      title="Inventory"
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
          Add item
        </Button>
      }
    >
      {loading ? (
        <p className="text-sm text-white/50">Loading…</p>
      ) : (
        <AdminTable headers={["Ingredient", "Qty", "Min", "Available", "Actions"]}>
          {items.map((item) => (
            <tr key={String(item.inventory_id)} className="text-white/85">
              <td className="px-4 py-3 font-medium">{String(item.ingredient_name)}</td>
              <td className="px-4 py-3">
                {String(item.quantity)} {String(item.unit)}
              </td>
              <td className="px-4 py-3">{String(item.minimum_stock)}</td>
              <td className="px-4 py-3">{item.available ? "Yes" : "No"}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg border-white/20 text-white"
                    onClick={() => {
                      setEditingId(String(item.inventory_id));
                      setForm({
                        ingredient_name: String(item.ingredient_name || ""),
                        quantity: String(item.quantity ?? ""),
                        unit: String(item.unit || "kg"),
                        minimum_stock: String(item.minimum_stock ?? 0),
                        available: Boolean(item.available),
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
                      if (!confirm(`Delete ${item.ingredient_name}?`)) return;
                      try {
                        await adminService.deleteInventory(String(item.inventory_id));
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

      <AdminModal open={open} title={editingId ? "Edit inventory" : "Add inventory"} onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <Field label="Ingredient name">
            <input className={inputClass} value={form.ingredient_name} onChange={(e) => setForm({ ...form, ingredient_name: e.target.value })} />
          </Field>
          <Field label="Quantity">
            <input className={inputClass} type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </Field>
          <Field label="Unit">
            <input className={inputClass} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          </Field>
          <Field label="Minimum stock">
            <input className={inputClass} type="number" value={form.minimum_stock} onChange={(e) => setForm({ ...form, minimum_stock: e.target.value })} />
          </Field>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />
            Available
          </label>
          <Button variant="secondary" className="w-full rounded-xl" loading={saving} onClick={() => void save()}>
            Save
          </Button>
        </div>
      </AdminModal>
    </AdminShell>
  );
}
