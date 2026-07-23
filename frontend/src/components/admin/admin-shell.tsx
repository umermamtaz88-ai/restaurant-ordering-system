"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  UtensilsCrossed,
  Tags,
  Contact,
  TicketPercent,
  Package,
  LogOut,
  ChefHat,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { RequireAdmin } from "@/features/auth/require-admin";
import { ROUTES } from "@/constants/site";
import { cn } from "@/utils/cn";

const NAV = [
  { href: ROUTES.admin, label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: `${ROUTES.admin}/users`, label: "Users", icon: Users },
  { href: `${ROUTES.admin}/orders`, label: "Orders", icon: ShoppingBag },
  { href: `${ROUTES.admin}/menu`, label: "Menu", icon: UtensilsCrossed },
  { href: `${ROUTES.admin}/categories`, label: "Categories", icon: Tags },
  { href: `${ROUTES.admin}/customers`, label: "Customers", icon: Contact },
  { href: `${ROUTES.admin}/coupons`, label: "Coupons", icon: TicketPercent },
  { href: `${ROUTES.admin}/inventory`, label: "Inventory", icon: Package },
] as const;

export function AdminShell({
  title,
  children,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.assign(`${ROUTES.admin}/login`);
  };

  return (
    <RequireAdmin>
      <div className="flex min-h-screen bg-[#0f1419] text-white">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-white/10 bg-[#151b22] lg:flex">
          <div className="border-b border-white/10 px-5 py-5">
            <p className="font-display text-lg font-semibold">Solenne Admin</p>
            <p className="mt-1 truncate font-sans text-xs text-white/45">
              {user?.full_name}
            </p>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 font-sans text-sm transition-colors",
                    active
                      ? "bg-olive/25 text-olive"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-1 border-t border-white/10 p-3">
            <Link
              href={ROUTES.kitchen}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-sans text-sm text-white/70 hover:bg-white/5"
            >
              <ChefHat className="size-4" />
              Kitchen
            </Link>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-sans text-sm text-white/70 hover:bg-white/5"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6">
            <div>
              <h1 className="font-display text-xl font-semibold sm:text-2xl">
                {title}
              </h1>
              <div className="mt-2 flex flex-wrap gap-2 lg:hidden">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-full px-3 py-1 font-sans text-xs",
                      pathname === item.href ||
                        (!("exact" in item && item.exact) &&
                          pathname.startsWith(item.href) &&
                          item.href !== ROUTES.admin)
                        ? "bg-olive/25 text-olive"
                        : "bg-white/5 text-white/60",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            {actions}
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </RequireAdmin>
  );
}
