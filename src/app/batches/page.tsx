"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BatchCard } from "@/components/batch/batch-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequireAuth } from "@/lib/auth-context";
import { batchesApi } from "@/lib/api";
import type { Batch, ItemStatus } from "@/lib/types";

const filters: { value: "all" | ItemStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "deposited", label: "Deposited" },
  { value: "claimed", label: "Claimed" },
];

export default function BatchesPage() {
  const { user, loading: authLoading } = useRequireAuth("depositor");
  const [batches, setBatches] = React.useState<Batch[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<"all" | ItemStatus>("all");
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (!user) return;
    batchesApi.list()
      .then(setBatches)
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || !user) return null;

  const visible = batches.filter((b) => {
    const matchStatus = filter === "all" || b.status === filter;
    const q = query.trim().toLowerCase();
    const matchQuery = !q || b.title.toLowerCase().includes(q) || b.description.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  return (
    <MobileShell>
      <TopBar />
      <PageBody>
        <section>
          <h1 className="text-h1 font-display text-white">Batch list</h1>
          <p className="mt-1 text-small text-gray-400">
            You currently have {batches.length} active batch{batches.length === 1 ? "" : "es"} in your list.
          </p>
        </section>

        <Input
          placeholder="Search by title or description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leadingIcon={<Search size={18} />}
          surface="dark"
        />

        <div className="-mx-5 px-5 flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map((f) => {
            const active = f.value === filter;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`h-10 shrink-0 rounded-full px-5 text-small font-medium transition ${
                  active
                    ? "bg-white text-gray-900 shadow-soft"
                    : "bg-white/[0.05] text-gray-300 border border-white/[0.06] hover:bg-white/[0.08]"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<Search size={24} />}
            title="No batches found"
            description="Try a different search term or clear filters to see all batches."
            action={
              <Button variant="secondary" size="md" onClick={() => { setQuery(""); setFilter("all"); }}>
                Reset
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {visible.map((b) => (
              <BatchCard key={b.id} batch={b} href={`/batches/${b.id}`} />
            ))}
          </div>
        )}
      </PageBody>

      <div className="fixed bottom-[92px] inset-x-0 z-30 mx-auto w-full max-w-[480px] px-5 pointer-events-none">
        <Button asChild fullWidth className="pointer-events-auto">
          <Link href="/batches/new"><Plus size={18} /> Add new batch</Link>
        </Button>
      </div>

      <BottomNav role="depositor" />
    </MobileShell>
  );
}
