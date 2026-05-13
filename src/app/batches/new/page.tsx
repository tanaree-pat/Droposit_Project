"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FileText, Tag, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, TextArea, Field } from "@/components/ui/input";
import { MobileShell } from "@/components/layout/mobile-shell";

/**
 * Create new batch — matches the mockup's "Let's Create Your New Batch"
 * hero pattern. Two fields: name + description. Single primary action.
 */
export default function NewBatchPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    // Optimistic — in production this returns the new batch id; for the
    // prototype we route into the first batch where users can add items.
    setTimeout(() => router.push("/batches/b_001"), 500);
  };

  return (
    <MobileShell>
      <header className="flex items-center justify-between px-5 pt-5 safe-top">
        <span aria-hidden className="text-white">•••</span>
        <Link
          href="/batches"
          aria-label="Close"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-white hover:bg-white/[0.1] transition"
        >
          <X size={18} />
        </Link>
      </header>

      <section
        className="relative -mt-3 rounded-b-[40px] px-6 pt-6 pb-10"
        style={{
          background: "linear-gradient(170deg, #14532d 0%, #0f4a2a 60%, #0b3a22 100%)",
        }}
      >
        <p className="text-h2 font-display text-white/85">Let&apos;s</p>
        <h1 className="text-display font-display text-white leading-[0.95]">
          Create Your
          <br /> New Batch
        </h1>
        <p className="mt-3 text-small text-white/70 max-w-[34ch]">
          Group items that you intend to deposit together so they can travel as one record.
        </p>
      </section>

      <form onSubmit={submit} className="mx-5 -mt-6 surface-card p-6 flex flex-col gap-5">
        <Field label="Batch name" required>
          <Input
            placeholder="e.g. Exam day essentials"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leadingIcon={<Tag size={18} />}
            required
          />
        </Field>
        <Field
          label="Description"
          hint="What's inside? Include color, materials, or anything distinctive."
        >
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-small text-gray-400">
              <FileText size={16} /> Description
            </span>
            <TextArea
              placeholder="Enter description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={5}
            />
          </div>
        </Field>

        <Button type="submit" fullWidth loading={loading} disabled={!name.trim()}>
          Create batch
        </Button>
      </form>

      <div className="h-20" />
    </MobileShell>
  );
}
