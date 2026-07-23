import { formatPrice } from "@/utils/format";
import type { OrderTotals } from "@/features/cart/calculate-totals";
import { cn } from "@/utils/cn";

interface OrderSummaryProps {
  totals: OrderTotals;
  className?: string;
  showDeliveryNote?: boolean;
}

export function OrderSummary({
  totals,
  className,
  showDeliveryNote = false,
}: OrderSummaryProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-latte/40 bg-card p-6 shadow-soft dark:border-latte/20",
        className,
      )}
    >
      <h2 className="font-display text-lg font-semibold text-espresso dark:text-cream">
        Order Summary
      </h2>
      <dl className="mt-4 space-y-3 font-sans text-sm">
        <div className="flex justify-between text-charcoal/80 dark:text-cream/80">
          <dt>Subtotal</dt>
          <dd>{formatPrice(totals.subtotal)}</dd>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-olive">
            <dt>Discount</dt>
            <dd>-{formatPrice(totals.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between text-charcoal/80 dark:text-cream/80">
          <dt>Tax</dt>
          <dd>{formatPrice(totals.tax)}</dd>
        </div>
        <div className="flex justify-between text-charcoal/80 dark:text-cream/80">
          <dt>Delivery</dt>
          <dd>
            {totals.deliveryFee === 0 ? (
              <span className="text-olive">Free</span>
            ) : (
              formatPrice(totals.deliveryFee)
            )}
          </dd>
        </div>
        {showDeliveryNote && totals.deliveryFee === 0 && (
          <p className="text-xs text-charcoal/60 dark:text-cream/60">
            Free delivery applied on orders over the threshold.
          </p>
        )}
        <div className="border-t border-latte/40 pt-3 dark:border-latte/20">
          <div className="flex justify-between font-display text-lg font-semibold text-espresso dark:text-cream">
            <dt>Total</dt>
            <dd>{formatPrice(totals.total)}</dd>
          </div>
        </div>
      </dl>
    </div>
  );
}
