"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Keyboard } from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Segmented } from "@/components/ui/segmented";
import { QRScanner } from "@/components/qr/qr-scanner";
import { Sheet } from "@/components/ui/sheet";
import { Input, Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Staff scan screen — the central operational workflow.
 *  - Tabs: Deposit | Checkout (mirrors mockup)
 *  - QR scanner streams live preview with reticle + scan line
 *  - Manual entry fallback in a sheet for damaged or unreadable codes
 *
 * After detection, navigates to the user's batch list scoped to that
 * action so staff can verify and confirm.
 */
type Mode = "deposit" | "checkout";

export default function StaffScanPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<Mode>("deposit");
  const [manualOpen, setManualOpen] = React.useState(false);
  const [code, setCode] = React.useState("");

  const handleResult = React.useCallback(
    (value: string) => {
      // Parse droposit://scan/{qr_token} — strip protocol prefix if present
      const token = value.startsWith("droposit://scan/")
        ? value.slice("droposit://scan/".length)
        : value.trim();
      router.push(`/staff/scan/result?token=${encodeURIComponent(token)}`);
    },
    [router]
  );

  return (
    <MobileShell>
      <TopBar back title={mode === "deposit" ? "Deposit item" : "Checkout item"} />
      <PageBody>
        <section className="flex flex-col gap-3">
          <h1 className="text-h1 font-display text-white">
            {mode === "deposit" ? "Deposit item" : "Checkout item"}
          </h1>
          <Segmented<Mode>
            options={[
              { value: "deposit", label: "Deposit" },
              { value: "checkout", label: "Checkout" },
            ]}
            value={mode}
            onChange={setMode}
            tone="warm"
          />
        </section>

        <QRScanner mode={mode} onResult={handleResult} />

        <p className="text-small text-gray-400 text-center max-w-[34ch] mx-auto">
          Use camera to scan QR codes in order to {mode === "deposit" ? "deposit" : "retrieve"} item(s).
        </p>

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
              placeholder="e.g. DRP-A1B2-C3D4"
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
