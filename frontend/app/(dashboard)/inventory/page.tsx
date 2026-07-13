"use client";

import { useState } from "react";
import { Plus, Trash2, Edit, AlertTriangle } from "lucide-react";
import { useInventory, useCreateInventory, useUpdateInventory, useDeleteInventory } from "@/hooks/use-inventory";
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
import type { InventoryItem } from "@/types/api";

export default function InventoryPage() {
  const { search, setSearch, debouncedSearch } = useSearch();
  const { page, setPage, resetPage } = usePagination();
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const { data, isLoading, error, refetch } = useInventory({
    page, limit: 12, q: debouncedSearch || undefined, low_stock: lowStockOnly || undefined,
  });
  const createInventory = useCreateInventory();
  const updateInventory = useUpdateInventory();
  const deleteInventory = useDeleteInventory();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState({ ingredient_name: "", quantity: "", unit: "", minimum_stock: "10", available: true });

  const openCreate = () => { setEditing(null); setForm({ ingredient_name: "", quantity: "", unit: "", minimum_stock: "10", available: true }); setModalOpen(true); };
  const openEdit = (item: InventoryItem) => { setEditing(item); setForm({ ingredient_name: item.ingredient_name, quantity: String(item.quantity), unit: item.unit, minimum_stock: String(item.minimum_stock), available: item.available }); setModalOpen(true); };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (item.quantity <= item.minimum_stock) return { label: "Low Stock", variant: "warning" as const };
    return { label: "In Stock", variant: "success" as const };
  };

  const handleSubmit = () => {
    const payload = { ingredient_name: form.ingredient_name, quantity: Number(form.quantity), unit: form.unit, minimum_stock: Number(form.minimum_stock), available: form.available };
    if (editing) {
      updateInventory.mutate({ id: editing.inventory_id, data: payload }, { onSuccess: () => setModalOpen(false) });
    } else {
      createInventory.mutate(payload, { onSuccess: () => setModalOpen(false) });
    }
  };

  if (isLoading) return <PageLoading />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  const lowStockCount = data?.items.filter((i) => i.quantity <= i.minimum_stock).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Track ingredient stock levels</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" />Add Item</Button>
      </div>

      {lowStockCount > 0 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <p className="text-sm font-medium">{lowStockCount} item(s) need restocking</p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={search} onChange={(v) => { setSearch(v); resetPage(); }} placeholder="Search ingredients..." className="flex-1" />
        <Select value={lowStockOnly ? "true" : ""} onChange={(e) => { setLowStockOnly(e.target.value === "true"); resetPage(); }} className="w-40">
          <option value="">All Items</option>
          <option value="true">Low Stock Only</option>
        </Select>
      </div>

      {data && data.items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item) => {
            const status = getStockStatus(item);
            const percentage = Math.min(100, (item.quantity / (item.minimum_stock * 2)) * 100);
            return (
              <Card key={item.inventory_id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{item.ingredient_name}</h3>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <p className="mt-2 text-2xl font-bold">{item.quantity} <span className="text-sm font-normal text-muted-foreground">{item.unit}</span></p>
                  <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${percentage <= 50 ? "bg-destructive" : percentage <= 75 ? "bg-warning" : "bg-success"}`} style={{ width: `${percentage}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Min: {item.minimum_stock} {item.unit}</p>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(item)}><Edit className="h-3 w-3" />Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(item.inventory_id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No inventory items" action={<Button onClick={openCreate}><Plus className="h-4 w-4" />Add Item</Button>} />
      )}

      {data && <Pagination pagination={data.pagination} onPageChange={setPage} />}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Item" : "New Item"}>
        <div className="space-y-4">
          <Input placeholder="Ingredient Name *" value={form.ingredient_name} onChange={(e) => setForm({ ...form, ingredient_name: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input type="number" placeholder="Quantity *" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            <Input placeholder="Unit *" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          </div>
          <Input type="number" placeholder="Minimum Stock" value={form.minimum_stock} onChange={(e) => setForm({ ...form, minimum_stock: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />Available</label>
          <Button onClick={handleSubmit} disabled={!form.ingredient_name || !form.quantity || !form.unit} className="w-full">{editing ? "Update" : "Create"}</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteInventory.mutate(deleteId); setDeleteId(null); } }} title="Delete Item" description="Are you sure?" destructive loading={deleteInventory.isPending} />
    </div>
  );
}
