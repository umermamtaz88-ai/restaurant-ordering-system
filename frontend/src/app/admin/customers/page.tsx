"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminModal, AdminTable, Field, inputClass } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/admin.service";
import { ApiError } from "@/services/api";

const empty = { full_name: "", email: "", phone: "", address: "", notes: "" };

export default function AdminCustomersPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.listCustomers({ q, limit: 100 });
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

  const save = async () => {
    setSaving(true);
    try {
      const body = {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        address: form.address || null,
        notes: form.notes || null,
      };
      if (editingId) {
        await adminService.updateCustomer(editingId, body);
        toast.success("Customer updated");
      } else {
        await adminService.createCustomer(body);
        toast.success("Customer created");
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
      title="Customers"
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
          Add customer
        </Button>
      }
    >
      <div className="mb-4 flex gap-2">
        <input className={inputClass} placeholder="Search customers…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button variant="outline" className="rounded-xl border-white/20 text-white" onClick={() => void load()}>
          Search
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-white/50">Loading…</p>
      ) : (
        <AdminTable headers={["Name", "Email", "Phone", "Actions"]}>
          {items.map((item) => (
            <tr key={String(item.customer_id)} className="text-white/85">
              <td className="px-4 py-3 font-medium">{String(item.full_name)}</td>
              <td className="px-4 py-3">{String(item.email)}</td>
              <td className="px-4 py-3">{String(item.phone)}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg border-white/20 text-white"
                    onClick={() => {
                      setEditingId(String(item.customer_id));
                      setForm({
                        full_name: String(item.full_name || ""),
                        email: String(item.email || ""),
                        phone: String(item.phone || ""),
                        address: String(item.address || ""),
                        notes: String(item.notes || ""),
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
                      if (!confirm(`Delete ${item.full_name}?`)) return;
                      try {
                        await adminService.deleteCustomer(String(item.customer_id));
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

      <AdminModal open={open} title={editingId ? "Edit customer" : "Add customer"} onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <Field label="Full name">
            <input className={inputClass} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </Field>
          <Field label="Email">
            <input className={inputClass} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Phone">
            <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="Address">
            <input className={inputClass} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Field>
          <Field label="Notes">
            <textarea className={inputClass} rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>
          <Button variant="secondary" className="w-full rounded-xl" loading={saving} onClick={() => void save()}>
            Save
          </Button>
        </div>
      </AdminModal>
    </AdminShell>
  );
}
