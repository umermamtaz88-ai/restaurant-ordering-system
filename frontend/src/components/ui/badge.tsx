import * as React from "react";
import { cn } from "@/utils/cn";

const variantStyles = {
  default:
    "bg-latte/60 text-espresso dark:bg-espresso dark:text-cream",
  olive: "bg-olive text-warm-white",
  cream: "bg-cream text-espresso dark:bg-charcoal dark:text-cream",
  discount:
    "bg-olive/15 text-olive ring-1 ring-olive/30 dark:bg-olive/20 dark:text-olive",
  success:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
} as const;

export type BadgeVariant = keyof typeof variantStyles;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
