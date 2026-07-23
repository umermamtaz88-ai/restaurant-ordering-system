"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  showCloseButton?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  overlayClassName,
  showCloseButton = true,
}: ModalProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();

  React.useEffect(() => {
    if (!open) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;

    const focusableElements = dialog?.querySelectorAll<HTMLElement>(
      FOCUSABLE_SELECTOR
    );
    const firstFocusable = focusableElements?.[0];
    const lastFocusable = focusableElements?.[focusableElements.length - 1];

    firstFocusable?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      if (focusableElements && focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable?.focus();
        }
      } else if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={cn(
          "absolute inset-0 bg-espresso/40 backdrop-blur-sm dark:bg-charcoal/70",
          overlayClassName
        )}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "relative z-10 w-full max-w-lg rounded-2xl bg-warm-white p-6 shadow-soft dark:bg-charcoal",
          className
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2
              id={titleId}
              className="font-display text-xl font-semibold text-espresso dark:text-cream"
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
              aria-label="Close dialog"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
