"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, HelpCircle, LogOut, Shield, UserCog } from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { useRequireAuth, useAuth } from "@/lib/auth-context";

export default function StaffProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth("staff");
  const { logout } = useAuth();

  const handleLogout = () => { logout(); router.push("/login"); };
  const initials = user?.full_name.split(" ").map((n) => n[0]).join("") ?? "";

  if (authLoading || !user) return null;

  return (
    <MobileShell>
      <TopBar />
      <PageBody>
        <section className="surface-card p-6 flex flex-col items-center text-center gap-4"
          style={{ background: "radial-gradient(140% 80% at 50% 0%, rgba(182,127,75,0.18) 0%, transparent 50%), rgba(22,27,34,0.85)" }}
        >
          <div className="grid h-24 w-24 place-items-center rounded-full bg-secondary-500 text-white text-h2 font-display shadow-soft">
            {initials}
          </div>
          <div>
            <p className="text-caption uppercase tracking-wider text-secondary-300">
              <Shield size={12} className="inline mr-1 -mt-0.5" /> Staff operator
            </p>
            <h1 className="text-h2 font-display text-white mt-1">{user.full_name}</h1>
            <p className="text-small text-gray-400">{user.email}</p>
          </div>
          <span className="rounded-full bg-white/[0.05] border border-white/[0.06] px-3 py-1 text-caption text-gray-300">
            Checkpoint A
          </span>
        </section>

        <section className="surface-card divide-y divide-white/[0.05]">
          <Row href="/staff/profile/details" icon={<UserCog size={18} />} label="Account details" />
          <Row href="/staff/profile/permissions" icon={<Shield size={18} />} label="Permissions" />
          <Row href="/staff/profile/help" icon={<HelpCircle size={18} />} label="Help & support" />
        </section>

        <Button fullWidth variant="ghost" className="text-danger hover:text-red-300" onClick={handleLogout}>
          <LogOut size={18} /> Sign out
        </Button>
      </PageBody>
      <BottomNav role="staff" />
    </MobileShell>
  );
}

function Row({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-5 hover:bg-white/[0.02] transition">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05] text-gray-300">{icon}</span>
      <span className="flex-1 text-body text-white">{label}</span>
      <ChevronRight size={18} className="text-gray-500" />
    </Link>
  );
}
