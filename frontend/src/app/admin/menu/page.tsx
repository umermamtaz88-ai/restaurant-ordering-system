"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
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

type Category = { category_id: string; name: string };

const empty = {
  name: "",
  description: "",
  category_id: "",
  price: "10",
  discount_price: "",
  image_url: "",
  available: true,
  featured: false,
  preparation_time: "15",
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [menuRes, catRes] = await Promise.all([
        adminService.listMenu({ q, limit: 100 }),
        adminService.listCategories({ limit: 100 }),
      ]);
      setItems(menuRes.data?.items ?? []);
      setCategories(
        (catRes.data?.items ?? []).map((c) => ({
          category_id: String(c.category_id),
          name: String(c.name),
        })),
      );
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...empty,
      category_id: categories[0]?.category_id || "",
    });
    setOpen(true);
  };

  const openEdit = (item: Record<string, unknown>) => {
    setEditingId(String(item.item_id));
    setForm({
      name: String(item.name || ""),
      description: String(item.description || ""),
      category_id: String(item.category_id || ""),
      price: String(item.price ?? ""),
      discount_price: item.discount_price != null ? String(item.discount_price) : "",
      image_url: String(item.image_url || ""),
      available: Boolean(item.available),
      featured: Boolean(item.featured),
      preparation_time: String(item.preparation_time ?? 15),
    });
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name: form.name,
        description: form.description || null,
        category_id: form.category_id,
        price: Number(form.price),
        discount_price: form.discount_price ? Number(form.discount_price) : null,
        image_url: form.image_url || null,
        available: form.available,
        featured: form.featured,
        preparation_time: Number(form.preparation_time) || 15,
        ingredients: [],
        allergens: [],
        spicy_level: 0,
      };
      if (editingId) {
        await adminService.updateMenu(editingId, body);
        toast.success("Menu item updated");
      } else {
        await adminService.createMenu(body);
        toast.success("Menu item created");
      }
      setOpen(false);
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: Record<string, unknown>) => {
    if (!confirm(`Delete ${item.name}?`)) return;
    try {
      await adminService.deleteMenu(String(item.item_id));
      toast.success("Deleted");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Delete failed");
    }
  };

  const catName = (id: unknown) =>
    categories.find((c) => c.category_id === id)?.name || String(id || "—");

  return (
    <AdminShell
      title="Menu"
      actions={
        <Button variant="secondary" className="rounded-xl" onClick={openCreate}>
          <Plus className="size-4" />
          Add item
        </Button>
      }
    >
      <div className="mb-4 flex gap-2">
        <input className={inputClass} placeholder="Search menu…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button variant="outline" className="rounded-xl border-white/20 text-white" onClick={() => void load()}>
          Search
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-white/50">Loading…</p>
      ) : (
        <AdminTable headers={["Name", "Category", "Price", "Available", "Actions"]}>
          {items.map((item) => (
            <tr key={String(item.item_id)} className="text-white/85">
              <td className="px-4 py-3 font-medium">{String(item.name)}</td>
              <td className="px-4 py-3">{catName(item.category_id)}</td>
              <td className="px-4 py-3 text-olive">{formatPrice(Number(item.price || 0))}</td>
              <td className="px-4 py-3">{item.available ? "Yes" : "No"}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="rounded-lg border-white/20 text-white" onClick={() => openEdit(item)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-lg border-red-400/30 text-red-300" onClick={() => void remove(item)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      <AdminModal open={open} title={editingId ? "Edit menu item" : "Add menu item"} onClose={() => setOpen(false)} wide>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name">
            <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Category">
            <select className={inputClass} value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              {categories.length === 0 && <option value="">Create a category first</option>}
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Price">
            <input className={inputClass} type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </Field>
          <Field label="Discount price">
            <input className={inputClass} type="number" step="0.01" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} />
          </Field>
          <Field label="Prep time (min)">
            <input className={inputClass} type="number" value={form.preparation_time} onChange={(e) => setForm({ ...form, preparation_time: e.target.value })} />
          </Field>
          <Field label="Image URL">
            <input className={inputClass} value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description">
              <textarea className={inputClass} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />
            Available
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured
          </label>
          <div className="sm:col-span-2">
            <Button variant="secondary" className="w-full rounded-xl" loading={saving} onClick={() => void save()}>
              Save
            </Button>
          </div>
        </div>
      </AdminModal>
    </AdminShell>
  );
}
