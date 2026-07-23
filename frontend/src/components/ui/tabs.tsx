"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  listClassName?: string;
}

export function Tabs({
  items,
  defaultTab,
  onChange,
  className,
  listClassName,
}: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(
    defaultTab ?? items[0]?.id ?? ""
  );

  const handleTabChange = (tabId: string, disabled?: boolean) => {
    if (disabled) return;
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeItem = items.find((item) => item.id === activeTab);

  return (
    <div className={cn("flex flex-col", className)}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        className={cn(
          "inline-flex flex-wrap gap-1 rounded-xl bg-latte/30 p-1 dark:bg-espresso/50",
          listClassName
        )}
      >
        {items.map((item) => {
          const isActive = item.id === activeTab;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${item.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={item.disabled}
              onClick={() => handleTabChange(item.id, item.disabled)}
              className={cn(
                "rounded-lg px-4 py-2 font-sans text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                isActive
                  ? "bg-warm-white text-espresso shadow-soft dark:bg-charcoal dark:text-cream"
                  : "text-charcoal/70 hover:text-espresso dark:text-cream/70 dark:hover:text-cream"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {activeItem && (
        <div
          role="tabpanel"
          id={`panel-${activeItem.id}`}
          aria-labelledby={`tab-${activeItem.id}`}
          className="mt-4 font-sans text-sm text-charcoal dark:text-cream"
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
}
