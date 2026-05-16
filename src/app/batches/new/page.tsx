"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FileText, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, TextArea, Field } from "@/components/ui/input";
import { MobileShell } from "@/components/layout/mobile-shell";
import { useRequireAuth } from "@/lib/auth-context";
import { batchesApi } from "@/lib/api";

export default function NewBatchPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth("depositor");
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const batch = await batchesApi.create({ name: name.trim(), description: desc.trim() || undefined });
      router.replace(`/batches/${batch.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create batch");
      setLoading(false);
    }
  };

  if (authLoading || !user) return null;

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

        <div className="relative flex justify-end">
          <button
            type="button"
            aria-label="Close"
            onClick={() => router.back()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.10] text-white hover:bg-white/[0.18] transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative mt-4">
          <p className="text-h2 font-display text-white/85">Let&apos;s</p>
          <h1 className="text-display font-display text-white leading-[0.95]">
            Create Your<br /> New Batch
          </h1>
          <p className="mt-3 text-small text-white/70 max-w-[34ch]">
            Group items that you intend to deposit together so they can travel as one record.
          </p>
        </div>
      </section>

      <form onSubmit={submit} className="mx-5 -mt-6 surface-card p-6 flex flex-col gap-5">
        {error && (
          <p className="rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-small text-danger">{error}</p>
        )}
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
