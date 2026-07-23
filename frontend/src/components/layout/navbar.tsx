"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, User, LogOut, X } from "lucide-react";
import { CAFE_INFO, ROUTES, SITE_NAME } from "@/constants/site";
import { useCart } from "@/features/cart/use-cart";
import { useAuth } from "@/features/auth/auth-context";
import { useScroll } from "@/hooks/use-scroll";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { toast } from "sonner";

const NAV_LINKS = [
  { href: ROUTES.home, label: "Home" },
  { href: ROUTES.menu, label: "Menu" },
  { href: ROUTES.about, label: "About Us" },
  { href: ROUTES.gallery, label: "Gallery" },
  { href: ROUTES.contact, label: "Contact" },
] as const;

function pathOf(href: string) {
  return href.split("#")[0] ?? href;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const scrolled = useScroll(24);
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isHome = pathname === ROUTES.home;
  const transparent = isHome && !scrolled;

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    router.push(`${ROUTES.menu}?search=${encodeURIComponent(q)}`);
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    router.push(ROUTES.home);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          transparent
            ? "bg-transparent"
            : "border-b border-border/60 bg-warm-white/80 shadow-soft backdrop-blur-xl dark:bg-charcoal/80",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[4.25rem] sm:px-6 lg:px-8">
          <Link
            href={ROUTES.home}
            className={cn(
              "font-display text-2xl tracking-tight transition-colors",
              transparent ? "text-warm-white" : "text-espresso dark:text-cream",
            )}
            aria-label={`${SITE_NAME} Café home`}
          >
            {SITE_NAME}
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV_LINKS.map((link) => {
              const linkPath = pathOf(link.href);
              const active =
                linkPath === ROUTES.home
                  ? pathname === linkPath
                  : pathname.startsWith(linkPath);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3 py-2 font-sans text-sm transition-colors",
                    transparent
                      ? active
                        ? "text-warm-white"
                        : "text-cream/80 hover:text-warm-white"
                      : active
                        ? "bg-latte/40 text-espresso dark:bg-espresso dark:text-cream"
                        : "text-charcoal/80 hover:text-espresso dark:text-cream/80 dark:hover:text-cream",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label="Search menu"
              onClick={() => setSearchOpen((v) => !v)}
              className={cn(
                "inline-flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors",
                transparent
                  ? "text-warm-white hover:bg-warm-white/10"
                  : "text-espresso hover:bg-latte/40 dark:text-cream dark:hover:bg-espresso",
              )}
            >
              <Search className="size-5" />
            </button>

            <ThemeToggle
              className={
                transparent
                  ? "text-warm-white hover:bg-warm-white/10 [&_svg]:text-warm-white"
                  : undefined
              }
            />

            <Link
              href={ROUTES.cart}
              aria-label={`Cart, ${itemCount} items`}
              className={cn(
                "relative inline-flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors",
                transparent
                  ? "text-warm-white hover:bg-warm-white/10"
                  : "text-espresso hover:bg-latte/40 dark:text-cream dark:hover:bg-espresso",
              )}
            >
              <ShoppingBag className="size-5" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-olive text-[10px] font-semibold text-warm-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              {isLoading ? null : isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "rounded-full",
                      transparent && "text-warm-white hover:bg-warm-white/10",
                    )}
                    asChild
                  >
                    <Link href={ROUTES.profile}>
                      <User className="size-4" />
                      {user?.full_name?.split(" ")[0] || "Profile"}
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "rounded-full",
                      transparent &&
                        "border-warm-white/40 text-warm-white hover:bg-warm-white/10",
                    )}
                    onClick={handleLogout}
                  >
                    <LogOut className="size-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "rounded-full",
                      transparent && "text-warm-white hover:bg-warm-white/10",
                    )}
                    asChild
                  >
                    <Link href={ROUTES.login}>
                      <User className="size-4" />
                      Login
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant={transparent ? "outline" : "primary"}
                    className={cn(
                      "rounded-full",
                      transparent &&
                        "border-warm-white/40 text-warm-white hover:bg-warm-white/10",
                    )}
                    asChild
                  >
                    <Link href={ROUTES.signup}>Sign up</Link>
                  </Button>
                </>
              )}
            </div>

            <button
              type="button"
              aria-label="Open menu"
              className={cn(
                "inline-flex size-10 cursor-pointer items-center justify-center rounded-full lg:hidden",
                transparent
                  ? "text-warm-white hover:bg-warm-white/10"
                  : "text-espresso hover:bg-latte/40 dark:text-cream dark:hover:bg-espresso",
              )}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-border/50 bg-warm-white/95 backdrop-blur-xl dark:bg-charcoal/95">
            <form
              onSubmit={handleSearch}
              className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8"
            >
              <Input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search the menu…"
                aria-label="Search the menu"
                className="flex-1"
              />
              <Button type="submit" className="rounded-full">
                Search
              </Button>
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full hover:bg-latte/40 dark:hover:bg-espresso"
              >
                <X className="size-5" />
              </button>
            </form>
          </div>
        )}
      </header>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Menu"
        side="right"
      >
        <nav className="flex flex-col gap-1" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-4 py-3 font-sans text-base text-espresso transition-colors hover:bg-latte/40 dark:text-cream dark:hover:bg-espresso"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={ROUTES.reservation}
            className="rounded-xl px-4 py-3 font-sans text-base text-espresso transition-colors hover:bg-latte/40 dark:text-cream dark:hover:bg-espresso"
          >
            Book a Table
          </Link>
          <div className="my-3 border-t border-border" />
          {isAuthenticated ? (
            <>
              <Link
                href={ROUTES.profile}
                className="rounded-xl px-4 py-3 font-sans text-base text-espresso hover:bg-latte/40 dark:text-cream dark:hover:bg-espresso"
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl px-4 py-3 text-left font-sans text-base text-espresso hover:bg-latte/40 dark:text-cream dark:hover:bg-espresso"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href={ROUTES.login}
                className="rounded-xl px-4 py-3 font-sans text-base text-espresso hover:bg-latte/40 dark:text-cream dark:hover:bg-espresso"
              >
                Login
              </Link>
              <Link
                href={ROUTES.signup}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-olive px-4 py-3 font-sans text-sm font-medium text-warm-white"
              >
                Sign up
              </Link>
            </>
          )}
          <p className="mt-6 px-4 font-sans text-xs text-charcoal/60 dark:text-cream/60">
            {CAFE_INFO.phone} · {CAFE_INFO.city}
          </p>
        </nav>
      </Drawer>

      {!isHome && <div className="h-16 sm:h-[4.25rem]" aria-hidden="true" />}
    </>
  );
}
