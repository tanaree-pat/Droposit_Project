"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { ItemCard } from "@/components/batch/item-card";
import { findBatchByToken } from "@/lib/mock-data";

/**
 * Scan result — resolves a qr_token to a batch and presents the correct
 * state transition to staff:
 *   pending   → POST /scan/:qr_token/deposit   (Confirm deposit)
 *   deposited → POST /scan/:qr_token/checkout  (Confirm checkout)
 *   claimed   → read-only, already retrieved
 *
 * In a real backend the CTA fires the corresponding POST. Here we simulate
 * the transition optimistically and redirect to the batch list.
 */
export default function ScanResultPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const token = sp.get("token") ?? "";

  const batch = findBatchByToken(token);

  const [done, setDone] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const confirm = () => {
    setLoading(true);
    // Simulate POST /scan/:token/deposit or /checkout
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => router.push("/staff/batches"), 1200);
    }, 600);
  };

  // Unknown token
  if (!batch) {
    return (
      <MobileShell>
        <TopBar back title="Scan result" />
        <PageBody className="items-center justify-center text-center gap-6">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-danger/15 text-danger">
            <AlertCircle size={36} />
          </span>
          <div>
            <p className="text-h3 text-white">Token not found</p>
            <p className="mt-2 text-small text-gray-400 max-w-[28ch]">
              The scanned code <span className="font-mono text-gray-300">{token || "—"}</span> does
              not match any batch in the system.
            </p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            Scan again
          </Button>
        </PageBody>
        <BottomNav role="staff" />
      </MobileShell>
    );
  }

  const isPending = batch.status === "pending";
  const isDeposited = batch.status === "deposited";
  const isClaimed = batch.status === "claimed";

  const action = isPending ? "deposit" : isDeposited ? "checkout" : null;

  return (
    <MobileShell>
      <TopBar back title="Verify batch" />
      <PageBody>
        {/* Owner + batch header */}
        <section>
          <p className="text-caption uppercase tracking-wider text-secondary-300">
            {batch.ownerName}
          </p>
          <h1 className="mt-1 text-h1 font-display text-white">{batch.title}</h1>
          <p className="mt-1 text-small text-gray-400">{batch.description}</p>
        </section>

        {/* Resolved batch metadata */}
        <section className="surface-card divide-y divide-white/[0.05]">
          <MetaRow label="Status">
            <StatusPill status={batch.status} tone="solid" />
          </MetaRow>
          <MetaRow label="Token">
            <span className="font-mono text-caption text-gray-300 tracking-wider">
              {batch.qr_token}
            </span>
          </MetaRow>
          <MetaRow label="Items">
            <span className="text-white font-medium">
              {batch.items.length} item{batch.items.length === 1 ? "" : "s"}
            </span>
          </MetaRow>
          <MetaRow label="Action">
            <span
              className={[
                "font-semibold capitalize",
                isPending ? "text-warning" : isDeposited ? "text-secondary-300" : "text-gray-500",
              ].join(" ")}
            >
              {action ?? "No action available"}
            </span>
          </MetaRow>
        </section>

        {/* Endpoint reference */}
        {action && (
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <p className="text-caption text-gray-500 uppercase tracking-wider mb-1">Endpoint</p>
            <p className="font-mono text-caption text-gray-300">
              POST /scan/{batch.qr_token}/{action}
            </p>
          </div>
        )}

        {/* Item list */}
        {batch.items.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-h3 text-white">Items in this batch</h2>
            {batch.items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                href={`/staff/batches/${batch.id}/items/${item.id}`}
              />
            ))}
          </section>
        )}

        {/* Already claimed state */}
        {isClaimed && (
          <div className="surface-card flex flex-col items-center gap-3 py-8 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-gray-700 text-gray-400">
              <Clock size={24} />
            </span>
            <p className="text-body font-semibold text-gray-300">Already retrieved</p>
            <p className="text-small text-gray-500 max-w-[26ch]">
              This batch was claimed. No further action is needed.
            </p>
          </div>
        )}
      </PageBody>

      {/* Sticky CTA — only for actionable states */}
      {action && (
        <div className="fixed bottom-[92px] inset-x-0 z-30 mx-auto w-full max-w-[480px] px-5 pointer-events-none">
          <Button
            fullWidth
            loading={loading}
            onClick={confirm}
            className="pointer-events-auto"
            variant={isPending ? "primary" : "warm"}
          >
            Confirm {action}
          </Button>
        </div>
      )}

      {/* Success overlay */}
      {done && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-glass"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 18, stiffness: 240 }}
            className="surface-card flex flex-col items-center gap-3 px-10 py-8 text-center"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-primary-500 text-white shadow-glow">
              <CheckCircle2 size={32} />
            </span>
            <p className="text-h3 text-white capitalize">{action}ed</p>
            <p className="text-small text-gray-400">
              {batch.items.length} item{batch.items.length === 1 ? "" : "s"} processed for{" "}
              {batch.ownerName}.
            </p>
          </motion.div>
        </motion.div>
      )}

      <BottomNav role="staff" />
    </MobileShell>
  );
}

function MetaRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 gap-3">
      <span className="text-small text-gray-400 shrink-0">{label}</span>
      <span className="flex justify-end">{children}</span>
    </div>
  );
}
