"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { MenuItem, ViewMode } from "@/types";
import { useCart } from "@/features/cart/use-cart";
import { formatPrice } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";

export interface ProductCardProps {
  item: MenuItem;
  view?: ViewMode;
  className?: string;
  priority?: boolean;
}

export function ProductCard({
  item,
  view = "grid",
  className,
  priority = false,
}: ProductCardProps) {
  const { addItem, toggleFavorite, isFavorite } = useCart();
  const favorited = isFavorite(item.id);

  const handleAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addItem(item, 1);
    toast.success(`${item.name} added to cart`);
  };

  const handleFavorite = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(item.id);
    toast.message(favorited ? "Removed from favorites" : "Saved to favorites");
  };

  if (view === "list") {
    return (
      <article
        className={cn(
          "group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift sm:flex-row",
          className,
        )}
      >
        <Link
          href={`/menu/${item.slug}`}
          className="relative aspect-[4/3] w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-48 md:w-56"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            quality={70}
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 224px"
          />
        </Link>
        <div className="flex flex-1 flex-col justify-between gap-4 p-5">
          <div>
            <div className="flex flex-wrap gap-2">
              {item.isBestSeller && <Badge variant="olive">Best seller</Badge>}
              {item.discount ? (
                <Badge variant="discount">−{item.discount}%</Badge>
              ) : null}
              {item.isVegetarian && <Badge>Vegetarian</Badge>}
            </div>
            <Link href={`/menu/${item.slug}`}>
              <h3 className="mt-2 font-display text-xl text-espresso dark:text-cream">
                {item.name}
              </h3>
            </Link>
            <p className="mt-1 line-clamp-2 font-sans text-sm text-charcoal/70 dark:text-cream/70">
              {item.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Rating value={item.rating} count={item.reviewCount} size="sm" />
              <span className="font-sans text-xs text-charcoal/60 dark:text-cream/60">
                {item.prepTime} min · {item.calories} kcal
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl text-olive">
                {formatPrice(item.price)}
              </span>
              {item.originalPrice ? (
                <span className="font-sans text-sm text-charcoal/50 line-through dark:text-cream/50">
                  {formatPrice(item.originalPrice)}
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Tooltip content={favorited ? "Unfavorite" : "Favorite"}>
                <button
                  type="button"
                  onClick={handleFavorite}
                  aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                  aria-pressed={favorited}
                  className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border transition-colors hover:bg-latte/40 dark:hover:bg-espresso"
                >
                  <Heart
                    className={cn("size-4", favorited && "fill-olive text-olive")}
                  />
                </button>
              </Tooltip>
              <Button size="sm" className="rounded-full" onClick={handleAdd}>
                <ShoppingBag className="size-4" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <Link href={`/menu/${item.slug}`} className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          quality={70}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {item.discount ? (
            <Badge variant="discount">−{item.discount}%</Badge>
          ) : null}
          {item.isBestSeller ? <Badge variant="olive">Best seller</Badge> : null}
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100">
          <Tooltip content={favorited ? "Unfavorite" : "Favorite"}>
            <button
              type="button"
              onClick={handleFavorite}
              aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={favorited}
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full bg-warm-white/95 text-espresso shadow-soft backdrop-blur-sm transition hover:scale-105"
            >
              <Heart className={cn("size-4", favorited && "fill-olive text-olive")} />
            </button>
          </Tooltip>
          <Tooltip content="Quick view">
            <Link
              href={`/menu/${item.slug}`}
              aria-label={`Quick view ${item.name}`}
              className="inline-flex size-9 items-center justify-center rounded-full bg-warm-white/95 text-espresso shadow-soft backdrop-blur-sm transition hover:scale-105"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="size-4" />
            </Link>
          </Tooltip>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/menu/${item.slug}`}>
          <h3 className="font-display text-lg text-espresso transition-colors group-hover:text-olive dark:text-cream dark:group-hover:text-olive-muted">
            {item.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 flex-1 font-sans text-sm text-charcoal/70 dark:text-cream/70">
          {item.description}
        </p>
        <div className="mt-3">
          <Rating value={item.rating} count={item.reviewCount} size="sm" />
        </div>
        <p className="mt-2 font-sans text-xs text-charcoal/55 dark:text-cream/55">
          {item.prepTime} min · {item.calories} kcal
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl text-olive">{formatPrice(item.price)}</span>
            {item.originalPrice ? (
              <span className="font-sans text-xs text-charcoal/50 line-through dark:text-cream/50">
                {formatPrice(item.originalPrice)}
              </span>
            ) : null}
          </div>
          <Button
            size="sm"
            variant="soft"
            className="rounded-full"
            onClick={handleAdd}
            aria-label={`Add ${item.name} to cart`}
          >
            <ShoppingBag className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}

/** Alias for product listing surfaces that expect MenuCard naming. */
export const MenuCard = ProductCard;
