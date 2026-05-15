"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Edit3, QrCode } from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequireAuth } from "@/lib/auth-context";
import { batchesApi } from "@/lib/api";
import type { Batch, Item, ItemStatus } from "@/lib/types";

const statusCopy: Record<ItemStatus, { headline: string; sub: string; cta?: string }> = {
  pending: { headline: "Pending", sub: "Waiting for deposit — access QR code to deposit", cta: "Show QR to deposit" },
  deposited: { headline: "Deposited", sub: "Currently deposited — access QR code to claim", cta: "Show QR to claim" },
  claimed: { headline: "Claimed", sub: "Item has already been claimed" },
};

export default function ItemDetailPage() {
  const { id, itemId } = useParams<{ id: string; itemId: string }>();
  const { user, loading: authLoading } = useRequireAuth("depositor");
  const [batch, setBatch] = React.useState<Batch | null>(null);
  const [item, setItem] = React.useState<Item | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound404, setNotFound404] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    batchesApi.get(parseInt(id))
      .then((b) => {
        setBatch(b);
        const found = b.items.find((i) => i.id === itemId);
        if (!found) setNotFound404(true);
        else setItem(found);
      })
      .catch(() => setNotFound404(true))
      .finally(() => setLoading(false));
  }, [user, id, itemId]);

  if (authLoading || !user) return null;
  if (notFound404) notFound();

  const copy = item ? statusCopy[item.status] : null;

  return (
    <MobileShell>
      <TopBar back title="Item status" />
      <PageBody>
        {loading || !item || !batch ? (
          <>
            <Skeleton className="h-8 w-1/2 mx-auto" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-full" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </>
        ) : (
          <>
            <header className="flex flex-col items-center text-center gap-3">
              <h1 className="text-h1 font-display text-white">My Item Status</h1>
              <StatusPill status={item.status} tone="solid" />
              <p className="text-small text-gray-400 max-w-[30ch]">{copy?.sub}</p>
            </header>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-800">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 480px) 100vw, 480px" className="object-cover" priority />
              ) : (
                <div className="grid h-full place-items-center text-gray-500">No image</div>
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

            <div className="flex flex-col gap-4">
              <ReadField label="Item name" value={item.title} />
              <ReadField label="Description" value={item.description} multiline />
            </div>
          </>
        )}
      </PageBody>

      {copy?.cta && batch && (
        <div className="fixed bottom-[92px] inset-x-0 z-30 mx-auto w-full max-w-[480px] px-5 pointer-events-none">
          <Button asChild fullWidth className="pointer-events-auto">
            <Link href={`/qr?batch=${batch.id}`}>
              <QrCode size={18} /> {copy.cta}
            </Link>
          </Button>
        </div>
      )}
      <BottomNav role="depositor" />
    </MobileShell>
  );
}

function ReadField({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-caption uppercase tracking-wider text-gray-400">{label}</span>
      <div className={`surface-card-light px-5 py-3 text-body ${multiline ? "rounded-lg whitespace-pre-wrap" : "rounded-full"}`}>
        {value}
      </div>
    </div>
  );
}
