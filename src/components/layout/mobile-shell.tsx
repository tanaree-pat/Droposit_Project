import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The mobile shell wraps every authenticated screen. It enforces the
 * 480px max width on desktop, while behaving full-bleed on phones, and
 * provides safe-area padding for iOS notches.
 */
export function MobileShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mobile-shell flex flex-col", className)}>{children}</div>;
}

/** Page body — applies the standardized horizontal page padding (20px). */
export function PageBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "flex-1 flex flex-col px-5 pb-28 gap-6", // bottom pad reserves space for floating nav
        className
      )}
    >
      {children}
    </main>
  );
}
