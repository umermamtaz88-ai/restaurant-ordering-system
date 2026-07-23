import * as React from "react";
import { cn } from "@/utils/cn";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Container } from "@/components/shared/container";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  action,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "border-b border-latte/40 bg-warm-white py-8 dark:border-latte/20 dark:bg-charcoal",
        className
      )}
      {...props}
    >
      <Container>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-4">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-espresso dark:text-cream md:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl font-sans text-base text-charcoal/70 dark:text-cream/70">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      </Container>
    </header>
  );
}
