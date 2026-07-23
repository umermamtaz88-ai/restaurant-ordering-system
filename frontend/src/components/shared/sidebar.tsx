"use client";

import { cn } from "@/utils/cn";

export interface SidebarProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/** Sticky filter/sidebar panel for menu and account layouts. */
export function Sidebar({ title, children, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "rounded-3xl border border-border bg-card p-5 shadow-soft lg:sticky lg:top-24",
        className,
      )}
    >
      {title ? (
        <h2 className="mb-4 font-display text-lg text-espresso dark:text-cream">
          {title}
        </h2>
      ) : null}
      {children}
    </aside>
  );
}
