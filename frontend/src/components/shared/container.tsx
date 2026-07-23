import * as React from "react";
import { cn } from "@/utils/cn";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "main" | "article";
  size?: "default" | "narrow" | "wide";
}

const sizeStyles = {
  default: "max-w-7xl",
  narrow: "max-w-4xl",
  wide: "max-w-screen-2xl",
} as const;

export function Container({
  as: Component = "div",
  size = "default",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
