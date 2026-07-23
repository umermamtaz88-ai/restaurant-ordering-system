import * as React from "react";
import { cn } from "@/utils/cn";

export interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  ...props
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" && "items-center text-center",
        className
      )}
      {...props}
    >
      {eyebrow && (
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-olive">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-espresso dark:text-cream md:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl font-sans text-base text-charcoal/70 dark:text-cream/70",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
