"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Package } from "lucide-react";
import { StatusPill } from "@/components/ui/status-pill";
import type { Batch } from "@/lib/types";
import { formatRelative } from "@/lib/utils";

/**
 * Batch card — main building block of every batch list (depositor & staff).
 * Tappable surface with a compact metadata row, item count, and status pill.
 */
export function BatchCard({
  batch,
  href,
  showOwner = false,
}: {
  batch: Batch;
  href: string;
  showOwner?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Link
        href={href}
        className="group block surface-card p-5 pressable hover:bg-gray-850/95 hover:border-white/[0.08]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {showOwner && (
              <p className="text-caption text-gray-400 uppercase tracking-wider mb-1">
                {batch.ownerName}
              </p>
            )}
            <h3 className="text-h3 text-white truncate">{batch.title}</h3>
            <p className="mt-1 text-small text-gray-400 line-clamp-2">
              {batch.description}
            </p>
          </div>
          <span className="text-gray-400 group-hover:text-primary-400 transition-colors">
            <ArrowUpRight size={20} />
          </span>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-caption text-gray-400">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.04]">
              <Package size={13} />
            </span>
            <span>
              {batch.items.length} item{batch.items.length === 1 ? "" : "s"}
            </span>
            <span aria-hidden className="mx-1 text-gray-600">·</span>
            <span>{formatRelative(batch.createdAt)}</span>
          </div>
          <StatusPill status={batch.status} tone="solid" size="sm" />
        </div>
      </Link>
    </motion.div>
  );
}
