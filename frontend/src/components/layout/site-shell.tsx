"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

/** Routes that use a standalone panel (no café navbar/footer). */
function isStandaloneRoute(pathname: string | null) {
  if (!pathname) return false;
  return (
    pathname === "/kitchen" ||
    pathname.startsWith("/kitchen/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const standalone = isStandaloneRoute(pathname);

  if (standalone) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
