import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/utils/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  showHome?: boolean;
  homeHref?: string;
}

export function Breadcrumb({
  items,
  showHome = true,
  homeHref = "/",
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("", className)} {...props}>
      <ol className="flex flex-wrap items-center gap-1.5 font-sans text-sm">
        {showHome && (
          <li className="flex items-center">
            <Link
              href={homeHref}
              className="flex items-center text-charcoal/60 transition-colors hover:text-olive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 dark:text-cream/60 dark:hover:text-olive"
              aria-label="Home"
            >
              <Home className="size-4" aria-hidden="true" />
            </Link>
            {items.length > 0 && (
              <ChevronRight
                className="mx-1.5 size-3.5 text-charcoal/30 dark:text-cream/30"
                aria-hidden="true"
              />
            )}
          </li>
        )}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-charcoal/60 transition-colors hover:text-olive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 dark:text-cream/60 dark:hover:text-olive"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="font-medium text-espresso dark:text-cream"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight
                  className="mx-1.5 size-3.5 text-charcoal/30 dark:text-cream/30"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
