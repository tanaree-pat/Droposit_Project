"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Check, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { MobileShell } from "@/components/layout/mobile-shell";
import { useAuth } from "@/lib/auth-context";
import { authApi } from "@/lib/api";

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [agreed, setAgreed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const mismatch = confirm.length > 0 && pw !== confirm;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || mismatch) return;
    setError(null);
    setLoading(true);
    try {
      await authApi.register({ full_name: fullName.trim(), email: email.trim(), password: pw });
      const user = await login(email.trim(), pw);
      router.replace(user.role === "staff" ? "/staff" : "/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      setLoading(false);
    }
  };

  return (
    <MobileShell>
      <section
        className="relative overflow-hidden rounded-b-[40px] px-6 pb-10 safe-top pt-5"
        style={{ background: "linear-gradient(170deg, #0d3320 0%, #0f4a2a 50%, #0b3a22 100%)" }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-12 h-56 w-56 rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(34,197,94,0.6), transparent)" }}
        />

        <div className="relative mt-4">
          <p className="text-h2 font-display text-white/85">Let&apos;s</p>
          <h1 className="text-display font-display text-white leading-[0.95]">
            Create Your<br />Account
          </h1>
          <p className="mt-3 text-small text-white/70 max-w-[34ch]">
            Set up your Droposit ID to start grouping items into batches.
          </p>
        </div>
      </section>

      <form onSubmit={submit} className="mx-5 -mt-6 surface-card p-6 flex flex-col gap-4">
        {error && (
          <p className="rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-small text-danger">
            {error}
          </p>
        )}
        <Field label="Full name" required>
          <Input
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            leadingIcon={<User size={18} />}
            required
          />
        </Field>
        <Field label="Email address" required>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leadingIcon={<Mail size={18} />}
            required
          />
        </Field>
        <Field label="Password" required hint="Use 8+ characters with letters and numbers.">
          <Input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            leadingIcon={<Lock size={18} />}
            required
          />
        </Field>
        <Field label="Confirm password" required error={mismatch ? "Passwords do not match" : undefined}>
          <Input
            type="password"
            placeholder="Retype password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            leadingIcon={<Lock size={18} />}
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

        <Button type="submit" fullWidth loading={loading} disabled={!agreed || mismatch || !fullName.trim()}>
          Sign up
        </Button>

        <p className="text-center text-small text-gray-400">
          Have an account?{" "}
          <Link href="/login" className="font-semibold text-primary-300">Sign in</Link>
        </p>
      </form>

      <div className="h-12" />
    </MobileShell>
  );
}
