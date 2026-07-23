import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  retry?: React.ReactNode;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  retry,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-red-200/60 bg-red-50/50 px-6 py-12 text-center dark:border-red-900/40 dark:bg-red-950/20",
        className
      )}
      {...props}
    >
      <div
        className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
        aria-hidden="true"
      >
        <AlertCircle className="size-7" />
      </div>
      <h3 className="font-display text-lg font-semibold text-espresso dark:text-cream">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm font-sans text-sm text-charcoal/70 dark:text-cream/70">
          {description}
        </p>
      )}
      {retry && <div className="mt-6">{retry}</div>}
    </div>
  );
}
