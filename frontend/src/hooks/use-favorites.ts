"use client";

import { useCart } from "@/features/cart/use-cart";

export function useFavorites() {
  const { favorites, toggleFavorite, isFavorite } = useCart();

  return { favorites, toggleFavorite, isFavorite };
}
