"use client";

import { CartProvider } from "@/features/cart/cart-context";
import { AuthProvider } from "@/features/auth/auth-context";
import { ThemeProvider } from "@/lib/theme-provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className:
                "font-sans !bg-card !text-foreground !border-border !shadow-lift",
            }}
          />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
