"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, ImageOff } from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequireAuth } from "@/lib/auth-context";
import { adminApi } from "@/lib/api";
import type { Batch, Item } from "@/lib/types";

export default function StaffItemDetail() {
  const { id, itemId } = useParams<{ id: string; itemId: string }>();
  const { user, loading: authLoading } = useRequireAuth("staff");
  const [batch, setBatch] = React.useState<Batch | null>(null);
  const [item, setItem] = React.useState<Item | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) return;
    adminApi.getBatch(parseInt(id))
      .then((b) => {
        setBatch(b);
        const found = b.items.find((i) => i.id === itemId);
        if (!found) setError("Item not found in this batch.");
        else setItem(found);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load item"))
      .finally(() => setLoading(false));
  }, [user, id, itemId]);

  if (authLoading || !user) return null;

  if (!loading && error) {
    return (
      <MobileShell>
        <TopBar back title="Item detail" />
        <PageBody className="items-center justify-center text-center gap-6">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-danger/15 text-danger">
            <AlertCircle size={36} />
          </span>
          <div>
            <p className="text-h3 text-white">Item not found</p>
            <p className="mt-2 text-small text-gray-400 max-w-[28ch]">{error}</p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/staff/batches/${id}`}>Back to batch</Link>
          </Button>
        </PageBody>
        <BottomNav role="staff" />
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <TopBar back title={item?.title ?? "Item"} />
      <PageBody>
        {loading || !item || !batch ? (
          <>
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </>
        ) : (
          <>
            {/* Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-800">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 480px) 100vw, 480px"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center gap-2 text-center">
                  <ImageOff size={28} className="text-gray-600" />
                  <p className="text-caption text-gray-500">No photo</p>
                </div>
              )}
            </div>

            {/* Header */}
            <header className="flex flex-col gap-2">
              <p className="text-caption uppercase tracking-wider text-gray-400">
                {batch.ownerName} · {batch.title}
              </p>
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-h2 font-display text-white text-balance">{item.title}</h1>
                <StatusPill status={item.status} tone="solid" />
              </div>
            </header>

            {/* Fields */}
            <div className="flex flex-col gap-3">
              <ReadField label="Item name" value={item.title} />
              <ReadField label="Description" value={item.description || "No description provided."} multiline />
            </div>
          </>
        )}
      </PageBody>
      <BottomNav role="staff" />
    </MobileShell>
  );
}

function ReadField({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-caption uppercase tracking-wider text-gray-400">{label}</span>
      <div
        className={`surface-card px-5 py-3 text-body text-gray-200 ${
          multiline ? "rounded-xl whitespace-pre-wrap" : "rounded-full"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
