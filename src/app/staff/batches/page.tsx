"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Segmented } from "@/components/ui/segmented";
import { Input } from "@/components/ui/input";
import { BatchCard } from "@/components/batch/batch-card";
import { EmptyState } from "@/components/ui/empty-state";
import { retrievedBatches, systemBatches } from "@/lib/mock-data";

/**
 * Staff batches view — Deposited / Retrieved segmented tabs that filter
 * across all users in the system. Search filters by owner name or title.
 */
type Tab = "deposited" | "retrieved";

export default function StaffBatchesPage() {
  const [tab, setTab] = React.useState<Tab>("deposited");
  const [query, setQuery] = React.useState("");

  const source = tab === "deposited" ? systemBatches : retrievedBatches;
  const visible = source.filter((b) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      b.ownerName.toLowerCase().includes(q) ||
      b.title.toLowerCase().includes(q)
    );
  });

  return (
    <MobileShell>
      <TopBar />
      <PageBody>
        <section>
          <h1 className="text-h1 font-display text-white">Batch list</h1>
          <p className="mt-1 text-small text-gray-400">
            There {tab === "deposited" ? "are" : "have been"} {source.length} batch
            {source.length === 1 ? "" : "es"} {tab === "deposited" ? "deposited in" : "retrieved from"} the system.
          </p>
        </section>

        <Segmented<Tab>
          options={[
            { value: "deposited", label: "Deposited" },
            { value: "retrieved", label: "Retrieved" },
          ]}
          value={tab}
          onChange={setTab}
          tone="warm"
        />

        <Input
          placeholder="Search by depositor or batch title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leadingIcon={<Search size={18} />}
        />

        {visible.length === 0 ? (
          <EmptyState
            icon={<Search size={24} />}
            title="No batches match"
            description="Try clearing your search or switching tabs."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {visible.map((b) => (
              <BatchCard
                key={b.id}
                batch={b}
                href={`/staff/batches/${b.id}`}
                showOwner
              />
            ))}
          </div>
        )}
      </PageBody>
      <BottomNav role="staff" />
    </MobileShell>
  );
}
