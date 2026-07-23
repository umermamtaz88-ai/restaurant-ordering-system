import * as React from "react";
import { cn } from "@/utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
}

const variantStyles = {
  text: "h-4 w-full rounded-md",
  circular: "rounded-full",
  rectangular: "rounded-xl",
} as const;

export function Skeleton({
  className,
  variant = "rectangular",
  ...props
}: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-pulse bg-latte/60 dark:bg-espresso/60",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
