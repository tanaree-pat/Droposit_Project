"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowDownToLine, Lock, MoreHorizontal, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileShell } from "@/components/layout/mobile-shell";

/**
 * Login screen — follows the mockup structure (logo block, two inputs,
 * forgot password, sign-in CTA, secondary "create an account") but uses
 * the dark/emerald design system instead of the mockup's flat green.
 */
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulated auth — depositor home.
    setTimeout(() => router.push("/home"), 700);
  };

  return (
    <MobileShell>
      <div className="relative flex-1 flex flex-col">
        {/* Hero block with logo mark */}
        <section
          className="relative overflow-hidden rounded-b-[40px] pt-6 pb-12 px-6"
          style={{
            background: "linear-gradient(170deg, #14532d 0%, #0f4a2a 60%, #0b3a22 100%)",
          }}
        >
          <div className="flex items-center justify-between text-white">
            <MoreHorizontal size={22} />
          </div>

          <div className="mt-6 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative grid h-40 w-40 place-items-center rounded-full bg-white/[0.08] backdrop-blur-glass border border-white/15 shadow-floating"
            >
              <div
                aria-hidden
                className="absolute inset-3 rounded-full bg-gradient-to-b from-white/30 to-white/5"
              />
              <div className="relative grid h-20 w-20 place-items-center rounded-xl border-2 border-primary-300 bg-white/10 text-primary-300">
                <Lock size={32} strokeWidth={1.75} />
                <ArrowDownToLine
                  size={20}
                  className="absolute -top-9 left-1/2 -translate-x-1/2 text-primary-300"
                />
              </div>
            </motion.div>
            <h1 className="mt-8 text-h1 font-display tracking-[0.12em] text-white">DROPOSIT</h1>
            <p className="mt-1 text-small text-white/70">
              Welcome back. Sign in to manage your deposits.
            </p>
          </div>
        </section>

        {/* Form panel */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          onSubmit={submit}
          className="-mt-6 mx-5 surface-card p-6 flex flex-col gap-4"
        >
          <Input
            type="email"
            placeholder="Email or phone"
            leadingIcon={<User size={18} />}
            autoComplete="email"
            required
          />
          <Input
            type="password"
            placeholder="Password"
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
        </motion.form>

        <div className="flex-1" />
        <p className="px-6 pb-8 pt-4 text-center text-caption text-gray-500">
          By continuing you agree to our{" "}
          <Link href="#" className="underline text-gray-400">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline text-gray-400">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </MobileShell>
  );
}
