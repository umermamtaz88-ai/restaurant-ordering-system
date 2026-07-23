"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { adminService, type AdminStats } from "@/services/admin.service";
import { ApiError } from "@/services/api";
import { formatPrice } from "@/utils/format";
import { ROUTES } from "@/constants/site";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminService.stats();
        setStats(res.data);
      } catch (error) {
        toast.error(
          error instanceof ApiError ? error.message : "Could not load stats",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = stats
    ? [
        { label: "Today's orders", value: String(stats.todays_orders) },
        { label: "Today's revenue", value: formatPrice(stats.todays_revenue) },
        { label: "Total revenue", value: formatPrice(stats.total_revenue) },
        { label: "Pending orders", value: String(stats.pending_orders) },
        { label: "Users", value: String(stats.total_users) },
        { label: "Menu items", value: String(stats.total_menu_items) },
        { label: "Customers", value: String(stats.total_customers) },
        { label: "Completed", value: String(stats.completed_orders) },
      ]
    : [];

  return (
    <AdminShell title="Dashboard">
      {loading ? (
        <p className="text-sm text-white/50">Loading…</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-white/10 bg-[#151b22] p-4"
              >
                <p className="font-sans text-xs text-white/45">{card.label}</p>
                <p className="mt-2 font-display text-2xl font-semibold text-olive">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-[#151b22] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Recent orders</h2>
                <Link
                  href={`${ROUTES.admin}/orders`}
                  className="font-sans text-xs text-olive hover:underline"
                >
                  View all
                </Link>
              </div>
              <ul className="space-y-2">
                {(stats?.recent_orders ?? []).map((o) => (
                  <li
                    key={o.order_id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2 font-sans text-sm"
                  >
                    <div>
                      <p className="font-medium">{o.order_number}</p>
                      <p className="text-xs text-white/45">
                        {o.customer_name || "Guest"} · {o.order_status}
                      </p>
                    </div>
                    <span className="text-olive">{formatPrice(o.total)}</span>
                  </li>
                ))}
                {(stats?.recent_orders ?? []).length === 0 && (
                  <li className="text-sm text-white/40">No orders yet</li>
                )}
              </ul>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#151b22] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Low stock</h2>
                <Link
                  href={`${ROUTES.admin}/inventory`}
                  className="font-sans text-xs text-olive hover:underline"
                >
                  Manage
                </Link>
              </div>
              <ul className="space-y-2">
                {(stats?.low_stock_items ?? []).map((i) => (
                  <li
                    key={i.inventory_id}
                    className="flex justify-between rounded-xl bg-amber-500/10 px-3 py-2 font-sans text-sm text-amber-100"
                  >
                    <span>{i.ingredient_name}</span>
                    <span>
                      {i.quantity} {i.unit}
                    </span>
                  </li>
                ))}
                {(stats?.low_stock_items ?? []).length === 0 && (
                  <li className="text-sm text-white/40">Stock looks healthy</li>
                )}
              </ul>
            </section>
          </div>
        </>
      )}
    </AdminShell>
  );
}
