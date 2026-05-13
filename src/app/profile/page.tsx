import Link from "next/link";
import {
  Bell,
  ChevronRight,
  HelpCircle,
  LogOut,
  Shield,
  UserCog,
} from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { currentUser, batches } from "@/lib/mock-data";

/**
 * Depositor profile — concise identity block, summary stats, and a list
 * of preference sections. Logout is highlighted as a destructive ghost
 * action at the bottom.
 */
export default function ProfilePage() {
  const stats = {
    batches: batches.length,
    items: batches.reduce((acc, b) => acc + b.items.length, 0),
    claimed: batches.filter((b) => b.status === "claimed").length,
  };

  return (
    <MobileShell>
      <TopBar />
      <PageBody>
        {/* Identity card */}
        <section className="surface-card p-6 flex flex-col items-center text-center gap-4"
          style={{
            background:
              "radial-gradient(140% 80% at 50% 0%, rgba(34,197,94,0.15) 0%, transparent 50%), rgba(22,27,34,0.85)",
          }}
        >
          <div className="relative grid h-24 w-24 place-items-center rounded-full bg-primary-500 text-white text-h2 font-display shadow-glow">
            {currentUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
            <span className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary-600 shadow-soft">
              <Shield size={14} />
            </span>
          </div>
          <div>
            <h1 className="text-h2 font-display text-white">{currentUser.name}</h1>
            <p className="text-small text-gray-400">{currentUser.email}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 w-full pt-2">
            <Stat label="Batches" value={stats.batches} />
            <Stat label="Items" value={stats.items} />
            <Stat label="Claimed" value={stats.claimed} />
          </div>
        </section>

        {/* Sections */}
        <section className="surface-card divide-y divide-white/[0.05]">
          <Row href="/profile/account" icon={<UserCog size={18} />} label="Account details" />
          <Row href="/notifications" icon={<Bell size={18} />} label="Notifications" />
          <Row href="/profile/security" icon={<Shield size={18} />} label="Security & QR settings" />
          <Row href="/profile/help" icon={<HelpCircle size={18} />} label="Help & support" />
        </section>

        <Button asChild fullWidth variant="ghost" className="text-danger hover:text-red-300">
          <Link href="/">
            <LogOut size={18} /> Sign out
          </Link>
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

function Row({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-5 hover:bg-white/[0.02] transition"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05] text-gray-300">
        {icon}
      </span>
      <span className="flex-1 text-body text-white">{label}</span>
      <ChevronRight size={18} className="text-gray-500" />
    </Link>
  );
}
