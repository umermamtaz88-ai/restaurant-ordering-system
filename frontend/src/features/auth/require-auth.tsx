"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/auth-context";
import { ROUTES } from "@/constants/site";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const next = encodeURIComponent(pathname || ROUTES.home);
      router.replace(`${ROUTES.login}?next=${next}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center font-sans text-sm text-charcoal/60 dark:text-cream/60">
        Checking session…
      </div>
    );
  }

  if (!isAuthenticated) return null;
  return <>{children}</>;
}
