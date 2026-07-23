"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ChefHat, Clock, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequireKitchenStaff } from "@/features/auth/require-kitchen";
import { useAuth } from "@/features/auth/auth-context";
import { nextKitchenAction } from "@/lib/order-status";
import { ApiError } from "@/services/api";
import { orderService, type PlacedOrder } from "@/services/order.service";
import { formatPrice } from "@/utils/format";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants/site";

/** Three simple kitchen stages */
const COLUMNS: {
  key: string;
  title: string;
  match: string[];
  empty: string;
}[] = [
  {
    key: "start",
    title: "1 · Start work",
    match: ["Pending", "Confirmed", "Ready", "Out for Delivery", "Delivered"],
    empty: "No new orders",
  },
  {
    key: "process",
    title: "2 · In process",
    match: ["Preparing"],
    empty: "Nothing cooking",
  },
  {
    key: "finish",
    title: "3 · Finished",
    match: ["Completed"],
    empty: "None finished yet",
  },
];

function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-sm text-cream/70">
      <Clock className="size-4" />
      {time}
    </span>
  );
}

function stageLabel(status: string) {
  if (status === "Preparing") return "In process";
  if (status === "Completed") return "Finished";
  return "Waiting";
}

function KitchenBoard() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      // Include finished so column 3 can show recent completes briefly
      const response = await orderService.kitchenQueue(false, 1, 100);
      const items = response.data?.items ?? [];
      // Keep finished only from the last ~2 hours for a clean board
      const cutoff = Date.now() - 2 * 60 * 60 * 1000;
      setOrders(
        items.filter((o) => {
          if (o.order_status === "Cancelled") return false;
          if (o.order_status !== "Completed") return true;
          const t = o.updated_at || o.created_at;
          if (!t) return true;
          return new Date(t).getTime() >= cutoff;
        }),
      );
    } catch (error) {
      if (!silent) {
        toast.error(
          error instanceof ApiError ? error.message : "Could not load orders",
        );
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Fast refresh while tab is visible
  useEffect(() => {
    const tick = () => {
      if (!document.hidden) void load(true);
    };
    const id = window.setInterval(tick, 5000);
    const onVisibility = () => {
      if (!document.hidden) void load(true);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [load]);

  const byColumn = useMemo(() => {
    const map: Record<string, PlacedOrder[]> = {};
    for (const col of COLUMNS) map[col.key] = [];
    for (const order of orders) {
      const col = COLUMNS.find((c) => c.match.includes(order.order_status));
      if (col) map[col.key].push(order);
    }
    return map;
  }, [orders]);

  const advance = async (order: PlacedOrder, nextStatus: string, label: string) => {
    setUpdatingId(order.order_id);
    try {
      const response = await orderService.updateKitchenStatus(
        order.order_id,
        nextStatus,
      );
      toast.success(`${order.order_number} — ${label}`);
      if (response.data) {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === order.order_id ? { ...o, ...response.data! } : o,
          ),
        );
      } else {
        await load(true);
      }
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Could not update",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.assign(`${ROUTES.kitchen}/login`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#1a1410]/95 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-olive/25 text-olive">
              <ChefHat className="size-6" />
            </span>
            <div>
              <h1 className="font-display text-xl font-semibold text-cream sm:text-2xl">
                Solenne Kitchen
              </h1>
              <p className="font-sans text-xs text-cream/50 sm:text-sm">
                Start work → In process → Finish · {user?.full_name}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <LiveClock />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-xl"
              onClick={() => void load()}
            >
              <RefreshCw className="size-4" />
              Refresh
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl border-white/20 bg-transparent text-cream hover:bg-white/10"
              onClick={() => void handleLogout()}
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-[1600px]">
          {loading ? (
            <p className="font-sans text-sm text-cream/60">Loading orders…</p>
          ) : (
            <div className="grid gap-5 lg:grid-cols-3">
              {COLUMNS.map((col) => (
                <section key={col.key} className="min-w-0">
                  <h2 className="mb-3 flex items-center justify-between font-display text-lg font-semibold text-cream">
                    {col.title}
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-sans text-xs font-normal">
                      {byColumn[col.key]?.length ?? 0}
                    </span>
                  </h2>
                  <ul className="space-y-3">
                    {(byColumn[col.key] ?? []).length === 0 ? (
                      <li className="rounded-2xl border border-dashed border-white/15 px-4 py-8 text-center font-sans text-sm text-cream/40">
                        {col.empty}
                      </li>
                    ) : (
                      (byColumn[col.key] ?? []).map((order) => {
                        const action = nextKitchenAction(order.order_status);
                        const busy = updatingId === order.order_id;
                        return (
                          <li
                            key={order.order_id}
                            className="rounded-2xl border border-white/10 bg-[#241c16] p-4 shadow-lg"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-display text-xl font-bold text-cream">
                                  {order.order_number}
                                </p>
                                <p className="mt-0.5 font-sans text-sm text-cream/55">
                                  {order.customer_name || "Guest"} ·{" "}
                                  {order.order_type}
                                </p>
                              </div>
                              <span
                                className={cn(
                                  "rounded-full px-2.5 py-1 font-sans text-xs font-medium",
                                  col.key === "start" &&
                                    "bg-amber-500/20 text-amber-200",
                                  col.key === "process" &&
                                    "bg-sky-500/20 text-sky-200",
                                  col.key === "finish" &&
                                    "bg-olive/25 text-olive",
                                )}
                              >
                                {stageLabel(order.order_status)}
                              </span>
                            </div>

                            <ul className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
                              {(order.items ?? []).map((item, idx) => (
                                <li
                                  key={`${order.order_id}-${idx}`}
                                  className="font-sans text-base font-medium text-cream/90"
                                >
                                  <span className="mr-2 inline-flex size-7 items-center justify-center rounded-md bg-olive/25 text-sm font-bold text-olive">
                                    {item.quantity}
                                  </span>
                                  {item.name}
                                </li>
                              ))}
                            </ul>

                            {order.notes && (
                              <p className="mt-3 rounded-xl bg-amber-500/15 px-3 py-2 font-sans text-xs text-amber-100">
                                Note: {order.notes}
                              </p>
                            )}

                            <p className="mt-3 font-display text-sm font-semibold text-olive">
                              {formatPrice(order.total)}
                            </p>

                            {action && (
                              <Button
                                type="button"
                                size="lg"
                                variant="secondary"
                                className={cn(
                                  "mt-4 w-full rounded-xl text-base font-semibold",
                                  action.label === "Start work" &&
                                    "bg-amber-500 text-[#1a1410] hover:bg-amber-400",
                                  action.label === "Finish" &&
                                    "bg-olive text-warm-white hover:bg-olive/90",
                                )}
                                loading={busy}
                                disabled={busy}
                                onClick={() =>
                                  void advance(
                                    order,
                                    action.status,
                                    action.label,
                                  )
                                }
                              >
                                {action.label}
                              </Button>
                            )}
                          </li>
                        );
                      })
                    )}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function KitchenPage() {
  return (
    <RequireKitchenStaff>
      <KitchenBoard />
    </RequireKitchenStaff>
  );
}
