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
import { adminService, type AdminUser } from "@/services/admin.service";
import { ApiError } from "@/services/api";

const emptyForm = {
  full_name: "",
  email: "",
  phone: "",
  password: "",
  role: "customer",
  is_active: true,
};

export default function AdminUsersPage() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.listUsers({ q, limit: 100 });
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

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (user: AdminUser) => {
    setEditing(user);
    setForm({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      password: "",
      role: user.role,
      is_active: user.is_active,
    });
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) {
        const body: Record<string, unknown> = {
          full_name: form.full_name,
          phone: form.phone,
          role: form.role,
          is_active: form.is_active,
        };
        if (form.password) body.password = form.password;
        await adminService.updateUser(editing.user_id, body);
        toast.success("User updated");
      } else {
        await adminService.createUser({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
          is_active: form.is_active,
        });
        toast.success("User created");
      }
      setOpen(false);
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (user: AdminUser) => {
    if (!confirm(`Delete ${user.email}?`)) return;
    try {
      await adminService.deleteUser(user.user_id);
      toast.success("User deleted");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Delete failed");
    }
  };

  return (
    <AdminShell
      title="Users"
      actions={
        <Button variant="secondary" className="rounded-xl" onClick={openCreate}>
          <Plus className="size-4" />
          Add user
        </Button>
      }
    >
      <div className="mb-4 flex gap-2">
        <input
          className={inputClass}
          placeholder="Search name, email, phone…"
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
        <AdminTable headers={["Name", "Email", "Role", "Status", "Actions"]}>
          {items.map((user) => (
            <tr key={user.user_id} className="text-white/85">
              <td className="px-4 py-3">{user.full_name}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3 capitalize">{user.role}</td>
              <td className="px-4 py-3">
                <span
                  className={
                    user.is_active
                      ? "text-olive"
                      : "text-red-300"
                  }
                >
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="rounded-lg border-white/20 text-white" onClick={() => openEdit(user)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-lg border-red-400/30 text-red-300" onClick={() => void remove(user)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      <AdminModal
        open={open}
        title={editing ? "Edit user" : "Add user"}
        onClose={() => setOpen(false)}
      >
        <div className="space-y-3">
          <Field label="Full name">
            <input className={inputClass} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </Field>
          {!editing && (
            <Field label="Email">
              <input className={inputClass} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
          )}
          <Field label="Phone">
            <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label={editing ? "New password (optional)" : "Password"}>
            <input className={inputClass} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </Field>
          <Field label="Role">
            <select className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="customer">Customer</option>
              <option value="chef">Chef</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 font-sans text-sm text-white/70">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Active account
          </label>
          <Button variant="secondary" className="mt-2 w-full rounded-xl" loading={saving} onClick={() => void save()}>
            Save
          </Button>
        </div>
      </AdminModal>
    </AdminShell>
  );
}
