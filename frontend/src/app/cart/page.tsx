"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { OrderSummary } from "@/components/shared/order-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { calculateOrderTotals } from "@/features/cart/calculate-totals";
import { useCart } from "@/features/cart/use-cart";
import { ROUTES } from "@/constants/site";
import { formatPrice } from "@/utils/format";
import { cn } from "@/utils/cn";

const VALID_COUPON = "SOLENNE10";
const COUPON_DISCOUNT = 10;

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const totals = calculateOrderTotals(subtotal, {
    discountPercent: appliedDiscount,
    includeDelivery: true,
  });

  const handleApplyCoupon = () => {
    const normalized = couponCode.trim().toUpperCase();
    if (normalized === VALID_COUPON) {
      setAppliedDiscount(COUPON_DISCOUNT);
      toast.success("Coupon applied — 10% off your order");
      return;
    }
    toast.error("Invalid coupon code");
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedDiscount(0);
    toast.message("Coupon removed");
  };

  return (
    <>
      <PageHeader
        title="Your Cart"
        description="Review your selections before checkout."
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Cart" },
        ]}
      />

      <Container className="py-10 sm:py-14">
        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="size-7" />}
            title="Your cart is empty"
            description="Explore our menu and add something delicious to get started."
            action={
              <Button asChild variant="secondary" className="rounded-2xl">
                <Link href={ROUTES.menu}>Browse menu</Link>
              </Button>
            }
            className="rounded-3xl"
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.product.id}
                  className="flex gap-4 rounded-3xl border border-latte/40 bg-card p-4 shadow-soft dark:border-latte/20 sm:gap-5 sm:p-5"
                >
                  <Link
                    href={`/menu/${item.product.slug}`}
                    className="relative size-24 shrink-0 overflow-hidden rounded-2xl sm:size-28"
                  >
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="112px"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/menu/${item.product.slug}`}
                          className="font-display text-lg font-semibold text-espresso transition-colors hover:text-olive dark:text-cream"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-1 font-sans text-sm text-charcoal/60 dark:text-cream/60">
                          {formatPrice(item.product.price)} each
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          removeItem(item.product.id);
                          toast.message(`${item.product.name} removed`);
                        }}
                        className="rounded-xl p-2 text-charcoal/50 transition-colors hover:bg-latte/30 hover:text-red-600 dark:text-cream/50 dark:hover:bg-espresso dark:hover:text-red-400"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="inline-flex items-center rounded-2xl border border-latte/40 bg-warm-white dark:border-latte/20 dark:bg-charcoal">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="rounded-l-2xl p-2.5 text-charcoal transition-colors hover:bg-latte/40 dark:text-cream dark:hover:bg-espresso"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="min-w-8 text-center font-sans text-sm font-medium text-espresso dark:text-cream">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="rounded-r-2xl p-2.5 text-charcoal transition-colors hover:bg-latte/40 dark:text-cream dark:hover:bg-espresso"
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                      <p className="font-display text-lg font-semibold text-espresso dark:text-cream">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}

              <div className="rounded-3xl border border-latte/40 bg-card p-5 shadow-soft dark:border-latte/20">
                <div className="flex items-center gap-2">
                  <Tag className="size-4 text-olive" />
                  <h3 className="font-display text-base font-semibold text-espresso dark:text-cream">
                    Promo code
                  </h3>
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Input
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    disabled={appliedDiscount > 0}
                    containerClassName="flex-1"
                  />
                  {appliedDiscount > 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-2xl"
                      onClick={handleRemoveCoupon}
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      className="rounded-2xl"
                      onClick={handleApplyCoupon}
                    >
                      Apply
                    </Button>
                  )}
                </div>
                {appliedDiscount > 0 && (
                  <p className="mt-2 font-sans text-xs text-olive">
                    {VALID_COUPON} applied — {COUPON_DISCOUNT}% off
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4 lg:sticky lg:top-24">
              <OrderSummary totals={totals} showDeliveryNote />
              <Button
                asChild
                variant="secondary"
                size="lg"
                className={cn("w-full rounded-2xl")}
              >
                <Link href={ROUTES.checkout}>Proceed to checkout</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full rounded-2xl">
                <Link href={ROUTES.menu}>Continue shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
