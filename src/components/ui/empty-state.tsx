import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Illustrated empty state — encourages action over apology.
 * Used wherever a list, search, or batch is empty.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center px-6 py-12 gap-3",
        className
      )}
    >
      {icon && (
        <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.06] text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-h3 text-white">{title}</h3>
      {description && (
        <p className="text-small text-gray-400 max-w-[28ch] text-balance">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
