"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Keyboard } from "lucide-react";
import { useRequireAuth } from "@/lib/auth-context";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { QRScanner } from "@/components/qr/qr-scanner";
import { Sheet } from "@/components/ui/sheet";
import { Input, Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StaffScanPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth("staff");
  const [manualOpen, setManualOpen] = React.useState(false);
  const [code, setCode] = React.useState("");

  if (authLoading || !user) return null;

  const handleResult = React.useCallback(
    (value: string) => {
      const token = value.startsWith("droposit://scan/")
        ? value.slice("droposit://scan/".length)
        : value.trim();
      router.push(`/staff/scan/result?token=${encodeURIComponent(token)}`);
    },
    [router]
  );

  return (
    <MobileShell>
      <TopBar back title="Scan QR" rightAction={<></>} />
      <PageBody>
        <section className="flex flex-col gap-2">
          <h1 className="text-h1 font-display text-white">Scan QR</h1>
          <p className="text-small text-gray-400">
            Point the camera at any depositor&apos;s QR code to deposit or retrieve their batch.
          </p>
        </section>

        <QRScanner onResult={handleResult} />

        <Button variant="secondary" size="md" onClick={() => setManualOpen(true)}>
          <Keyboard size={16} /> Enter code manually
        </Button>
      </PageBody>

      <Sheet
        open={manualOpen}
        onOpenChange={setManualOpen}
        title="Manual entry"
        description="Type the depositor's verification code printed below their QR."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setManualOpen(false);
            handleResult(code);
          }}
          className="flex flex-col gap-4 pt-2"
        >
          <Field label="Verification code" required>
            <Input
              placeholder="e.g. drp-a1b2c3d4"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </Field>
          <Button type="submit" fullWidth disabled={!code.trim()}>
            Continue
          </Button>
        </form>
      </Sheet>

      <BottomNav role="staff" />
    </MobileShell>
  );
}
