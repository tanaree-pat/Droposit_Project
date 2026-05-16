import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Concatenate Tailwind class strings, resolving conflicting utilities
 * via tailwind-merge. Used by every shadcn-style component.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a Date or timestamp into a short, human-friendly string. */
export function formatRelative(input: Date | string | number): string {
  const date = typeof input === "string" || typeof input === "number" ? new Date(input) : input;
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Bangkok" });
}

/** Stable hash to derive deterministic colors / fallback avatars. */
export function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
