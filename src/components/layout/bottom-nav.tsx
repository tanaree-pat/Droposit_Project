"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Boxes, Home, ScanLine, User, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Floating glass bottom navigation.
 * Layout is role-aware: depositors see Home / Batches / QR / Profile;
 * staff see Dashboard / Scan / Batches / Profile.
 */
type Role = "depositor" | "staff";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  highlight?: boolean;
}

const depositorNav: NavItem[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/batches", label: "Batches", icon: Boxes },
  { href: "/qr", label: "QR", icon: ScanLine, highlight: true },
  { href: "/profile", label: "Profile", icon: User },
];

const staffNav: NavItem[] = [
  { href: "/staff", label: "Dashboard", icon: Home },
  { href: "/staff/scan", label: "Scan", icon: ScanLine, highlight: true },
  { href: "/staff/batches", label: "Batches", icon: ClipboardCheck },
  { href: "/staff/profile", label: "Profile", icon: User },
];

export function BottomNav({ role = "depositor" }: { role?: Role }) {
  const pathname = usePathname() ?? "";
  const nav = role === "staff" ? staffNav : depositorNav;

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 inset-x-0 z-40 mx-auto w-full max-w-[480px] px-4 safe-bottom pointer-events-none"
    >
      <div className="glass-nav pointer-events-auto mb-1 flex items-center justify-around rounded-full px-2 py-2 shadow-floating">
        {nav.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/home" && item.href !== "/staff" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center justify-center min-w-[60px] h-12 px-3 rounded-full text-caption font-medium transition-colors duration-fast",
                item.highlight && !active && "text-primary-400",
                active ? "text-white" : "text-gray-400"
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className={cn(
                    "absolute inset-0 -z-10 rounded-full",
                    item.highlight ? "bg-primary-500 shadow-glow" : "bg-white/[0.08]"
                  )}
                />
              )}
              <Icon size={20} strokeWidth={1.75} />
              <span
                className={cn(
                  "mt-0.5 text-[10px] tracking-wide",
                  active ? "opacity-100" : "opacity-80"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
