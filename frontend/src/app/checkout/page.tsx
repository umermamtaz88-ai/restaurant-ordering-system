"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Banknote,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
  Wallet,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { OrderSummary } from "@/components/shared/order-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { calculateOrderTotals } from "@/features/cart/calculate-totals";
import { useCart } from "@/features/cart/use-cart";
import { useAuth } from "@/features/auth/auth-context";
import { RequireAuth } from "@/features/auth/require-auth";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/lib/validations";
import { ApiError } from "@/services/api";
import { orderService } from "@/services/order.service";
import { ROUTES } from "@/constants/site";
import { formatPrice } from "@/utils/format";
import { cn } from "@/utils/cn";

const PAYMENT_OPTIONS = [
  { value: "card" as const, label: "Card", icon: CreditCard, hint: "Visa, Mastercard" },
  { value: "cash" as const, label: "Cash", icon: Banknote, hint: "Pay on pickup" },
  { value: "wallet" as const, label: "Wallet", icon: Wallet, hint: "Apple / Google Pay" },
];

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <CheckoutForm />
    </RequireAuth>
  );
}

function CheckoutForm() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const [discountPercent] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryType: "delivery",
      address: "",
      city: "",
      zipCode: "",
      paymentMethod: "card",
      notes: "",
    },
  });

  const deliveryType = watch("deliveryType");
  const paymentMethod = watch("paymentMethod");

  const totals = useMemo(
    () =>
      calculateOrderTotals(subtotal, {
        discountPercent,
        includeDelivery: deliveryType === "delivery",
      }),
    [subtotal, discountPercent, deliveryType],
  );

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to place an order.");
      router.push(`${ROUTES.login}?next=${encodeURIComponent(ROUTES.checkout)}`);
      return;
    }

    try {
      const response = await orderService.checkout({
        delivery_type: data.deliveryType,
        payment_method: data.paymentMethod,
        items: items.map((item) => ({
          product_id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          unit_price: item.product.price,
        })),
        notes: data.notes || undefined,
        address: data.deliveryType === "delivery" ? data.address : undefined,
        city: data.deliveryType === "delivery" ? data.city : undefined,
        zip_code: data.deliveryType === "delivery" ? data.zipCode : undefined,
      });

      const orderNumber = response.data?.order_number;
      toast.success(
        orderNumber
          ? `Order ${orderNumber} placed successfully!`
          : "Order placed successfully!",
      );
      clearCart();
      router.push(ROUTES.profile);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Could not place order. Please try again.";
      toast.error(message);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <PageHeader
          title="Checkout"
          description="Complete your order details."
          breadcrumbs={[
            { label: "Home", href: ROUTES.home },
            { label: "Cart", href: ROUTES.cart },
            { label: "Checkout" },
          ]}
        />
        <Container className="py-10 sm:py-14">
          <EmptyState
            icon={<ShoppingBag className="size-7" />}
            title="Nothing to checkout"
            description="Your cart is empty. Add items from the menu first."
            action={
              <Button asChild variant="secondary" className="rounded-2xl">
                <Link href={ROUTES.menu}>Browse menu</Link>
              </Button>
            }
            className="rounded-3xl"
          />
        </Container>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Checkout"
        description="Choose delivery, payment, and any special notes."
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Cart", href: ROUTES.cart },
          { label: "Checkout" },
        ]}
      />

      <Container className="py-10 sm:py-14">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start"
          noValidate
        >
          <div className="space-y-6">
            <section className="rounded-3xl border border-latte/40 bg-card p-6 shadow-soft dark:border-latte/20">
              <h2 className="font-display text-lg font-semibold text-espresso dark:text-cream">
                Delivery type
              </h2>
              <Controller
                name="deliveryType"
                control={control}
                render={({ field }) => (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {(
                      [
                        { value: "delivery" as const, label: "Delivery", icon: Truck },
                        { value: "pickup" as const, label: "Pickup", icon: Package },
                      ] as const
                    ).map((option) => {
                      const Icon = option.icon;
                      const selected = field.value === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all",
                            selected
                              ? "border-olive bg-olive/10 text-espresso shadow-soft dark:text-cream"
                              : "border-latte/40 bg-warm-white text-charcoal/70 hover:border-olive/40 dark:border-latte/20 dark:bg-charcoal dark:text-cream/70",
                          )}
                        >
                          <Icon className="size-5" />
                          <span className="font-sans text-sm font-medium">
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </section>

            {deliveryType === "delivery" && (
              <section className="space-y-4 rounded-3xl border border-latte/40 bg-card p-6 shadow-soft dark:border-latte/20">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-olive" />
                  <h2 className="font-display text-lg font-semibold text-espresso dark:text-cream">
                    Delivery address
                  </h2>
                </div>
                <Input
                  label="Street address"
                  placeholder="142 Maple Street, Apt 2B"
                  error={errors.address?.message}
                  required
                  {...register("address")}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="City"
                    placeholder="Brooklyn"
                    error={errors.city?.message}
                    required
                    {...register("city")}
                  />
                  <Input
                    label="Zip code"
                    placeholder="11201"
                    error={errors.zipCode?.message}
                    required
                    {...register("zipCode")}
                  />
                </div>
              </section>
            )}

            <section className="rounded-3xl border border-latte/40 bg-card p-6 shadow-soft dark:border-latte/20">
              <h2 className="font-display text-lg font-semibold text-espresso dark:text-cream">
                Payment method
              </h2>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {PAYMENT_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      const selected = paymentMethod === option.value;
                      return (
                        <label
                          key={option.value}
                          className={cn(
                            "flex cursor-pointer flex-col gap-2 rounded-2xl border p-4 transition-all",
                            selected
                              ? "border-olive bg-olive/10 shadow-soft"
                              : "border-latte/40 bg-warm-white hover:border-olive/40 dark:border-latte/20 dark:bg-charcoal",
                          )}
                        >
                          <input
                            type="radio"
                            className="sr-only"
                            value={option.value}
                            checked={field.value === option.value}
                            onChange={() => field.onChange(option.value)}
                          />
                          <Icon
                            className={cn(
                              "size-5",
                              selected ? "text-olive" : "text-charcoal/60 dark:text-cream/60",
                            )}
                          />
                          <span className="font-sans text-sm font-medium text-espresso dark:text-cream">
                            {option.label}
                          </span>
                          <span className="font-sans text-xs text-charcoal/60 dark:text-cream/60">
                            {option.hint}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              />
            </section>

            <section className="rounded-3xl border border-latte/40 bg-card p-6 shadow-soft dark:border-latte/20">
              <Textarea
                label="Order notes"
                placeholder="Allergies, delivery instructions, or pickup name..."
                rows={3}
                error={errors.notes?.message}
                {...register("notes")}
              />
            </section>

            <section className="rounded-3xl border border-latte/40 bg-card p-6 shadow-soft dark:border-latte/20">
              <h2 className="font-display text-lg font-semibold text-espresso dark:text-cream">
                Items ({items.length})
              </h2>
              <ul className="mt-4 space-y-3">
                {items.map((item) => (
                  <li
                    key={item.product.id}
                    className="flex items-center gap-3 font-sans text-sm"
                  >
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-espresso dark:text-cream">
                        {item.product.name}
                      </p>
                      <p className="text-charcoal/60 dark:text-cream/60">
                        Qty {item.quantity}
                      </p>
                    </div>
                    <span className="shrink-0 font-medium text-espresso dark:text-cream">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="space-y-4 lg:sticky lg:top-24">
            <OrderSummary totals={totals} showDeliveryNote />
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              loading={isSubmitting}
              className="w-full rounded-2xl"
            >
              Place order
            </Button>
            <Button asChild variant="ghost" className="w-full rounded-2xl">
              <Link href={ROUTES.cart}>Back to cart</Link>
            </Button>
          </div>
        </form>
      </Container>
    </>
  );
}
