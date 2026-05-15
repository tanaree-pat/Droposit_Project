"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Copy, Download, Share2 } from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { Skeleton } from "@/components/ui/skeleton";
import { QRDisplay } from "@/components/qr/qr-display";
import { useRequireAuth } from "@/lib/auth-context";
import { batchesApi } from "@/lib/api";
import type { Batch } from "@/lib/types";

export default function QRPage() {
  const sp = useSearchParams();
  const { user, loading: authLoading } = useRequireAuth("depositor");
  const preselect = sp.get("batch");
  const [batches, setBatches] = React.useState<Batch[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedId, setSelectedId] = React.useState<string>("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    batchesApi.list().then((bs) => {
      setBatches(bs);
      const activeBatches = bs.filter((b) => b.status !== "claimed");
      const def = preselect ?? activeBatches[0]?.id ?? bs[0]?.id ?? "";
      setSelectedId(def);
    }).finally(() => setLoading(false));
  }, [user, preselect]);

  if (authLoading || !user) return null;

  const batch = batches.find((b) => b.id === selectedId) ?? batches[0];
  const qrValue = batch ? `droposit://scan/${batch.qr_token}` : "";

  const onCopy = async () => {
    if (!batch) return;
    try {
      await navigator.clipboard.writeText(batch.qr_token);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* noop */ }
  };

  const onShare = async () => {
    if (!batch || !("share" in navigator)) return;
    try {
      await navigator.share({
        title: `Droposit — ${batch.title}`,
        text: `Scan to ${batch.status === "pending" ? "deposit" : "retrieve"} my batch: ${batch.title}`,
        url: qrValue,
      });
    } catch { /* user cancelled */ }
  };

  return (
    <MobileShell>
      <TopBar title="Batch QR" back />
      <PageBody className="gap-6">
        <header>
          <h1 className="text-h1 font-display text-white">Batch QR</h1>
          <p className="mt-1 text-small text-gray-400">
            Show this at any checkpoint to deposit or retrieve items.
          </p>
        </header>

        {loading ? (
          <>
            <Skeleton className="h-10 w-full rounded-full" />
            <Skeleton className="h-[240px] w-[240px] mx-auto rounded-xl" />
          </>
        ) : (
          <>
            {batches.length > 1 && (
              <section className="flex flex-col gap-2">
                <p className="text-caption uppercase tracking-wider text-gray-500">Select batch</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {batches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedId(b.id)}
                      className={[
                        "flex-shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-small font-medium border transition-all duration-fast",
                        b.id === selectedId
                          ? "bg-primary-500/20 border-primary-400/50 text-primary-300"
                          : "bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white",
                      ].join(" ")}
                    >
                      <span className="truncate max-w-[120px]">{b.title}</span>
                      <StatusPill status={b.status} tone="soft" size="sm" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {batch && (
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  key={batch.id}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="relative animate-pulse-glow rounded-xl"
                >
                  <QRDisplay value={qrValue} size={240} label={batch.title.toUpperCase()} />
                </motion.div>

                <div className="surface-card w-full p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-caption uppercase tracking-wider text-gray-500">Batch</p>
                      <p className="text-body font-semibold text-white truncate">{batch.title}</p>
                      <p className="text-small text-gray-400 mt-0.5">{batch.description}</p>
                    </div>
                    <StatusPill status={batch.status} tone="solid" />
                  </div>
                  <div className="divider-soft" />
                  <div className="flex items-center justify-between text-small">
                    <span className="text-gray-500">Token</span>
                    <span className="font-mono text-gray-300 text-caption tracking-wider">{batch.qr_token}</span>
                  </div>
                  <div className="flex items-center justify-between text-small">
                    <span className="text-gray-500">Items</span>
                    <span className="text-white">{batch.items.length} item{batch.items.length === 1 ? "" : "s"}</span>
                  </div>
                  <div className="flex items-center justify-between text-small">
                    <span className="text-gray-500">Action at checkpoint</span>
                    <span className="font-medium text-white capitalize">
                      {batch.status === "pending" ? "Deposit" : batch.status === "deposited" ? "Checkout" : "Already claimed"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 w-full">
                  <ActionTile icon={<Copy size={18} />} label={copied ? "Copied" : "Copy token"} onClick={onCopy} />
                  <ActionTile icon={<Share2 size={18} />} label="Share" onClick={onShare} />
                  <ActionTile icon={<Download size={18} />} label="Save" onClick={() => window.print()} />
                </div>
              </div>
            )}
          </>
        )}
      </PageBody>
      <BottomNav role="depositor" />
    </MobileShell>
  );
}

function ActionTile({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <Button onClick={onClick} variant="secondary" size="md" fullWidth className="flex-col h-20 gap-1 rounded-lg">
      <span className="text-primary-300">{icon}</span>
      <span className="text-caption text-center leading-tight">{label}</span>
    </Button>
  );
}
