"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { StatusPill } from "@/components/ui/status-pill";
import type { Item } from "@/lib/types";

/**
 * Item card — represents one item inside a batch. Square thumbnail on
 * the left, content on the right; the entire card is the tap target.
 */
export function ItemCard({ item, href }: { item: Item; href: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Link
        href={href}
        className="group flex gap-4 surface-card p-4 pressable hover:bg-gray-850/95 hover:border-white/[0.08]"
      >
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-800">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-caption text-gray-500">
              No image
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-body font-semibold text-white line-clamp-2">{item.title}</h4>
            <StatusPill status={item.status} tone="soft" size="sm" />
          </div>
          <p className="mt-1 text-small text-gray-400 line-clamp-2">{item.description}</p>
        </div>
      </Link>
    </motion.div>
  );
}
