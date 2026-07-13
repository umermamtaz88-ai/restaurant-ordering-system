"use client";

import { useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/use-categories";
import { useSearch, usePagination } from "@/hooks/use-pagination";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageLoading } from "@/components/shared/page-loading";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import type { Category } from "@/types/api";

export default function CategoriesPage() {
  const { search, setSearch, debouncedSearch } = useSearch();
  const { page, setPage, resetPage } = usePagination();
  const { data, isLoading, error, refetch } = useCategories({ page, limit: 10, q: debouncedSearch || undefined });
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", description: "", active: true, sort_order: "0" });

  const openCreate = () => { setEditing(null); setForm({ name: "", description: "", active: true, sort_order: "0" }); setModalOpen(true); };
  const openEdit = (cat: Category) => { setEditing(cat); setForm({ name: cat.name, description: cat.description ?? "", active: cat.active, sort_order: String(cat.sort_order) }); setModalOpen(true); };

  const handleSubmit = () => {
    const payload = { name: form.name, description: form.description || undefined, active: form.active, sort_order: Number(form.sort_order) };
    if (editing) {
      updateCategory.mutate({ id: editing.category_id, data: payload }, { onSuccess: () => setModalOpen(false) });
    } else {
      createCategory.mutate(payload, { onSuccess: () => setModalOpen(false) });
    }
  };

  if (isLoading) return <PageLoading />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Organize your menu into categories</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" />Add Category</Button>
      </div>

      <SearchBar value={search} onChange={(v) => { setSearch(v); resetPage(); }} placeholder="Search categories..." />

      {data && data.items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((cat) => (
            <Card key={cat.category_id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{cat.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
                  </div>
                  <Badge variant={cat.active ? "success" : "secondary"}>{cat.active ? "Active" : "Inactive"}</Badge>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(cat)}><Edit className="h-3 w-3" />Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(cat.category_id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No categories" action={<Button onClick={openCreate}><Plus className="h-4 w-4" />Add Category</Button>} />
      )}

      {data && <Pagination pagination={data.pagination} onPageChange={setPage} />}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Category" : "New Category"}>
        <div className="space-y-4">
          <Input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input type="number" placeholder="Sort Order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />Active</label>
          <Button onClick={handleSubmit} disabled={!form.name || createCategory.isPending || updateCategory.isPending} className="w-full">
            {editing ? "Update" : "Create"}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteCategory.mutate(deleteId); setDeleteId(null); } }} title="Delete Category" description="Are you sure?" destructive loading={deleteCategory.isPending} />
    </div>
  );
}
