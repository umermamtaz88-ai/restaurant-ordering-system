"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      id: idProp,
      disabled,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const id = idProp ?? generatedId;
    const errorId = error ? `${id}-error` : undefined;

    return (
      <div className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="font-sans text-sm font-medium text-charcoal dark:text-cream"
          >
            {label}
            {required && (
              <span className="ml-0.5 text-espresso" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            "flex min-h-[100px] w-full resize-y rounded-xl border border-latte/40 bg-warm-white px-3 py-2.5 font-sans text-sm text-charcoal shadow-soft transition-colors placeholder:text-charcoal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-latte/20 dark:bg-charcoal dark:text-cream dark:placeholder:text-cream/40",
            error &&
              "border-red-500/60 focus-visible:ring-red-500/40 dark:border-red-400/60",
            className
          )}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            role="alert"
            className="font-sans text-xs text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
