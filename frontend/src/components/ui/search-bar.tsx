"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface SearchBarProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "size"
  > {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  containerClassName?: string;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      containerClassName,
      value: controlledValue,
      defaultValue = "",
      onValueChange,
      onClear,
      placeholder = "Search...",
      id: idProp,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const id = idProp ?? generatedId;
    const [uncontrolledValue, setUncontrolledValue] =
      React.useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;
    const hasValue = value.length > 0;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      onValueChange?.(nextValue);
    };

    const handleClear = () => {
      if (!isControlled) {
        setUncontrolledValue("");
      }
      onValueChange?.("");
      onClear?.();
    };

    return (
      <div className={cn("relative w-full", containerClassName)}>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-charcoal/50 dark:text-cream/50"
          aria-hidden="true"
        />
        <input
          ref={ref}
          id={id}
          type="search"
          role="searchbox"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={placeholder}
          className={cn(
            "flex h-10 w-full rounded-xl border border-latte/40 bg-warm-white py-2 pl-10 pr-10 font-sans text-sm text-charcoal shadow-soft transition-colors placeholder:text-charcoal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-latte/20 dark:bg-charcoal dark:text-cream dark:placeholder:text-cream/40",
            className
          )}
          {...props}
        />
        {hasValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-charcoal/60 transition-colors hover:bg-latte/40 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 dark:text-cream/60 dark:hover:bg-espresso dark:hover:text-cream"
            aria-label="Clear search"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";
