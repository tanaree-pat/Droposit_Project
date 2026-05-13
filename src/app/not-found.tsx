import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";

/**
 * 404 — minimal, branded, with two routes back (home + login).
 */
export default function NotFound() {
  return (
    <MobileShell>
      <PageBody className="items-center justify-center text-center gap-6 pt-20">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 shadow-glow">
          <Compass size={32} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-h1 font-display text-white">Page not found</h1>
          <p className="mt-2 max-w-[30ch] text-small text-gray-400">
            We couldn&apos;t find that screen. It may have moved or been retired.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button asChild fullWidth>
            <Link href="/home">Go to home</Link>
          </Button>
          <Button asChild fullWidth variant="ghost">
            <Link href="/">Back to landing</Link>
          </Button>
        </div>
      </PageBody>
    </MobileShell>
  );
}
