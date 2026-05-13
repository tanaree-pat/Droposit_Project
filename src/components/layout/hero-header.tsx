import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Hero header used for onboarding, batch creation, and dashboard tops.
 * Soft dark emerald gradient with optional bottom-rounded corners so
 * adjacent content "tucks under" it elegantly.
 */
export function HeroHeader({
  eyebrow,
  title,
  subtitle,
  children,
  rounded = true,
  align = "left",
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  rounded?: boolean;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden px-6 pt-8 pb-10",
        rounded && "rounded-b-[40px]",
        className
      )}
      style={{
        background:
          "linear-gradient(160deg, #14532d 0%, #0f4a2a 45%, #0b3a22 100%)",
      }}
    >
      {/* Subtle ambient glow at the top */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 h-48 w-[140%] -translate-x-1/2 bg-ambient-glow"
        aria-hidden
      />
      <div
        className={cn(
          "relative flex flex-col gap-2",
          align === "center" && "items-center text-center"
        )}
      >
        {eyebrow && (
          <span className="text-caption uppercase tracking-[0.18em] text-primary-200/80">
            {eyebrow}
          </span>
        )}
        {typeof title === "string" ? (
          <h1 className="text-h1 text-white font-display text-balance">{title}</h1>
        ) : (
          title
        )}
        {subtitle && (
          <p className="text-small text-white/70 max-w-[34ch]">{subtitle}</p>
        )}
        {children}
      </div>
    </section>
  );
}
