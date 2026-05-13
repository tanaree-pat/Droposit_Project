import Image from "next/image";
import { notFound } from "next/navigation";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { StatusPill } from "@/components/ui/status-pill";
import { retrievedBatches, systemBatches } from "@/lib/mock-data";

/**
 * Staff item inspection — read-only view of one item inside a batch.
 * Mirrors the depositor item-status screen but is gated as inspection
 * (no edit affordance).
 */
export default async function StaffItemDetail({
  params,
}: {
  params: Promise<{ id: string; itemId: string }>;
}) {
  const { id, itemId } = await params;
  const batch =
    systemBatches.find((b) => b.id === id) ||
    retrievedBatches.find((b) => b.id === id);
  const item = batch?.items.find((i) => i.id === itemId);
  if (!batch || !item) notFound();

  return (
    <MobileShell>
      <TopBar back title={item.title} />
      <PageBody>
        <header className="flex flex-col items-center text-center gap-3">
          <p className="text-caption uppercase text-gray-400">
            {batch.ownerName} · {batch.title}
          </p>
          <h1 className="text-h2 font-display text-white text-balance">{item.title}</h1>
          <StatusPill status={item.status} tone="solid" />
        </header>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-800">
          {item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 480px) 100vw, 480px"
              className="object-cover"
            />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Read label="Item name" value={item.title} />
          <Read label="Description" value={item.description} multiline />
        </div>
      </PageBody>
      <BottomNav role="staff" />
    </MobileShell>
  );
}

function Read({
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
      <span className="text-caption uppercase tracking-wider text-gray-400">
        {label}
      </span>
      <div
        className={`surface-card-light px-5 py-3 text-body ${
          multiline ? "rounded-lg whitespace-pre-wrap" : "rounded-full"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
