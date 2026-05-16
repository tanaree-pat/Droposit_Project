"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Input } from "@/components/ui/input";
import { BatchCard } from "@/components/batch/batch-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequireAuth } from "@/lib/auth-context";
import { adminApi } from "@/lib/api";
import type { Batch, ItemStatus } from "@/lib/types";

type Tab = "all" | ItemStatus;

const tabs: { value: Tab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "deposited", label: "Deposited" },
  { value: "claimed", label: "Claimed" },
];

export default function StaffBatchesPage() {
  const { user, loading: authLoading } = useRequireAuth("staff");
  const [tab, setTab] = React.useState<Tab>("deposited");
  const [query, setQuery] = React.useState("");
  const [batches, setBatches] = React.useState<Batch[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    adminApi.listBatches()
      .then(setBatches)
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || !user) return null;

  const filtered = batches.filter((b) => {
    const matchStatus = tab === "all" || b.status === tab;
    const q = query.trim().toLowerCase();
    const matchQuery = !q || b.ownerName.toLowerCase().includes(q) || b.title.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  const countFor = (t: Tab) =>
    t === "all" ? batches.length : batches.filter((b) => b.status === t).length;

  return (
    <MobileShell>
      <TopBar rightAction={<></>} />
      <PageBody>
        <section>
          <h1 className="text-h1 font-display text-white">Batch list</h1>
          <p className="mt-1 text-small text-gray-400">
            {loading ? "Loading…" : `${batches.length} batch${batches.length === 1 ? "" : "es"} across all states`}
          </p>
        </section>

        <Input
          placeholder="Search by depositor or batch name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leadingIcon={<Search size={18} />}
          surface="dark"
        />

        <div className="-mx-5 px-5 flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((t) => {
            const active = t.value === tab;
            const count = loading ? null : countFor(t.value);
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setTab(t.value)}
                className={`h-10 shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 text-small font-medium transition ${
                  active
                    ? "bg-white text-gray-900 shadow-soft"
                    : "bg-white/[0.05] text-gray-300 border border-white/[0.06] hover:bg-white/[0.08]"
                }`}
              >
                {t.label}
                {count !== null && (
                  <span className={`rounded-full px-1.5 py-px text-caption tabular-nums ${
                    active ? "bg-black/10 text-gray-700" : "bg-white/[0.08] text-gray-400"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Search size={24} />}
            title="No batches found"
            description={
              query
                ? "No results match your search. Try a different name or clear the search."
                : `No ${tab === "all" ? "" : tab + " "}batches in the system yet.`
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((b) => (
              <BatchCard key={b.id} batch={b} href={`/staff/batches/${b.id}`} showOwner />
            ))}
          </div>
        )}
      </PageBody>
      <BottomNav role="staff" />
    </MobileShell>
  );
}
