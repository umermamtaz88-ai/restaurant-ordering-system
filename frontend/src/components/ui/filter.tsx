"use client";

import { cn } from "@/utils/cn";

export interface FilterOption {
  id: string;
  label: string;
  active?: boolean;
}

export interface FilterProps {
  options: FilterOption[];
  onToggle: (id: string) => void;
  className?: string;
  label?: string;
}

/** Chip-style filter group for menu and catalog filters. */
export function Filter({ options, onToggle, className, label }: FilterProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="group" aria-label={label ?? "Filters"}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={option.active}
          onClick={() => onToggle(option.id)}
          className={cn(
            "cursor-pointer rounded-full px-3.5 py-1.5 font-sans text-sm transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive",
            option.active
              ? "bg-olive text-warm-white shadow-soft"
              : "border border-border bg-card text-foreground hover:bg-latte/40 dark:hover:bg-espresso",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
