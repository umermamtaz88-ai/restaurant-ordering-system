"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCreateMenuItem } from "@/hooks/use-menu";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewMenuItemPage() {
  const router = useRouter();
  const createItem = useCreateMenuItem();
  const { data: categories } = useCategories({ limit: 100, active: true });
  const [form, setForm] = useState({
    name: "", description: "", category_id: "", price: "", discount_price: "",
    preparation_time: "15", spicy_level: "0", featured: false, available: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createItem.mutate({
      name: form.name,
      description: form.description || undefined,
      category_id: form.category_id,
      price: Number(form.price),
      discount_price: form.discount_price ? Number(form.discount_price) : undefined,
      preparation_time: Number(form.preparation_time),
      spicy_level: Number(form.spicy_level),
      featured: form.featured,
      available: form.available,
    }, { onSuccess: (data) => router.push(`/menu/${data.item_id}`) });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/menu"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-bold">Add Menu Item</h1>
      </div>
      <Card>
        <CardHeader><CardTitle>Item Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
              <option value="">Select Category *</option>
              {categories?.items.map((c) => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
            </Select>
            <div className="grid grid-cols-2 gap-4">
              <Input type="number" step="0.01" placeholder="Price *" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              <Input type="number" step="0.01" placeholder="Discount Price" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input type="number" placeholder="Prep Time (min)" value={form.preparation_time} onChange={(e) => setForm({ ...form, preparation_time: e.target.value })} />
              <Input type="number" min="0" max="5" placeholder="Spicy Level" value={form.spicy_level} onChange={(e) => setForm({ ...form, spicy_level: e.target.value })} />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />Available</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />Featured</label>
            </div>
            <Button type="submit" disabled={createItem.isPending} className="w-full">
              {createItem.isPending ? "Creating..." : "Create Item"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
