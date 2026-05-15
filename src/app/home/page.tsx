"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Plus,
  QrCode,
  Sparkles,
} from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { Skeleton } from "@/components/ui/skeleton";
import { BatchCard } from "@/components/batch/batch-card";
import { useRequireAuth } from "@/lib/auth-context";
import { batchesApi } from "@/lib/api";
import type { Batch } from "@/lib/types";

export default function HomePage() {
  const { user, loading: authLoading } = useRequireAuth("depositor");
  const [batches, setBatches] = React.useState<Batch[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    batchesApi.list()
      .then(setBatches)
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || !user) return null;

  const totalItems = batches.reduce((acc, b) => acc + b.items.length, 0);
  const pending = batches.filter((b) => b.status === "pending").length;
  const deposited = batches.filter((b) => b.status === "deposited").length;
  const claimed = batches.filter((b) => b.status === "claimed").length;
  const firstName = user.full_name.split(" ")[0];

  return (
    <MobileShell>
      <TopBar />
      <PageBody>
        <section className="-mt-2">
          <p className="text-caption uppercase tracking-[0.18em] text-primary-300/80">
            <Sparkles size={12} className="inline mr-1.5 -mt-0.5" /> Good morning
          </p>
          {loading ? (
            <Skeleton className="h-9 w-40 mt-1" />
          ) : (
            <h1 className="mt-1 text-h1 font-display text-white text-balance">
              Hello, {firstName}
            </h1>
          )}
          <p className="mt-1 text-small text-gray-400">
            {loading ? "Loading your batches…" : (
              <>You have {totalItems} item{totalItems === 1 ? "" : "s"} across{" "}
              {batches.length} batch{batches.length === 1 ? "" : "es"}.</>
            )}
          </p>
        </section>

        <section className="grid grid-cols-3 gap-3">
          {loading ? (
            [0, 1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)
          ) : (
            <>
              <SnapshotCard label="Pending" value={pending} status="pending" />
              <SnapshotCard label="Deposited" value={deposited} status="deposited" />
              <SnapshotCard label="Claimed" value={claimed} status="claimed" />
            </>
          )}
        </section>

        <section className="relative overflow-hidden rounded-xl p-6 text-white shadow-card border border-primary-400/20"
          style={{
            background:
              "radial-gradient(120% 80% at 0% 0%, rgba(34,197,94,0.45) 0%, transparent 60%), linear-gradient(160deg, #0f3322 0%, #14532d 80%)",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-caption uppercase tracking-widest text-primary-200/80">
                Your verification
              </p>
              <h2 className="mt-1 text-h2 font-display text-white">My QR Code</h2>
              <p className="mt-2 text-small text-white/70 max-w-[28ch]">
                Show this at any checkpoint to deposit or claim your batches.
              </p>
              <Button asChild size="md" variant="primary" className="mt-5">
                <Link href="/qr">Open QR <ArrowRight size={16} /></Link>
              </Button>
            </div>
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-white text-gray-900 shadow-glow">
              <QrCode size={40} strokeWidth={1.5} />
            </div>
          </div>
        </section>

        <section>
          <header className="mb-3 flex items-center justify-between">
            <h2 className="text-h3 text-white">Recent batches</h2>
            <Link href="/batches" className="text-small text-primary-300 hover:text-primary-200 transition">
              View all
            </Link>
          </header>
          {loading ? (
            <div className="flex flex-col gap-3">
              {[0, 1].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {batches.slice(0, 3).map((b) => (
                <BatchCard key={b.id} batch={b} href={`/batches/${b.id}`} />
              ))}
            </div>
          )}
        </section>

        <Button asChild fullWidth variant="outline">
          <Link href="/batches/new">
            <Plus size={18} /> Create new batch
          </Link>
        </Button>
      </PageBody>
      <BottomNav role="depositor" />
    </MobileShell>
  );
}

function SnapshotCard({
  label, value, status,
}: {
  label: string; value: number; status: "pending" | "deposited" | "claimed";
}) {
  return (
    <div className="surface-card p-4 flex flex-col gap-2">
      <StatusPill status={status} tone="soft" size="sm" />
      <div className="flex items-baseline justify-between">
        <span className="text-h2 font-display text-white tabular-nums">{value}</span>
        <Boxes size={14} className="text-gray-500" />
      </div>
      <span className="text-caption text-gray-500">{label}</span>
    </div>
  );
}
