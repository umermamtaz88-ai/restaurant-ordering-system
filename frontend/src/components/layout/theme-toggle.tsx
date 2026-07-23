"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors",
        "hover:bg-latte/40 dark:hover:bg-espresso/80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive",
        className,
      )}
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-5 text-cream" aria-hidden="true" />
        ) : (
          <Moon className="size-5 text-espresso" aria-hidden="true" />
        )
      ) : (
        <span className="size-5" aria-hidden="true" />
      )}
    </button>
  );
}
