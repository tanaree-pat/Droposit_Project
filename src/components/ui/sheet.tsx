"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bottom sheet modal — appears from the bottom on mobile,
 * centered on tablet+. Radius matches the design system (40px top).
 */
export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 32, stiffness: 320 }}
                className={cn(
                  "fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[480px]",
                  "rounded-t-[40px] bg-gray-900 border-t border-x border-white/[0.06]",
                  "shadow-floating p-6 pb-8 safe-bottom",
                  className
                )}
              >
                <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/15" />
                {(title || description) && (
                  <header className="mb-4 text-left">
                    {title && (
                      <Dialog.Title className="text-h3 text-white">{title}</Dialog.Title>
                    )}
                    {description && (
                      <Dialog.Description className="mt-1 text-small text-gray-400">
                        {description}
                      </Dialog.Description>
                    )}
                  </header>
                )}
                <Dialog.Close
                  aria-label="Close"
                  className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-gray-300 hover:bg-white/[0.1] hover:text-white transition"
                >
                  <X size={18} />
                </Dialog.Close>
                {children}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
