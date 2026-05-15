"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Boxes, ScanLine, ShieldCheck } from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequireAuth } from "@/lib/auth-context";
import { adminApi } from "@/lib/api";
import type { Batch } from "@/lib/types";

export default function StaffDashboardPage() {
  const { user, loading: authLoading } = useRequireAuth("staff");
  const [deposited, setDeposited] = React.useState<Batch[]>([]);
  const [claimed, setClaimed] = React.useState<Batch[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    Promise.all([adminApi.listBatches("deposited"), adminApi.listBatches("claimed")])
      .then(([dep, clm]) => { setDeposited(dep); setClaimed(clm); })
      .finally(() => setLoading(false));
  }, [user]);

  const initials = user?.full_name.split(" ").map((n) => n[0]).join("") ?? "";
  if (authLoading || !user) return null;

  return (
    <MobileShell>
      <TopBar
        rightAction={
          <Link href="/staff/profile" className="inline-flex h-11 items-center gap-2 rounded-full bg-white/[0.06] px-3 text-small text-white hover:bg-white/[0.1] transition">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-secondary-500 text-white text-caption font-bold">{initials}</span>
            Staff
          </Link>
        }
      />
      <PageBody>
        <section>
          <p className="text-caption uppercase tracking-[0.18em] text-secondary-300">
            <ShieldCheck size={12} className="inline mr-1.5 -mt-0.5" /> Staff console
          </p>
          <h1 className="mt-1 text-h1 font-display text-white">Checkpoint A</h1>
          <p className="mt-1 text-small text-gray-400">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </section>

        <Link href="/staff/scan" className="group relative overflow-hidden rounded-xl p-6 border border-primary-400/30 shadow-card pressable"
          style={{ background: "radial-gradient(120% 80% at 0% 0%, rgba(34,197,94,0.45) 0%, transparent 60%), linear-gradient(160deg, #0f3322 0%, #14532d 80%)" }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-h2 font-display text-white">Scan QR</h2>
              <p className="mt-1 text-small text-white/70 max-w-[26ch]">Process deposits and checkouts in seconds.</p>
            </div>
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-gray-900 shadow-glow group-hover:scale-105 transition">
              <ScanLine size={28} />
            </span>
          </div>
        </Link>

        <section className="grid grid-cols-2 gap-3">
          {loading ? (
            [0, 1].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)
          ) : (
            <>
              <Kpi label="In system" value={deposited.length} status="deposited" />
              <Kpi label="Retrieved today" value={claimed.length} status="claimed" />
            </>
          )}
        </section>

        <section>
          <header className="mb-3 flex items-center justify-between">
            <h2 className="text-h3 text-white">Recent activity</h2>
            <Link href="/staff/batches" className="text-small text-primary-300 hover:text-primary-200 inline-flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </header>
          {loading ? (
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {deposited.slice(0, 3).map((b) => (
                <li key={b.id}>
                  <Link href={`/staff/batches/${b.id}`} className="surface-card p-4 flex items-center justify-between hover:bg-gray-850/95 pressable">
                    <div className="min-w-0">
                      <p className="text-caption uppercase text-gray-500">{b.ownerName}</p>
                      <p className="text-body font-semibold text-white truncate">{b.title}</p>
                    </div>
                    <StatusPill status={b.status} tone="soft" size="sm" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Button asChild fullWidth variant="outline">
          <Link href="/staff/batches"><Boxes size={18} /> View all batches</Link>
        </Button>
      </PageBody>
      <BottomNav role="staff" />
    </MobileShell>
  );
}

function Kpi({ label, value, status }: { label: string; value: number; status: "deposited" | "claimed" }) {
  return (
    <div className="surface-card p-4 flex flex-col gap-2">
      <StatusPill status={status} tone="soft" size="sm" />
      <span className="text-display font-display text-white tabular-nums leading-none">{value}</span>
      <span className="text-caption text-gray-500">{label}</span>
    </div>
  );
}
