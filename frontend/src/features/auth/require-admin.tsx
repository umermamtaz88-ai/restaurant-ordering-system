"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/auth-context";
import { isAdmin } from "@/lib/order-status";
import { ROUTES } from "@/constants/site";

const ADMIN_LOGIN = `${ROUTES.admin}/login`;

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const allowed = isAuthenticated && isAdmin(user?.role);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(
        `${ADMIN_LOGIN}?next=${encodeURIComponent(pathname || ROUTES.admin)}`,
      );
      return;
    }
    if (!allowed) {
      router.replace(ADMIN_LOGIN);
    }
  }, [allowed, isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1419] font-sans text-sm text-white/60">
        Loading admin panel…
      </div>
    );
  }

  if (!allowed) return null;
  return <>{children}</>;
}
