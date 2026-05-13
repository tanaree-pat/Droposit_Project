import { notFound } from "next/navigation";
import Link from "next/link";
import { ScanLine } from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { ItemCard } from "@/components/batch/item-card";
import { retrievedBatches, systemBatches } from "@/lib/mock-data";

/**
 * Staff batch inspection — shows the owner, batch metadata, and every
 * item. A sticky CTA at the bottom returns to the scan workflow with
 * the appropriate mode pre-selected based on current status.
 */
export default async function StaffBatchDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const batch =
    systemBatches.find((b) => b.id === id) ||
    retrievedBatches.find((b) => b.id === id);
  if (!batch) notFound();

  const nextMode = batch.status === "deposited" ? "checkout" : "deposit";

  return (
    <MobileShell>
      <TopBar back title={batch.ownerName} />
      <PageBody>
        <header className="flex flex-col gap-3">
          <p className="text-caption uppercase tracking-wider text-gray-400">
            Owner · {batch.ownerName}
          </p>
          <h1 className="text-h1 font-display text-white">{batch.title}</h1>
          <div className="flex items-center gap-3">
            <StatusPill status={batch.status} tone="solid" />
            <span className="text-small text-gray-400">
              {batch.items.length} item{batch.items.length === 1 ? "" : "s"}
            </span>
          </div>
          <p className="text-small text-gray-400">{batch.description}</p>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="text-h3 text-white">Items</h2>
          {batch.items.length === 0 ? (
            <p className="text-small text-gray-400">No item details captured for this batch.</p>
          ) : (
            batch.items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                href={`/staff/batches/${batch.id}/items/${item.id}`}
              />
            ))
          )}
        </section>
      </PageBody>

      <div className="fixed bottom-[92px] inset-x-0 z-30 mx-auto w-full max-w-[480px] px-5 pointer-events-none">
        <Button asChild fullWidth className="pointer-events-auto" variant={nextMode === "checkout" ? "warm" : "primary"}>
          <Link href={`/staff/scan?mode=${nextMode}`}>
            <ScanLine size={18} />
            {nextMode === "deposit" ? "Open deposit scanner" : "Open checkout scanner"}
          </Link>
        </Button>
      </div>

      <BottomNav role="staff" />
    </MobileShell>
  );
}
