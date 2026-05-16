"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut, Shield } from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequireAuth, useAuth } from "@/lib/auth-context";
import { batchesApi } from "@/lib/api";
import type { Batch } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth("depositor");
  const { logout } = useAuth();
  const [batches, setBatches] = React.useState<Batch[]>([]);
  const [statsLoading, setStatsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    batchesApi.list().then(setBatches).finally(() => setStatsLoading(false));
  }, [user]);

  const handleLogout = () => { logout(); router.push("/login"); };
  const initials = user?.full_name.split(" ").map((n) => n[0]).join("") ?? "";

  if (authLoading || !user) return null;

  const stats = {
    batches: batches.length,
    items: batches.reduce((acc, b) => acc + b.items.length, 0),
    claimed: batches.filter((b) => b.status === "claimed").length,
  };

  return (
    <MobileShell>
      <TopBar />
      <PageBody>
        <section className="surface-card p-6 flex flex-col items-center text-center gap-4"
          style={{ background: "radial-gradient(140% 80% at 50% 0%, rgba(34,197,94,0.15) 0%, transparent 50%), rgba(22,27,34,0.85)" }}
        >
          <div className="relative grid h-24 w-24 place-items-center rounded-full bg-primary-500 text-white text-h2 font-display shadow-glow">
            {initials}
            <span className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary-600 shadow-soft">
              <Shield size={14} />
            </span>
          </div>
          <div>
            <h1 className="text-h2 font-display text-white">{user.full_name}</h1>
            <p className="text-small text-gray-400">{user.email}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 w-full pt-2">
            {statsLoading ? (
              [0, 1, 2].map((i) => <Skeleton key={i} className="h-16 rounded-md" />)
            ) : (
              <>
                <Stat label="Batches" value={stats.batches} />
                <Stat label="Items" value={stats.items} />
                <Stat label="Claimed" value={stats.claimed} />
              </>
            )}
          </div>
        </section>

        <Button fullWidth variant="ghost" className="text-danger hover:text-red-300" onClick={handleLogout}>
          <LogOut size={18} /> Sign out
        </Button>

        <p className="text-center text-caption text-gray-500">Droposit v0.1 · 2026</p>
      </PageBody>
      <BottomNav role="depositor" />
    </MobileShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-white/[0.03] py-3 px-2 text-center">
      <p className="text-h3 font-display text-white tabular-nums">{value}</p>
      <p className="text-caption text-gray-500">{label}</p>
    </div>
  );
}

