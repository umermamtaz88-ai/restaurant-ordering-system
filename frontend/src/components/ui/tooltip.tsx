"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  delay?: number;
}

const sideStyles = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
} as const;

export function Tooltip({
  content,
  children,
  side = "top",
  className,
  delay = 200,
}: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = React.useId();

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const child = React.Children.only(children) as React.ReactElement<{
    "aria-describedby"?: string;
  }>;

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {React.cloneElement(child, {
        "aria-describedby": visible ? tooltipId : undefined,
      })}
      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-espresso px-2.5 py-1.5 font-sans text-xs text-warm-white shadow-soft dark:bg-charcoal",
            sideStyles[side],
            className
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
