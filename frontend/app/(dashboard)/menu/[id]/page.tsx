"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useMenuItem, useUpdateMenuItem, useDeleteMenuItem } from "@/hooks/use-menu";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLoading } from "@/components/shared/page-loading";
import { ErrorState } from "@/components/ui/error-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatCurrency } from "@/lib/utils";

export default function MenuItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: item, isLoading, error, refetch } = useMenuItem(id);
  const { data: categories } = useCategories({ limit: 100 });
  const updateItem = useUpdateMenuItem();
  const deleteItem = useDeleteMenuItem();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, string | number | boolean>>({});

  if (isLoading) return <PageLoading />;
  if (error || !item) return <ErrorState message={error?.message ?? "Item not found"} onRetry={() => refetch()} />;

  const categoryName = categories?.items.find((c) => c.category_id === item.category_id)?.name;

  const startEdit = () => {
    setForm({
      name: item.name,
      description: item.description ?? "",
      category_id: item.category_id,
      price: item.price,
      discount_price: item.discount_price ?? "",
      available: item.available,
      preparation_time: item.preparation_time,
      featured: item.featured,
      spicy_level: item.spicy_level,
    });
    setEditing(true);
  };

  const handleSave = () => {
    updateItem.mutate({
      id,
      data: {
        name: form.name as string,
        description: (form.description as string) || undefined,
        category_id: form.category_id as string,
        price: Number(form.price),
        discount_price: form.discount_price ? Number(form.discount_price) : undefined,
        available: form.available as boolean,
        preparation_time: Number(form.preparation_time),
        featured: form.featured as boolean,
        spicy_level: Number(form.spicy_level),
      },
    }, { onSuccess: () => setEditing(false) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/menu"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{item.name}</h1>
          <p className="text-muted-foreground">{categoryName}</p>
        </div>
        <div className="flex gap-2">
          {!editing && <Button variant="outline" onClick={startEdit}>Edit</Button>}
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="aspect-video w-full rounded-t-xl object-cover" />
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-t-xl bg-muted text-muted-foreground">No image</div>
          )}
          <CardContent className="p-6 space-y-4">
            {editing ? (
              <div className="space-y-3">
                <Input value={form.name as string} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
                <Textarea value={form.description as string} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
                <Select value={form.category_id as string} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                  {categories?.items.map((c) => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
                </Select>
                <div className="grid grid-cols-2 gap-3">
                  <Input type="number" value={form.price as number} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" />
                  <Input type="number" value={form.discount_price as string} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} placeholder="Discount Price" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={updateItem.isPending}>Save</Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={item.available ? "success" : "destructive"}>{item.available ? "Available" : "Unavailable"}</Badge>
                  {item.featured && <Badge variant="warning">Featured</Badge>}
                  {item.spicy_level > 0 && <Badge variant="outline">Spicy Level {item.spicy_level}</Badge>}
                </div>
                <div className="flex items-baseline gap-2">
                  {item.discount_price ? (
                    <>
                      <span className="text-2xl font-bold text-primary">{formatCurrency(item.discount_price)}</span>
                      <span className="text-muted-foreground line-through">{formatCurrency(item.price)}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold">{formatCurrency(item.price)}</span>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Prep Time</span><span>{item.preparation_time} min</span></div>
              {item.calories && <div className="flex justify-between"><span className="text-muted-foreground">Calories</span><span>{item.calories}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Rating</span><span>{item.rating.toFixed(1)} ({item.total_reviews} reviews)</span></div>
            </CardContent>
          </Card>
          {item.ingredients.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Ingredients</CardTitle></CardHeader>
              <CardContent><div className="flex flex-wrap gap-2">{item.ingredients.map((i) => <Badge key={i} variant="secondary">{i}</Badge>)}</div></CardContent>
            </Card>
          )}
          {item.allergens.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Allergens</CardTitle></CardHeader>
              <CardContent><div className="flex flex-wrap gap-2">{item.allergens.map((a) => <Badge key={a} variant="outline">{a}</Badge>)}</div></CardContent>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => deleteItem.mutate(id, { onSuccess: () => router.push("/menu") })} title="Delete Item" description="This will permanently delete this menu item." destructive loading={deleteItem.isPending} />
    </div>
  );
}
