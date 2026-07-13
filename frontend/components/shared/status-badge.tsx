import type { OrderStatus, PaymentStatus } from "@/types/api";
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus;
  type?: "order" | "payment";
  className?: string;
}

export function StatusBadge({ status, type = "order", className }: StatusBadgeProps) {
  const colors =
    type === "payment"
      ? PAYMENT_STATUS_COLORS[status as PaymentStatus]
      : ORDER_STATUS_COLORS[status as OrderStatus];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        colors,
        className
      )}
    >
      {status}
    </span>
  );
}
