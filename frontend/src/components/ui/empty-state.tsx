import * as React from "react";
import { cn } from "@/utils/cn";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-latte/60 bg-cream/30 px-6 py-12 text-center dark:border-latte/20 dark:bg-espresso/30",
        className
      )}
      {...props}
    >
      {icon && (
        <div
          className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-latte/50 text-olive dark:bg-espresso dark:text-olive"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-espresso dark:text-cream">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm font-sans text-sm text-charcoal/70 dark:text-cream/70">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
