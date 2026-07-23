"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export interface DropdownItem {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect?: (value: string) => void;
  align?: "start" | "end";
  className?: string;
  menuClassName?: string;
  "aria-label"?: string;
}

export function Dropdown({
  trigger,
  items,
  onSelect,
  align = "start",
  className,
  menuClassName,
  "aria-label": ariaLabel = "Open menu",
}: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const menuId = React.useId();

  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleSelect = (value: string, disabled?: boolean) => {
    if (disabled) return;
    onSelect?.(value);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2"
      >
        {trigger}
        <ChevronDown
          className={cn(
            "size-4 text-charcoal/60 transition-transform dark:text-cream/60",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <ul
          id={menuId}
          role="menu"
          className={cn(
            "absolute top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-latte/40 bg-warm-white py-1 shadow-soft dark:border-latte/20 dark:bg-charcoal",
            align === "end" ? "right-0" : "left-0",
            menuClassName
          )}
        >
          {items.map((item) => (
            <li key={item.value} role="none">
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => handleSelect(item.value, item.disabled)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left font-sans text-sm text-charcoal transition-colors hover:bg-latte/40 focus-visible:bg-latte/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-cream dark:hover:bg-espresso dark:focus-visible:bg-espresso"
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
