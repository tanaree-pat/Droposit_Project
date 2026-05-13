"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Bell, QrCode, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Top bar — transparent overlay on top of the hero gradient.
 * Composable: configure back button, title, and trailing actions per page.
 */
export function TopBar({
  title,
  back,
  rightAction,
  className,
  variant = "transparent",
}: {
  title?: string;
  back?: boolean | { href: string };
  rightAction?: React.ReactNode;
  className?: string;
  variant?: "transparent" | "solid";
}) {
  const router = useRouter();
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between px-5 py-3 safe-top",
        variant === "solid"
          ? "bg-gray-950/85 backdrop-blur-glass border-b border-white/[0.05]"
          : "bg-transparent",
        className
      )}
    >
      <div className="flex items-center gap-2 min-w-[44px]">
        {back ? (
          typeof back === "object" ? (
            <Link
              href={back.href}
              aria-label="Back"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.06] text-white hover:bg-white/[0.1] transition pressable"
            >
              <ChevronLeft size={20} />
            </Link>
          ) : (
            <button
              type="button"
              aria-label="Back"
              onClick={() => router.back()}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.06] text-white hover:bg-white/[0.1] transition pressable"
            >
              <ChevronLeft size={20} />
            </button>
          )
        ) : (
          <button
            type="button"
            aria-label="Menu"
            className="inline-flex h-11 w-11 items-center justify-center text-white"
          >
            <MoreHorizontal size={22} />
          </button>
        )}
      </div>
      {title && (
        <h1 className="absolute left-1/2 -translate-x-1/2 text-body font-semibold text-white truncate max-w-[60%]">
          {title}
        </h1>
      )}
      <div className="flex items-center gap-2 min-w-[44px] justify-end">
        {rightAction ?? <DefaultTopBarActions />}
      </div>
    </header>
  );
}

function DefaultTopBarActions() {
  return (
    <>
      <Link
        href="/notifications"
        aria-label="Notifications"
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.06] text-white hover:bg-white/[0.1] transition pressable"
      >
        <Bell size={18} />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary-400 shadow-glow" />
      </Link>
      <Link
        href="/qr"
        aria-label="My QR code"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-500 text-white shadow-glow hover:bg-primary-400 transition pressable"
      >
        <QrCode size={18} />
      </Link>
    </>
  );
}
