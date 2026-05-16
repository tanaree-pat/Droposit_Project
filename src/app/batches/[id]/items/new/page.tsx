"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Camera, FileText, ImagePlus, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, TextArea, Field } from "@/components/ui/input";
import { MobileShell } from "@/components/layout/mobile-shell";
import { useRequireAuth } from "@/lib/auth-context";
import { batchesApi } from "@/lib/api";

export default function NewItemPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth("depositor");
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setError(null);
    setLoading(true);
    try {
      await batchesApi.addItem(parseInt(id), {
        name: title.trim(),
        description: desc.trim() || undefined,
        image: file,
      });
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add item");
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
            Create Your<br /> New Item
          </h1>
          <p className="mt-3 text-small text-white/70 max-w-[34ch]">
            Add a clear photo and a short description so it&apos;s unmistakable at retrieval.
          </p>
        </div>
      </section>

      <form onSubmit={submit} className="mx-5 -mt-6 surface-card p-6 flex flex-col gap-5">
        {error && (
          <p className="rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-small text-danger">{error}</p>
        )}
        <div className="relative mx-auto w-32 h-32">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="h-32 w-32 grid place-items-center rounded-full bg-gray-100/5 border-2 border-dashed border-white/15 text-gray-400 hover:border-primary-400 hover:text-primary-300 transition overflow-hidden"
            aria-label="Add photo"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Item preview" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <ImagePlus size={28} />
            )}
          </button>
          <span className="pointer-events-none absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full bg-primary-500 text-white shadow-glow">
            <Camera size={15} />
          </span>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />

        <Field label="Item name" required>
          <Input
            placeholder="e.g. Gold watch given by grandpa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            leadingIcon={<Tag size={18} />}
            required
          />
        </Field>
        <Field label="Description" hint="Helpful details: color, material, monogram, scratches.">
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
        <Button type="submit" fullWidth loading={loading} disabled={!title.trim()}>
          Add item
        </Button>
      </form>
      <div className="h-20" />
    </MobileShell>
  );
}
