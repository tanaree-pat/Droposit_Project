"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileShell } from "@/components/layout/mobile-shell";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      router.replace(user.role === "staff" ? "/staff" : "/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
          <h1 className="text-display font-display text-white leading-[0.95]">
            Sign in to<br />Droposit
          </h1>
          <p className="mt-3 text-small text-white/70 max-w-[34ch]">
            Manage your deposits and track your items across every checkpoint.
          </p>
        </div>
      </section>

      <form onSubmit={submit} className="mx-5 -mt-6 surface-card p-6 flex flex-col gap-4">
        {error && (
          <p className="rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-small text-danger">
            {error}
          </p>
        )}
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leadingIcon={<User size={18} />}
          autoComplete="email"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leadingIcon={<Lock size={18} />}
          autoComplete="current-password"
          required
        />
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-small text-primary-300 hover:text-primary-200 transition"
          >
            Forgot password?
          </Link>
        </div>
        <Button type="submit" fullWidth loading={loading}>
          Login
        </Button>

        <div className="flex items-center gap-3 my-1">
          <span className="divider-soft flex-1" />
          <span className="text-caption text-gray-500">or</span>
          <span className="divider-soft flex-1" />
        </div>

        <Button asChild fullWidth variant="secondary">
          <Link href="/signup">Create an account</Link>
        </Button>
      </form>

      <div className="flex-1" />
      <p className="px-6 pb-8 pt-4 text-center text-caption text-gray-500">
        By continuing you agree to our{" "}
        <Link href="#" className="underline text-gray-400">Terms</Link>{" "}
        and{" "}
        <Link href="#" className="underline text-gray-400">Privacy Policy</Link>.
      </p>
    </MobileShell>
  );
}
