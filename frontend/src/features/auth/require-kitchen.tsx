"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/auth-context";
import { isKitchenStaff } from "@/lib/order-status";
import { ROUTES } from "@/constants/site";

const KITCHEN_LOGIN = `${ROUTES.kitchen}/login`;

export function RequireKitchenStaff({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const allowed = isAuthenticated && isKitchenStaff(user?.role);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(
        `${KITCHEN_LOGIN}?next=${encodeURIComponent(pathname || ROUTES.kitchen)}`,
      );
      return;
    }
    if (!allowed) {
      router.replace(KITCHEN_LOGIN);
    }
  }, [allowed, isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center font-sans text-sm text-cream/60">
        Loading kitchen panel…
      </div>
    );
  }

  if (!allowed) return null;
  return <>{children}</>;
}
