"use client";

import { cn } from "@/utils/cn";
import { ORDER_STATUS_FLOW, statusHint, statusStepIndex } from "@/lib/order-status";

export function OrderStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const tone =
    status === "Cancelled"
      ? "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300"
      : status === "Completed" || status === "Delivered"
        ? "bg-olive/15 text-olive"
        : status === "Preparing" || status === "Ready"
          ? "bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
          : "bg-latte/50 text-espresso dark:bg-espresso dark:text-cream";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 font-sans text-xs font-medium",
        tone,
        className,
      )}
    >
      {status}
    </span>
  );
}

export function OrderStatusTimeline({
  status,
  orderType,
}: {
  status: string;
  orderType?: string;
}) {
  const isDelivery = (orderType || "").toLowerCase().includes("delivery");
  const steps = isDelivery
    ? ORDER_STATUS_FLOW.filter((s) => s !== "Completed")
    : ORDER_STATUS_FLOW.filter(
        (s) => s !== "Out for Delivery" && s !== "Delivered",
      );

  const currentIdx = statusStepIndex(status);
  const cancelled = status === "Cancelled";

  return (
    <div className="mt-4">
      <p className="font-sans text-sm text-charcoal/70 dark:text-cream/70">
        {statusHint(status)}
      </p>
      {!cancelled && (
        <ol className="mt-3 flex flex-wrap gap-2">
          {steps.map((step, index) => {
            const done = currentIdx > index || status === step;
            const active = status === step;
            return (
              <li
                key={step}
                className={cn(
                  "rounded-full px-2.5 py-1 font-sans text-[11px] sm:text-xs",
                  active
                    ? "bg-olive text-warm-white"
                    : done
                      ? "bg-olive/20 text-olive"
                      : "bg-latte/40 text-charcoal/50 dark:bg-espresso/60 dark:text-cream/40",
                )}
              >
                {step}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
