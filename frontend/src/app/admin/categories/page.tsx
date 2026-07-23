"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminModal, AdminTable, Field, inputClass } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/admin.service";
import { ApiError } from "@/services/api";

const empty = { name: "", description: "", active: true, sort_order: "0" };

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.listCategories({ limit: 100 });
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
        name: form.name,
        description: form.description || null,
        active: form.active,
        sort_order: Number(form.sort_order) || 0,
      };
      if (editingId) {
        await adminService.updateCategory(editingId, body);
        toast.success("Category updated");
      } else {
        await adminService.createCategory(body);
        toast.success("Category created");
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
      title="Categories"
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
          Add category
        </Button>
      }
    >
      {loading ? (
        <p className="text-sm text-white/50">Loading…</p>
      ) : (
        <AdminTable headers={["Name", "Sort", "Active", "Actions"]}>
          {items.map((item) => (
            <tr key={String(item.category_id)} className="text-white/85">
              <td className="px-4 py-3 font-medium">{String(item.name)}</td>
              <td className="px-4 py-3">{String(item.sort_order)}</td>
              <td className="px-4 py-3">{item.active ? "Yes" : "No"}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg border-white/20 text-white"
                    onClick={() => {
                      setEditingId(String(item.category_id));
                      setForm({
                        name: String(item.name || ""),
                        description: String(item.description || ""),
                        active: Boolean(item.active),
                        sort_order: String(item.sort_order ?? 0),
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
                      if (!confirm(`Delete ${item.name}?`)) return;
                      try {
                        await adminService.deleteCategory(String(item.category_id));
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

      <AdminModal open={open} title={editingId ? "Edit category" : "Add category"} onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <Field label="Name">
            <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Description">
            <textarea className={inputClass} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Sort order">
            <input className={inputClass} type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
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
