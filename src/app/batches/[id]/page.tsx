"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Plus, QrCode } from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { EmptyState } from "@/components/ui/empty-state";
import { ItemCard } from "@/components/batch/item-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequireAuth } from "@/lib/auth-context";
import { batchesApi } from "@/lib/api";
import type { Batch } from "@/lib/types";

export default function BatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useRequireAuth("depositor");
  const [batch, setBatch] = React.useState<Batch | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) return;
    batchesApi.get(parseInt(id))
      .then(setBatch)
      .catch((err) => setFetchError(err instanceof Error ? err.message : "Could not load batch"))
      .finally(() => setLoading(false));
  }, [user, id]);

  if (authLoading || !user) return null;

  return (
    <MobileShell>
      <TopBar back title={batch?.title ?? "Batch"} />
      <PageBody>
        {fetchError ? (
          <div className="rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-small text-danger">
            {fetchError}
          </div>
        ) : loading || !batch ? (
          <>
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
            <div className="flex flex-col gap-3">
              {[0, 1].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
          </>
        ) : (
          <>
            <header className="flex flex-col gap-3">
              <h1 className="text-h1 font-display text-white text-balance">{batch.title}</h1>
              <div className="flex items-center gap-3">
                <StatusPill status={batch.status} tone="solid" />
                <span className="text-small text-gray-400">
                  {batch.items.length} item{batch.items.length === 1 ? "" : "s"}
                </span>
              </div>
              <p className="text-small text-gray-400">{batch.description}</p>
            </header>

            {batch.items.length === 0 ? (
              <EmptyState
                icon={<Plus size={26} />}
                title="No items yet"
                description="Add the first item to this batch."
                action={
                  <Button asChild>
                    <Link href={`/batches/${batch.id}/items/new`}>
                      <Plus size={18} /> Add new item
                    </Link>
                  </Button>
                }
              />
            ) : (
              <div className="flex flex-col gap-3">
                {batch.items.map((item) => (
                  <ItemCard key={item.id} item={item} href={`/batches/${batch.id}/items/${item.id}`} />
                ))}
              </div>
            )}

            {batch.items.length > 0 && (
              <Button asChild fullWidth variant="outline">
                <Link href={`/batches/${batch.id}/items/new`}>
                  <Plus size={18} /> Add new item
                </Link>
              </Button>
            )}
          </>
        )}
      </PageBody>

      {batch && batch.items.length > 0 && (
        <div className="fixed bottom-[92px] inset-x-0 z-30 mx-auto w-full max-w-[480px] px-5 pointer-events-none">
          <Button asChild fullWidth className="pointer-events-auto">
            <Link href={`/qr?batch=${batch.id}`}>
              <QrCode size={18} /> Show QR to deposit
            </Link>
          </Button>
        </div>
      )}

      <BottomNav role="depositor" />
    </MobileShell>
  );
}
