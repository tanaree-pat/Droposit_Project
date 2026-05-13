import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, QrCode } from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { EmptyState } from "@/components/ui/empty-state";
import { ItemCard } from "@/components/batch/item-card";
import { batches } from "@/lib/mock-data";

/**
 * Batch detail — shows the title, status, and items contained in a batch.
 * Below the items grid: primary CTA to add another item, plus a sticky QR
 * action floating above the bottom nav so depositors can jump straight
 * to verification.
 */
export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const batch = batches.find((b) => b.id === id);
  if (!batch) notFound();

  return (
    <MobileShell>
      <TopBar back title={batch.title} />
      <PageBody>
        <header className="flex flex-col gap-3">
          <h1 className="text-h1 font-display text-white text-balance">My Item Batch</h1>
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
            description="Add the first item to this batch. You can include a name and description."
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
              <ItemCard
                key={item.id}
                item={item}
                href={`/batches/${batch.id}/items/${item.id}`}
              />
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
      </PageBody>

      {/* Floating QR CTA above bottom nav — only meaningful when items exist */}
      {batch.items.length > 0 && (
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
