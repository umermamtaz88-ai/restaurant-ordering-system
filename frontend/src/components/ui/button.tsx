import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

const variantStyles = {
  primary:
    "bg-espresso text-warm-white hover:bg-coffee dark:bg-olive dark:hover:bg-olive/90",
  secondary: "bg-olive text-warm-white hover:bg-olive/90",
  outline:
    "border border-espresso/30 bg-transparent text-espresso hover:bg-latte/30 dark:border-latte/40 dark:text-cream dark:hover:bg-espresso/50",
  ghost:
    "bg-transparent text-espresso hover:bg-latte/40 dark:text-cream dark:hover:bg-espresso/50",
  soft:
    "bg-latte/50 text-espresso hover:bg-latte/70 dark:bg-espresso dark:text-cream dark:hover:bg-espresso/80",
} as const;

const sizeStyles = {
  sm: "h-8 gap-1.5 rounded-lg px-3 text-sm",
  md: "h-10 gap-2 rounded-xl px-4 text-sm",
  lg: "h-12 gap-2 rounded-xl px-6 text-base",
} as const;

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = keyof typeof sizeStyles;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  asChild?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center font-sans font-medium transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    );
    const isDisabled = disabled || loading;

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{
        className?: string;
      }>;
      return React.cloneElement(
        child,
        {
          ...props,
          className: cn(classes, child.props.className),
          "aria-disabled": isDisabled ? true : undefined,
          ref,
        } as React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && (
          <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
