import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Edit3, QrCode } from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { batches } from "@/lib/mock-data";
import type { ItemStatus } from "@/lib/types";

/**
 * Item status detail — the canonical "My Item Status" screen.
 * Shows a hero status pill, photo, title and description.
 * Subhead copy adapts to the current status (CTA-on-status pattern).
 */
const statusCopy: Record<ItemStatus, { headline: string; sub: string; cta?: string }> = {
  pending: {
    headline: "Pending",
    sub: "Waiting for deposit — access QR code to deposit",
    cta: "Show QR to deposit",
  },
  deposited: {
    headline: "Deposited",
    sub: "Currently deposited — access QR code to claim",
    cta: "Show QR to claim",
  },
  claimed: {
    headline: "Claimed",
    sub: "Item has already been claimed",
  },
};

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string; itemId: string }>;
}) {
  const { id, itemId } = await params;
  const batch = batches.find((b) => b.id === id);
  const item = batch?.items.find((i) => i.id === itemId);
  if (!batch || !item) notFound();
  const copy = statusCopy[item.status];

  return (
    <MobileShell>
      <TopBar back title="Item status" />
      <PageBody>
        <header className="flex flex-col items-center text-center gap-3">
          <h1 className="text-h1 font-display text-white">My Item Status</h1>
          <StatusPill status={item.status} tone="solid" />
          <p className="text-small text-gray-400 max-w-[30ch]">{copy.sub}</p>
        </header>

        {/* Hero image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-800">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 480px) 100vw, 480px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="grid h-full place-items-center text-gray-500">
              No image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
          <Link
            href={`/batches/${id}/items/${itemId}/edit`}
            className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-glass text-white hover:bg-black/60 transition"
            aria-label="Edit item"
          >
            <Edit3 size={16} />
          </Link>
        </div>

        {/* Read-only fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-caption uppercase tracking-wider text-gray-400">
              Item name
            </span>
            <div className="surface-card-light rounded-full px-5 py-3 text-body">
              {item.title}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-caption uppercase tracking-wider text-gray-400">
              Description
            </span>
            <div className="surface-card-light rounded-lg px-5 py-4 text-body whitespace-pre-wrap">
              {item.description}
            </div>
          </div>
        </div>
      </PageBody>

      {copy.cta && (
        <div className="fixed bottom-[92px] inset-x-0 z-30 mx-auto w-full max-w-[480px] px-5 pointer-events-none">
          <Button asChild fullWidth className="pointer-events-auto">
            <Link href="/qr">
              <QrCode size={18} /> {copy.cta}
            </Link>
          </Button>
        </div>
      )}

      <BottomNav role="depositor" />
    </MobileShell>
  );
}
