"use client";

import * as React from "react";
import Link from "next/link";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { MobileShell } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { motion } from "framer-motion";

/**
 * Forgot password — single-field reset flow with a soft, calm tone
 * (reset emails are stressful; design tries to reduce anxiety).
 */
export default function ForgotPasswordPage() {
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  };

  return (
    <MobileShell>
      <TopBar back={{ href: "/login" }} rightAction={<span className="w-11" />} />

      <section className="flex flex-col items-center text-center px-6 pt-2 pb-10">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid h-20 w-20 place-items-center rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 shadow-glow"
        >
          <Lock size={32} strokeWidth={1.75} />
        </motion.div>
        <h1 className="mt-6 text-h1 font-display text-white">Forgot Password?</h1>
        <p className="mt-2 max-w-[30ch] text-small text-gray-400">
          No worries. Enter your email and we&apos;ll send reset instructions.
        </p>
      </section>

      <form onSubmit={submit} className="mx-5 surface-card p-6 flex flex-col gap-5">
        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-primary-500/15 text-primary-400">
              <Mail size={22} />
            </div>
            <p className="text-body font-semibold text-white">Check your inbox</p>
            <p className="mt-1 text-small text-gray-400">
              We sent reset instructions to your email.
            </p>
          </motion.div>
        ) : (
          <>
            <Field label="Email" required>
              <Input
                type="email"
                placeholder="Enter your email"
                leadingIcon={<Mail size={18} />}
                required
              />
            </Field>
            <Button type="submit" fullWidth loading={loading}>
              Reset password
            </Button>
          </>
        )}

        <Link
          href="/login"
          className="mx-auto inline-flex items-center gap-2 text-small text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>
      </form>
    </MobileShell>
  );
}
