"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Heart,
  LogOut,
  Package,
  Settings,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs } from "@/components/ui/tabs";
import { menuItems } from "@/data/menu";
import { useCart } from "@/features/cart/use-cart";
import { useAuth } from "@/features/auth/auth-context";
import { RequireAuth } from "@/features/auth/require-auth";
import { ROUTES, CAFE_INFO } from "@/constants/site";
import { formatPrice } from "@/utils/format";
import { authService } from "@/services/auth.service";
import { orderService, type PlacedOrder } from "@/services/order.service";
import { ApiError } from "@/services/api";
import {
  OrderStatusBadge,
  OrderStatusTimeline,
} from "@/components/orders/order-status";

function ProfileContent() {
  const { user, logout, setUser } = useAuth();
  const { favorites } = useCart();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setFullName(user.full_name || "");
    setPhone(user.phone || "");
    setAddress(user.address || "");
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async (silent = false) => {
      if (!silent) setOrdersLoading(true);
      try {
        const response = await orderService.list(1, 20);
        if (!cancelled) setOrders(response.data?.items ?? []);
      } catch {
        if (!cancelled && !silent) setOrders([]);
      } finally {
        if (!cancelled && !silent) setOrdersLoading(false);
      }
    };

    void loadOrders();

    const tick = () => {
      if (document.hidden || cancelled) return;
      void loadOrders(true);
    };
    const id = window.setInterval(tick, 15000);
    const onVisibility = () => {
      if (!document.hidden) void loadOrders(true);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const favoriteProducts = useMemo(
    () => menuItems.filter((item) => favorites.includes(item.id)),
    [favorites],
  );

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Signed out");
      router.replace(ROUTES.login);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await authService.updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        address: address.trim() || undefined,
      });
      if (response.data) {
        setUser(response.data);
        toast.success("Profile updated");
      }
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Could not update profile",
      );
    } finally {
      setSaving(false);
    }
  };

  const tabItems = [
    {
      id: "orders",
      label: "Orders",
      content: ordersLoading ? (
        <p className="font-sans text-sm text-charcoal/60 dark:text-cream/60">
          Loading orders…
        </p>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<Package className="size-7" />}
          title="No orders yet"
          description="When you place an order, it will appear here with status and details."
          action={
            <Button asChild variant="secondary" className="rounded-2xl">
              <Link href={ROUTES.menu}>Order now</Link>
            </Button>
          }
          className="rounded-3xl border-none bg-latte/20 dark:bg-espresso/40"
        />
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li
              key={order.order_id}
              className="rounded-3xl border border-latte/40 bg-card p-5 shadow-soft dark:border-latte/20"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display text-base font-semibold text-espresso dark:text-cream">
                    {order.order_number}
                  </p>
                  <p className="mt-1 font-sans text-sm text-charcoal/60 dark:text-cream/60">
                    {order.order_type || "Order"} · {order.payment_status}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <OrderStatusBadge status={order.order_status} />
                  <p className="font-display text-base font-semibold text-olive">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>
              <OrderStatusTimeline
                status={order.order_status}
                orderType={order.order_type}
              />
              {order.items && order.items.length > 0 && (
                <ul className="mt-3 space-y-1 border-t border-latte/30 pt-3 dark:border-latte/15">
                  {order.items.map((item, idx) => (
                    <li
                      key={`${order.order_id}-${idx}`}
                      className="flex justify-between gap-3 font-sans text-sm text-charcoal/80 dark:text-cream/80"
                    >
                      <span>
                        {item.quantity}× {item.name}
                      </span>
                      <span>{formatPrice(item.total_price)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "favorites",
      label: "Favorites",
      content:
        favoriteProducts.length === 0 ? (
          <EmptyState
            icon={<Heart className="size-7" />}
            title="No favorites saved"
            description="Tap the heart on any menu item to save it here."
            action={
              <Button asChild variant="secondary" className="rounded-2xl">
                <Link href={ROUTES.menu}>Explore menu</Link>
              </Button>
            }
            className="rounded-3xl border-none bg-latte/20 dark:bg-espresso/40"
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {favoriteProducts.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/menu/${item.slug}`}
                  className="flex items-center gap-4 rounded-3xl border border-latte/40 bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift dark:border-latte/20"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-base font-semibold text-espresso dark:text-cream">
                      {item.name}
                    </p>
                    <p className="mt-0.5 font-sans text-sm text-charcoal/60 dark:text-cream/60">
                      {item.category}
                    </p>
                    <p className="mt-1 font-display text-sm font-semibold text-olive">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <Heart className="size-4 shrink-0 fill-olive text-olive" />
                </Link>
              </li>
            ))}
          </ul>
        ),
    },
    {
      id: "settings",
      label: "Settings",
      content: (
        <div className="space-y-4">
          <div className="rounded-3xl border border-latte/40 bg-card p-5 shadow-soft dark:border-latte/20">
            <h3 className="font-display text-base font-semibold text-espresso dark:text-cream">
              Account details
            </h3>
            <div className="mt-4 space-y-3">
              <label className="block font-sans text-sm">
                <span className="mb-1.5 block text-charcoal/70 dark:text-cream/70">
                  Full name
                </span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-2xl border border-latte/50 bg-warm-white px-4 py-2.5 outline-none focus:border-olive dark:border-latte/20 dark:bg-espresso"
                />
              </label>
              <label className="block font-sans text-sm">
                <span className="mb-1.5 block text-charcoal/70 dark:text-cream/70">
                  Phone
                </span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-latte/50 bg-warm-white px-4 py-2.5 outline-none focus:border-olive dark:border-latte/20 dark:bg-espresso"
                />
              </label>
              <label className="block font-sans text-sm">
                <span className="mb-1.5 block text-charcoal/70 dark:text-cream/70">
                  Address
                </span>
                <input
                  value={address ?? ""}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-2xl border border-latte/50 bg-warm-white px-4 py-2.5 outline-none focus:border-olive dark:border-latte/20 dark:bg-espresso"
                />
              </label>
              <Button
                type="button"
                variant="secondary"
                loading={saving}
                className="rounded-2xl"
                onClick={handleSaveProfile}
              >
                Save changes
              </Button>
            </div>
          </div>

          {[
            {
              icon: Bell,
              title: "Notifications",
              description: "Order updates and promotional offers",
            },
            {
              icon: Settings,
              title: "Preferences",
              description: "Language, theme, and payment methods",
            },
          ].map((setting) => {
            const Icon = setting.icon;
            return (
              <div
                key={setting.title}
                className="flex items-center justify-between gap-4 rounded-3xl border border-latte/40 bg-card p-5 shadow-soft dark:border-latte/20"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-latte/40 text-olive dark:bg-espresso">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="font-display text-base font-semibold text-espresso dark:text-cream">
                      {setting.title}
                    </p>
                    <p className="mt-0.5 font-sans text-sm text-charcoal/60 dark:text-cream/60">
                      {setting.description}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-latte/50 px-3 py-1 font-sans text-xs font-medium text-charcoal/70 dark:bg-espresso dark:text-cream/70">
                  Coming soon
                </span>
              </div>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage your account, orders, and saved favorites."
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Profile" },
        ]}
      />

      <Container className="py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
          <aside className="rounded-3xl border border-latte/40 bg-card p-6 text-center shadow-soft dark:border-latte/20 lg:sticky lg:top-24">
            <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-latte/50 text-olive dark:bg-espresso">
              <User className="size-10" />
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-espresso dark:text-cream">
              {user?.full_name}
            </h2>
            <p className="mt-1 font-sans text-sm text-charcoal/60 dark:text-cream/60">
              {user?.email}
            </p>
            <p className="mt-1 font-sans text-xs text-charcoal/50 dark:text-cream/50">
              {user?.phone}
            </p>
            <p className="mt-4 font-sans text-xs text-charcoal/50 dark:text-cream/50">
              Member · {CAFE_INFO.name}
            </p>
            <Button
              variant="outline"
              className="mt-6 w-full rounded-2xl"
              loading={loggingOut}
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </aside>

          <div className="rounded-3xl border border-latte/40 bg-card p-6 shadow-soft dark:border-latte/20 sm:p-8">
            <Tabs items={tabItems} defaultTab="orders" />
          </div>
        </div>
      </Container>
    </>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}
