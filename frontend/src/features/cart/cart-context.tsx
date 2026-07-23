"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getMenuItemById } from "@/data/menu";
import type { CartItem, MenuItem } from "@/types";

const CART_STORAGE_KEY = "solenne-cart";
const FAVORITES_STORAGE_KEY = "solenne-favorites";

type StoredCartItem = {
  productId: string;
  quantity: number;
  notes?: string;
};

interface CartContextValue {
  items: CartItem[];
  favorites: string[];
  addItem: (product: MenuItem, quantity?: number, notes?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const items: CartItem[] = [];

    for (const entry of parsed) {
      if (
        typeof entry !== "object" ||
        entry === null ||
        !("productId" in entry) ||
        typeof (entry as StoredCartItem).productId !== "string" ||
        !("quantity" in entry) ||
        typeof (entry as StoredCartItem).quantity !== "number"
      ) {
        continue;
      }

      const stored = entry as StoredCartItem;
      const product = getMenuItemById(stored.productId);
      if (!product) continue;

      const cartItem: CartItem = {
        product,
        quantity: Math.max(1, stored.quantity),
      };

      if (stored.notes) {
        cartItem.notes = stored.notes;
      }

      items.push(cartItem);
    }

    return items;
  } catch {
    return [];
  }
}

function parseStoredFavorites(raw: string | null): string[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

function serializeCart(items: CartItem[]): StoredCartItem[] {
  return items.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
    notes: item.notes,
  }));
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(parseStoredCart(localStorage.getItem(CART_STORAGE_KEY)));
    setFavorites(parseStoredFavorites(localStorage.getItem(FAVORITES_STORAGE_KEY)));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serializeCart(items)));
  }, [items, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites, mounted]);

  const addItem = useCallback(
    (product: MenuItem, quantity = 1, notes?: string) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  notes: notes ?? item.notes,
                }
              : item,
          );
        }
        return [...prev, { product, quantity, notes }];
      });
    },
    [],
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      favorites,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleFavorite,
      isFavorite,
      subtotal,
      itemCount,
    }),
    [
      items,
      favorites,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleFavorite,
      isFavorite,
      subtotal,
      itemCount,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
