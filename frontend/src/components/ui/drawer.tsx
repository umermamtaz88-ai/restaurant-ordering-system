"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  side?: "right" | "left";
  className?: string;
  showCloseButton?: boolean;
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  side = "right",
  className,
  showCloseButton = true,
}: DrawerProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();

  React.useEffect(() => {
    if (!open) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;

    const focusableElements = panel?.querySelectorAll<HTMLElement>(
      FOCUSABLE_SELECTOR
    );
    const firstFocusable = focusableElements?.[0];

    firstFocusable?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-espresso/40 backdrop-blur-sm transition-opacity duration-300 dark:bg-charcoal/70",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        aria-hidden={!open}
        className={cn(
          "fixed top-0 z-50 flex h-full w-full max-w-sm flex-col bg-warm-white shadow-soft transition-transform duration-300 ease-out dark:bg-charcoal",
          side === "right" ? "right-0" : "left-0",
          side === "right"
            ? open
              ? "translate-x-0"
              : "translate-x-full"
            : open
              ? "translate-x-0"
              : "-translate-x-full",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-latte/40 p-5 dark:border-latte/20">
          <div>
            <h2
              id={titleId}
              className="font-display text-lg font-semibold text-espresso dark:text-cream"
            >
              {title}
            </h2>
            {description && (
              <p
                id={descriptionId}
                className="mt-1 font-sans text-sm text-charcoal/70 dark:text-cream/70"
              >
                {description}
              </p>
            )}
          </div>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-charcoal/60 transition-colors hover:bg-latte/40 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 dark:text-cream/60 dark:hover:bg-espresso dark:hover:text-cream"
              aria-label="Close drawer"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </>
  );
}
