import { cn } from "@/lib/utils";

/**
 * Skeleton loader — shimmer animation over a soft surface tone.
 * Preferred over spinners for content-heavy screens.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden />;
}
