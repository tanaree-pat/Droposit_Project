"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ScanLine, AlertCircle, Package } from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { ItemCard } from "@/components/batch/item-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequireAuth } from "@/lib/auth-context";
import { adminApi } from "@/lib/api";
import type { Batch } from "@/lib/types";

export default function StaffBatchDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useRequireAuth("staff");
  const [batch, setBatch] = React.useState<Batch | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) return;
    adminApi.getBatch(parseInt(id))
      .then(setBatch)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load batch"))
      .finally(() => setLoading(false));
  }, [user, id]);

  if (authLoading || !user) return null;

  if (!loading && error) {
    return (
      <MobileShell>
        <TopBar back title="Batch detail" />
        <PageBody className="items-center justify-center text-center gap-6">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-danger/15 text-danger">
            <AlertCircle size={36} />
          </span>
          <div>
            <p className="text-h3 text-white">Could not load batch</p>
            <p className="mt-2 text-small text-gray-400 max-w-[28ch]">{error}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/staff/batches">Back to list</Link>
          </Button>
        </PageBody>
        <BottomNav role="staff" />
      </MobileShell>
    );
  }

  const canDeposit = batch?.status === "pending";
  const canCheckout = batch?.status === "deposited";
  const scanMode = canDeposit ? "deposit" : "checkout";

  return (
    <MobileShell>
      <section
        className="relative overflow-hidden rounded-b-[40px] px-6 pb-10 safe-top pt-5"
        style={{
          background: "linear-gradient(170deg, #1c1400 0%, #291e00 60%, #1a1200 100%)",
        }}
      >
        <div className="relative flex items-center justify-between">
          <Link
            href="/staff/batches"
            aria-label="Back"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.10] text-white hover:bg-white/[0.18] transition"
          >
            <ArrowLeft size={18} />
          </Link>
          {batch && <StatusPill status={batch.status} tone="solid" />}
        </div>

        <div className="relative mt-4">
          {loading ? (
            <>
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-9 w-3/4 mb-3" />
              <Skeleton className="h-4 w-16" />
            </>
          ) : batch ? (
            <>
              <p className="text-caption uppercase tracking-[0.16em] text-secondary-300/80">
                {batch.ownerName}
              </p>
              <h1 className="mt-1 text-display font-display text-white leading-[0.95]">
                {batch.title}
              </h1>
              {batch.description && (
                <p className="mt-3 text-small text-white/60 max-w-[36ch]">{batch.description}</p>
              )}
              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-small text-white/70">
                  <Package size={14} />
                  {batch.items.length} item{batch.items.length === 1 ? "" : "s"}
                </span>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <PageBody className="-mt-6">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        ) : batch ? (
          <>
            {batch.items.length === 0 ? (
              <div className="surface-card flex flex-col items-center gap-3 py-10 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-gray-800 text-gray-500">
                  <Package size={24} />
                </span>
                <p className="text-body font-semibold text-gray-300">No items captured</p>
                <p className="text-small text-gray-500 max-w-[26ch]">
                  The depositor hasn&apos;t added any item details to this batch.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {batch.items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    href={`/staff/batches/${batch.id}/items/${item.id}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : null}

        <div className="h-20" />
      </PageBody>

      {batch && (canDeposit || canCheckout) && (
        <div className="fixed bottom-[92px] inset-x-0 z-30 mx-auto w-full max-w-[480px] px-5 pointer-events-none">
          <Button
            asChild
            fullWidth
            className="pointer-events-auto"
            variant={canDeposit ? "primary" : "warm"}
          >
            <Link href={`/staff/scan?mode=${scanMode}`}>
              <ScanLine size={18} />
              {canDeposit ? "Open deposit scanner" : "Open checkout scanner"}
            </Link>
          </Button>
        </div>
      )}

      <BottomNav role="staff" />
    </MobileShell>
  );
}
