"use client";

import { useState } from "react";
import { Plus, Trash2, Edit, Ticket } from "lucide-react";
import { useCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from "@/hooks/use-coupons";
import { useSearch, usePagination } from "@/hooks/use-pagination";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageLoading } from "@/components/shared/page-loading";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { COUPON_TYPES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { Coupon, CouponType } from "@/types/api";

export default function CouponsPage() {
  const { search, setSearch, debouncedSearch } = useSearch();
  const { page, setPage, resetPage } = usePagination();
  const { data, isLoading, error, refetch } = useCoupons({ page, limit: 12, q: debouncedSearch || undefined });
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState({ code: "", type: "Percentage" as CouponType, value: "", minimum_order: "0", expiry_date: "", active: true });

  const openCreate = () => { setEditing(null); setForm({ code: "", type: "Percentage", value: "", minimum_order: "0", expiry_date: "", active: true }); setModalOpen(true); };
  const openEdit = (c: Coupon) => { setEditing(c); setForm({ code: c.code, type: c.type, value: String(c.value), minimum_order: String(c.minimum_order), expiry_date: c.expiry_date, active: c.active }); setModalOpen(true); };

  const isExpired = (date: string) => new Date(date) < new Date();

  const handleSubmit = () => {
    const payload = { code: form.code, type: form.type, value: Number(form.value), minimum_order: Number(form.minimum_order), expiry_date: form.expiry_date, active: form.active };
    if (editing) {
      updateCoupon.mutate({ id: editing.coupon_id, data: payload }, { onSuccess: () => setModalOpen(false) });
    } else {
      createCoupon.mutate(payload, { onSuccess: () => setModalOpen(false) });
    }
  };

  if (isLoading) return <PageLoading />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coupons</h1>
          <p className="text-muted-foreground">Manage discount codes and promotions</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" />Create Coupon</Button>
      </div>

      <SearchBar value={search} onChange={(v) => { setSearch(v); resetPage(); }} placeholder="Search coupons..." />

      {data && data.items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((coupon) => (
            <Card key={coupon.coupon_id} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 h-1 w-full bg-primary" />
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-primary" />
                    <span className="font-mono font-bold text-lg">{coupon.code}</span>
                  </div>
                  <div className="flex gap-1">
                    {coupon.active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                    {isExpired(coupon.expiry_date) && <Badge variant="destructive">Expired</Badge>}
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-primary">
                  {coupon.type === "Percentage" ? `${coupon.value}% OFF` : formatCurrency(coupon.value) + " OFF"}
                </p>
                <p className="text-sm text-muted-foreground">Min order: {formatCurrency(coupon.minimum_order)}</p>
                <p className="text-xs text-muted-foreground mt-1">Expires: {coupon.expiry_date}</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(coupon)}><Edit className="h-3 w-3" />Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(coupon.coupon_id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No coupons" action={<Button onClick={openCreate}><Plus className="h-4 w-4" />Create Coupon</Button>} />
      )}

      {data && <Pagination pagination={data.pagination} onPageChange={setPage} />}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Coupon" : "New Coupon"}>
        <div className="space-y-4">
          <Input placeholder="Code *" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CouponType })}>
            {COUPON_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Input type="number" placeholder="Value *" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          <Input type="number" placeholder="Minimum Order" value={form.minimum_order} onChange={(e) => setForm({ ...form, minimum_order: e.target.value })} />
          <Input type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />Active</label>
          <Button onClick={handleSubmit} disabled={!form.code || !form.value || !form.expiry_date} className="w-full">{editing ? "Update" : "Create"}</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteCoupon.mutate(deleteId); setDeleteId(null); } }} title="Delete Coupon" description="Are you sure?" destructive loading={deleteCoupon.isPending} />
    </div>
  );
}
