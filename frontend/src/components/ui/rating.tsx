import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  count?: number;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
} as const;

export function Rating({
  value,
  max = 5,
  count,
  showValue = true,
  size = "md",
  className,
  ...props
}: RatingProps) {
  const clampedValue = Math.min(Math.max(value, 0), max);
  const starSize = sizeMap[size];

  return (
    <div
      className={cn("inline-flex items-center gap-2", className)}
      role="img"
      aria-label={`Rating: ${clampedValue} out of ${max} stars${count !== undefined ? `, ${count} reviews` : ""}`}
      {...props}
    >
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: max }, (_, index) => {
          const filled = index < Math.floor(clampedValue);
          const partial =
            !filled &&
            index < clampedValue &&
            clampedValue - index >= 0.25;

          return (
            <Star
              key={index}
              className={cn(
                starSize,
                filled || partial
                  ? "fill-olive text-olive"
                  : "fill-latte/40 text-latte/60 dark:fill-espresso dark:text-latte/40"
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="font-sans text-sm font-medium text-charcoal dark:text-cream">
          {clampedValue.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="font-sans text-sm text-charcoal/60 dark:text-cream/60">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
