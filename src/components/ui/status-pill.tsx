import * as React from "react";
import { cn } from "@/lib/utils";
import type { ItemStatus } from "@/lib/types";

/**
 * Pill that visualizes the three-stage status model.
 *  - pending   → amber (warning) — awaiting drop-off
 *  - deposited → warm tan (secondary) — physically held
 *  - claimed   → emerald (primary) — terminal, successful
 *
 * The "tone" variant lets the same pill sit either on dark surfaces
 * (filled, glowing) or as a soft chip on lighter contexts.
 */
const labels: Record<ItemStatus, string> = {
  pending: "Pending",
  deposited: "Deposited",
  claimed: "Claimed",
};

const palettes: Record<ItemStatus, { solid: string; soft: string }> = {
  pending: {
    solid: "bg-warning text-gray-900 shadow-[0_0_18px_rgba(245,158,11,0.35)]",
    soft: "bg-warning/15 text-warning border border-warning/30",
  },
  deposited: {
    solid: "bg-secondary-400 text-white shadow-[0_0_18px_rgba(182,127,75,0.3)]",
    soft: "bg-secondary-400/15 text-secondary-300 border border-secondary-400/30",
  },
  claimed: {
    solid: "bg-primary-500 text-white shadow-glow",
    soft: "bg-primary-500/15 text-primary-400 border border-primary-500/30",
  },
};

export function StatusPill({
  status,
  tone = "solid",
  size = "md",
  label,
  className,
}: {
  status: ItemStatus;
  tone?: "solid" | "soft";
  size?: "sm" | "md";
  label?: string;
  className?: string;
}) {
  const palette = palettes[status];
  return (
    <span
      role="status"
      aria-label={`Status: ${labels[status]}`}
      className={cn(
        "status-pill",
        size === "sm" && "px-2.5 py-0.5 text-[10px]",
        tone === "solid" ? palette.solid : palette.soft,
        className
      )}
    >
      {label ?? labels[status]}
    </span>
  );
}
