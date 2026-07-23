"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Clock, Flame, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { MenuItem } from "@/types";
import { useCart } from "@/features/cart/use-cart";
import { formatPrice } from "@/utils/format";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
}

function buildSampleReviews(item: MenuItem): ProductReview[] {
  const baseRating = Math.round(item.rating);
  return [
    {
      id: "r1",
      author: "Elena M.",
      rating: baseRating,
      date: "2026-05-12",
      text: `Absolutely love the ${item.name}. The flavor profile is exactly what I hoped for — balanced, rich, and worth every visit.`,
    },
    {
      id: "r2",
      author: "James O.",
      rating: Math.max(4, baseRating - 1),
      date: "2026-04-28",
      text: "Consistent quality every time. The team clearly takes pride in what they serve. Already recommended to friends.",
    },
    {
      id: "r3",
      author: "Sophie L.",
      rating: baseRating,
      date: "2026-03-15",
      text: "One of my regular orders at Solenne. Perfect portion, beautiful presentation, and always arrives at the right temperature.",
    },
  ];
}

export interface ProductDetailsProps {
  item: MenuItem;
}

export function ProductDetails({ item }: ProductDetailsProps) {
  const { addItem } = useCart();
  const images = item.images?.length ? item.images : [item.image];
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const reviews = buildSampleReviews(item);

  const handleAddToCart = () => {
    addItem(item, quantity);
    toast.success(`${quantity}× ${item.name} added to cart`);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-latte/20 shadow-lift">
          <Image
            src={images[activeImage] ?? item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {item.discount ? (
            <Badge variant="discount" className="absolute left-4 top-4">
              −{item.discount}%
            </Badge>
          ) : null}
        </div>
        {images.length > 1 ? (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                aria-label={`View image ${index + 1}`}
                aria-pressed={activeImage === index}
                onClick={() => setActiveImage(index)}
                className={cn(
                  "relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-colors",
                  activeImage === index
                    ? "border-olive"
                    : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex flex-wrap gap-2">
            {item.isBestSeller ? <Badge variant="olive">Best seller</Badge> : null}
            {item.isSeasonal ? <Badge variant="cream">Seasonal</Badge> : null}
            {item.isVegetarian ? <Badge variant="default">Vegetarian</Badge> : null}
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold text-espresso dark:text-cream md:text-4xl">
            {item.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Rating value={item.rating} count={item.reviewCount} size="md" />
            <span className="inline-flex items-center gap-1.5 font-sans text-sm text-charcoal/70 dark:text-cream/70">
              <Clock className="size-4" /> {item.prepTime} min prep
            </span>
            <span className="inline-flex items-center gap-1.5 font-sans text-sm text-charcoal/70 dark:text-cream/70">
              <Flame className="size-4" /> {item.calories} kcal
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="font-display text-3xl text-espresso dark:text-cream">
            {formatPrice(item.price)}
          </span>
          {item.originalPrice ? (
            <span className="font-sans text-lg text-charcoal/50 line-through dark:text-cream/50">
              {formatPrice(item.originalPrice)}
            </span>
          ) : null}
        </div>

        <p className="font-sans text-base leading-relaxed text-charcoal/80 dark:text-cream/80">
          {item.longDescription ?? item.description}
        </p>

        <div>
          <h2 className="font-display text-lg text-espresso dark:text-cream">
            Ingredients
          </h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {item.ingredients.map((ingredient) => (
              <li
                key={ingredient}
                className="rounded-full bg-latte/40 px-3 py-1 font-sans text-xs text-espresso dark:bg-espresso dark:text-cream"
              >
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-3xl border border-latte/40 dark:border-latte/20">
          <h2 className="border-b border-latte/40 bg-cream/40 px-5 py-3 font-display text-lg text-espresso dark:border-latte/20 dark:bg-espresso/40 dark:text-cream">
            Nutrition Facts
          </h2>
          <table className="w-full font-sans text-sm">
            <tbody>
              {(
                [
                  ["Calories", `${item.nutrition.calories} kcal`],
                  ["Protein", `${item.nutrition.protein}g`],
                  ["Carbs", `${item.nutrition.carbs}g`],
                  ["Fat", `${item.nutrition.fat}g`],
                  ...(item.nutrition.sugar !== undefined
                    ? [["Sugar", `${item.nutrition.sugar}g`] as const]
                    : []),
                  ...(item.nutrition.fiber !== undefined
                    ? [["Fiber", `${item.nutrition.fiber}g`] as const]
                    : []),
                ] as const
              ).map(([label, value]) => (
                <tr
                  key={label}
                  className="border-b border-latte/30 last:border-0 dark:border-latte/15"
                >
                  <td className="px-5 py-3 text-charcoal/70 dark:text-cream/70">
                    {label}
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-espresso dark:text-cream">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center rounded-2xl border border-latte/40 bg-warm-white dark:border-latte/20 dark:bg-charcoal">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="rounded-l-2xl p-3 text-charcoal transition-colors hover:bg-latte/40 dark:text-cream dark:hover:bg-espresso"
            >
              <Minus className="size-4" />
            </button>
            <span className="min-w-10 text-center font-sans text-sm font-medium text-espresso dark:text-cream">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => q + 1)}
              className="rounded-r-2xl p-3 text-charcoal transition-colors hover:bg-latte/40 dark:text-cream dark:hover:bg-espresso"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 rounded-2xl sm:flex-none sm:px-10"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="size-4" />
            Add to cart
          </Button>
        </div>

        <section className="border-t border-latte/40 pt-8 dark:border-latte/20">
          <h2 className="font-display text-xl text-espresso dark:text-cream">
            Guest Reviews
          </h2>
          <div className="mt-4 space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-3xl border border-latte/40 bg-cream/20 p-5 dark:border-latte/20 dark:bg-espresso/20"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-sans text-sm font-medium text-espresso dark:text-cream">
                    {review.author}
                  </p>
                  <time
                    dateTime={review.date}
                    className="font-sans text-xs text-charcoal/50 dark:text-cream/50"
                  >
                    {new Date(review.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <Rating
                  value={review.rating}
                  showValue={false}
                  size="sm"
                  className="mt-2"
                />
                <p className="mt-2 font-sans text-sm leading-relaxed text-charcoal/70 dark:text-cream/70">
                  {review.text}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
