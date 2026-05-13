"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Segmented control — used by the staff batch list (Deposited / Retrieved)
 * and the deposit screen (Deposit / Checkout). Pill rail with an animated
 * indicator that slides between options.
 */
export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
  tone = "warm",
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (next: T) => void;
  className?: string;
  tone?: "warm" | "primary";
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "relative inline-flex items-center rounded-full bg-white/[0.05] border border-white/[0.06] p-1 w-full",
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative z-10 flex-1 h-10 rounded-full text-small font-semibold transition-colors duration-fast",
              active ? "text-white" : "text-gray-400 hover:text-white"
            )}
          >
            {active && (
              <motion.span
                layoutId="segmented-pill"
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
                className={cn(
                  "absolute inset-0 -z-10 rounded-full shadow-soft",
                  tone === "warm" ? "bg-secondary-400" : "bg-primary-500"
                )}
              />
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
