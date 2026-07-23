"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  offset?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.5,
  offset = 24,
  once = true,
  className,
  ...props
}: ScrollRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  // Start visible so pages don't flash blank while JS/observers warm up
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    // Only animate sections that enter from below the fold
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      setVisible(true);
      return;
    }

    setVisible(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { rootMargin: "0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] ease-out will-change-[opacity,transform]",
        visible ? "translate-y-0 opacity-100" : "opacity-0",
        className,
      )}
      style={{
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
        transform: visible ? undefined : `translateY(${offset}px)`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
