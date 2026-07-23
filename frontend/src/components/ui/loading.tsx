import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  label?: string;
  fullPage?: boolean;
}

const sizeMap = {
  sm: "size-5",
  md: "size-8",
  lg: "size-12",
} as const;

export function Loading({
  size = "md",
  label = "Loading",
  fullPage = false,
  className,
  ...props
}: LoadingProps) {
  const spinner = (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
      {...props}
    >
      <Loader2
        className={cn("animate-spin text-olive", sizeMap[size])}
        aria-hidden="true"
      />
      {label && (
        <span className="font-sans text-sm text-charcoal/70 dark:text-cream/70">
          {label}
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-warm-white/80 backdrop-blur-sm dark:bg-charcoal/80">
        {spinner}
      </div>
    );
  }

  return spinner;
}
