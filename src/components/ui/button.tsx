"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Tactile, floating button per the Droposit visual language.
 * - Pill radius, generous touch target (>=44px), soft press feedback.
 * - Primary variant carries the emerald glow.
 */
const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-fast ease-smooth active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-500 text-white shadow-glow hover:bg-primary-400 hover:shadow-glow-lg",
        secondary:
          "bg-white/[0.06] text-white border border-white/[0.08] hover:bg-white/[0.1]",
        ghost: "text-gray-300 hover:bg-white/[0.04] hover:text-white",
        outline:
          "border border-white/15 text-white hover:bg-white/[0.04] hover:border-white/25",
        warm: "bg-secondary-500 text-white shadow-soft hover:bg-secondary-400",
        danger: "bg-danger text-white hover:bg-red-500",
      },
      size: {
        sm: "h-10 px-4 text-small",
        md: "h-12 px-6 text-body",
        lg: "h-[52px] px-7 text-body",
        icon: "h-12 w-12 p-0",
        "icon-sm": "h-10 w-10 p-0",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, loading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
