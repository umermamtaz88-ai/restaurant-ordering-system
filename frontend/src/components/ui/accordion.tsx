"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  type?: "single" | "multiple";
  defaultOpen?: string[];
  className?: string;
}

export function Accordion({
  items,
  type = "single",
  defaultOpen = [],
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(
    new Set(defaultOpen)
  );

  const toggleItem = (id: string, disabled?: boolean) => {
    if (disabled) return;

    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (type === "single") {
          next.clear();
        }
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        const panelId = `accordion-panel-${item.id}`;
        const triggerId = `accordion-trigger-${item.id}`;

        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-latte/40 bg-warm-white shadow-soft dark:border-latte/20 dark:bg-charcoal"
          >
            <button
              id={triggerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              disabled={item.disabled}
              onClick={() => toggleItem(item.id, item.disabled)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-base font-semibold text-espresso transition-colors hover:bg-latte/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-olive disabled:cursor-not-allowed disabled:opacity-50 dark:text-cream dark:hover:bg-espresso/50"
            >
              {item.title}
              <ChevronDown
                className={cn(
                  "size-5 shrink-0 text-charcoal/60 transition-transform duration-200 dark:text-cream/60",
                  isOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className={cn(
                "border-t border-latte/40 px-5 dark:border-latte/20",
                isOpen ? "block pb-5 pt-3" : "hidden"
              )}
            >
              <div className="font-sans text-sm leading-relaxed text-charcoal/80 dark:text-cream/80">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
