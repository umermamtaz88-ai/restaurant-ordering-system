"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, Star } from "lucide-react";
import { useMenu, useDeleteMenuItem } from "@/hooks/use-menu";
import { useCategories } from "@/hooks/use-categories";
import { useSearch, usePagination } from "@/hooks/use-pagination";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { PageLoading } from "@/components/shared/page-loading";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatCurrency } from "@/lib/utils";

export default function MenuPage() {
  const { search, setSearch, debouncedSearch } = useSearch();
  const { page, setPage, resetPage } = usePagination();
  const [view, setView] = useState<"grid" | "table">("grid");
  const [categoryId, setCategoryId] = useState("");
  const [available, setAvailable] = useState<string>("");
  const [featured, setFeatured] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: categories } = useCategories({ limit: 100 });
  const { data, isLoading, error, refetch } = useMenu({
    page,
    limit: 12,
    q: debouncedSearch || undefined,
    category_id: categoryId || undefined,
    available: available === "" ? undefined : available === "true",
    featured: featured === "" ? undefined : featured === "true",
  });
  const deleteItem = useDeleteMenuItem();

  if (isLoading) return <PageLoading />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  const categoryMap = new Map(
    categories?.items.map((c) => [c.category_id, c.name]) ?? []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Menu</h1>
          <p className="text-muted-foreground">Manage your restaurant menu items</p>
        </div>
        <Link href="/menu/new">
          <Button><Plus className="h-4 w-4" />Add Item</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchBar value={search} onChange={(v) => { setSearch(v); resetPage(); }} placeholder="Search menu..." className="flex-1" />
        <div className="flex flex-wrap gap-2">
          <Select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); resetPage(); }} className="w-40">
            <option value="">All Categories</option>
            {categories?.items.map((c) => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
          </Select>
          <Select value={available} onChange={(e) => { setAvailable(e.target.value); resetPage(); }} className="w-36">
            <option value="">All Status</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </Select>
          <Select value={featured} onChange={(e) => { setFeatured(e.target.value); resetPage(); }} className="w-36">
            <option value="">All Items</option>
            <option value="true">Featured</option>
            <option value="false">Not Featured</option>
          </Select>
          <Tabs tabs={[{ id: "grid", label: "Grid" }, { id: "table", label: "Table" }]} activeTab={view} onTabChange={(id) => setView(id as "grid" | "table")} className="w-auto" />
        </div>
      </div>

      {data && data.items.length > 0 ? (
        view === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.items.map((item) => (
              <Card key={item.item_id} className="group overflow-hidden">
                <div className="relative aspect-video bg-muted">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
                  )}
                  {item.featured && (
                    <Badge className="absolute top-2 right-2" variant="warning">
                      <Star className="h-3 w-3 mr-1" />Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/menu/${item.item_id}`} className="font-semibold hover:text-primary">{item.name}</Link>
                      <p className="text-xs text-muted-foreground">{categoryMap.get(item.category_id) ?? item.category_id}</p>
                    </div>
                    <Badge variant={item.available ? "success" : "destructive"}>{item.available ? "Available" : "Unavailable"}</Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      {item.discount_price ? (
                        <>
                          <span className="font-bold text-primary">{formatCurrency(item.discount_price)}</span>
                          <span className="ml-1 text-sm text-muted-foreground line-through">{formatCurrency(item.price)}</span>
                        </>
                      ) : (
                        <span className="font-bold">{formatCurrency(item.price)}</span>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/menu/${item.item_id}`}><Button variant="ghost" size="icon" aria-label="Edit"><Edit className="h-4 w-4" /></Button></Link>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.item_id)} aria-label="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Category</th>
                    <th className="px-6 py-3 font-medium">Price</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Rating</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item.item_id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="px-6 py-4 font-medium">
                        <Link href={`/menu/${item.item_id}`} className="hover:text-primary">{item.name}</Link>
                      </td>
                      <td className="px-6 py-4">{categoryMap.get(item.category_id)}</td>
                      <td className="px-6 py-4">{formatCurrency(item.discount_price ?? item.price)}</td>
                      <td className="px-6 py-4"><Badge variant={item.available ? "success" : "destructive"}>{item.available ? "Available" : "Unavailable"}</Badge></td>
                      <td className="px-6 py-4">{item.rating.toFixed(1)} ({item.total_reviews})</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <Link href={`/menu/${item.item_id}`}><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button></Link>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.item_id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )
      ) : (
        <EmptyState title="No menu items" description="Add your first menu item to get started." action={<Link href="/menu/new"><Button><Plus className="h-4 w-4" />Add Item</Button></Link>} />
      )}

      {data && data.pagination.total_pages > 1 && (
        <Pagination pagination={data.pagination} onPageChange={setPage} />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteItem.mutate(deleteId); setDeleteId(null); } }}
        title="Delete Menu Item"
        description="Are you sure you want to delete this menu item?"
        destructive
        loading={deleteItem.isPending}
      />
    </div>
  );
}
