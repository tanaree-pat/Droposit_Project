"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { MobileShell } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";

/**
 * Signup — multi-field create-account flow that respects the mockup's
 * "Let's Create Your Account" hero pattern, restyled to the dark system.
 */
export default function SignUpPage() {
  const router = useRouter();
  const [agreed, setAgreed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [pw, setPw] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const mismatch = confirm.length > 0 && pw !== confirm;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || mismatch) return;
    setLoading(true);
    setTimeout(() => router.push("/home"), 700);
  };

  return (
    <MobileShell>
      <TopBar back={{ href: "/login" }} rightAction={<span aria-hidden className="w-11" />} />
      <section
        className="relative -mt-[60px] rounded-b-[40px] px-6 pt-20 pb-10"
        style={{
          background: "linear-gradient(170deg, #14532d 0%, #0f4a2a 60%, #0b3a22 100%)",
        }}
      >
        <p className="text-h2 font-display text-white/85">Let&apos;s</p>
        <h1 className="text-display font-display text-white leading-[0.95]">
          Create Your
          <br />
          Account
        </h1>
        <p className="mt-3 text-small text-white/70 max-w-[34ch]">
          Set up your Droposit ID to start grouping items into batches.
        </p>
      </section>

      <form onSubmit={submit} className="mx-5 -mt-6 surface-card p-6 flex flex-col gap-4">
        <Field label="Full name" required>
          <Input placeholder="Full name" leadingIcon={<User size={18} />} required />
        </Field>
        <Field label="Email address" required>
          <Input
            type="email"
            placeholder="you@droposit.app"
            leadingIcon={<Mail size={18} />}
            required
          />
        </Field>
        <Field label="Password" required hint="Use 8+ characters with letters and numbers.">
          <Input
            type="password"
            placeholder="Password"
            leadingIcon={<Lock size={18} />}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
          />
        </Field>
        <Field label="Confirm password" required error={mismatch ? "Passwords do not match" : undefined}>
          <Input
            type="password"
            placeholder="Retype password"
            leadingIcon={<Lock size={18} />}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            invalid={mismatch}
            required
          />
        </Field>

        <label className="mt-1 flex items-start gap-3 cursor-pointer text-small text-gray-300">
          <span
            role="checkbox"
            aria-checked={agreed}
            tabIndex={0}
            onClick={() => setAgreed((v) => !v)}
            onKeyDown={(e) => (e.key === " " || e.key === "Enter") && setAgreed((v) => !v)}
            className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
              agreed
                ? "bg-primary-500 border-primary-500 shadow-glow"
                : "border-white/25 bg-white/[0.04]"
            }`}
          >
            {agreed && <Check size={14} className="text-white" />}
          </span>
          I agree to the{" "}
          <Link href="#" className="font-semibold text-white underline-offset-2 underline">
            Terms &amp; Privacy
          </Link>
        </label>

        <Button type="submit" fullWidth loading={loading} disabled={!agreed || mismatch}>
          Sign up
        </Button>

        <p className="text-center text-small text-gray-400">
          Have an account?{" "}
          <Link href="/login" className="font-semibold text-primary-300">
            Sign in
          </Link>
        </p>
      </form>

      <div className="h-12" />
    </MobileShell>
  );
}
