import Link from "next/link";
import { ArrowRight, Box, ScanLine, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileShell } from "@/components/layout/mobile-shell";

/**
 * Splash / landing — a brief brand moment before login. Doubles as a
 * marketing touchpoint on desktop preview.
 */
export default function LandingPage() {
  return (
    <MobileShell>
      <div className="relative flex-1 flex flex-col safe-top">
        {/* Decorative gradient orb */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(34,197,94,0.6), transparent)" }}
        />

        <header className="flex items-center justify-between px-5 pt-6">
          <span className="inline-flex items-center gap-2 text-white font-semibold tracking-tight">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 shadow-glow">
              <Box size={18} className="text-white" />
            </span>
            Droposit
          </span>
        </header>

        <main className="flex-1 flex flex-col justify-center px-6 gap-8">
          <div>
            <h1 className="mt-5 text-display font-display text-white text-balance leading-[1.05]">
              Deposit.
              <br />
              <span className="text-primary-400">Retrieve.</span>
              <br />
              Effortlessly.
            </h1>
            <p className="mt-5 max-w-[32ch] text-body text-gray-400">
              The premium QR-powered system that replaces paper tickets at
              checkpoints. Track every item across three clear stages.
            </p>
          </div>

          <ul className="flex flex-col gap-3">
            <Feature
              icon={<ScanLine size={18} />}
              title="QR check-in and retrieval"
              desc="One scan to deposit, one scan to claim."
            />
            <Feature
              icon={<Box size={18} />}
              title="Batch your belongings"
              desc="Group items into named batches with descriptions."
            />
            <Feature
              icon={<ShieldCheck size={18} />}
              title="Operationally accountable"
              desc="Every state change recorded for staff and depositor."
            />
          </ul>

          <div className="flex flex-col gap-3 pt-2">
            <Button asChild fullWidth>
              <Link href="/login">
                Get started <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild fullWidth variant="ghost">
              <Link href="/staff">I am staff</Link>
            </Button>
          </div>
        </main>

        <footer className="px-6 pb-8 pt-6 text-center text-caption text-gray-500">
          © 2026 Droposit
        </footer>
      </div>
    </MobileShell>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <li className="flex items-start gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-4">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500/15 text-primary-300">
        {icon}
      </span>
      <div>
        <p className="text-body font-semibold text-white">{title}</p>
        <p className="text-small text-gray-400">{desc}</p>
      </div>
    </li>
  );
}
