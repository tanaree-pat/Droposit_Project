"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { FileText, Tag } from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Input, TextArea, Field } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequireAuth } from "@/lib/auth-context";
import { batchesApi } from "@/lib/api";

export default function EditItemPage() {
  const router = useRouter();
  const { id, itemId } = useParams<{ id: string; itemId: string }>();
  const { user, loading: authLoading } = useRequireAuth("depositor");
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);
  const [notFound404, setNotFound404] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) return;
    batchesApi.get(parseInt(id))
      .then((batch) => {
        const item = batch.items.find((i) => i.id === itemId);
        if (!item) { setNotFound404(true); return; }
        setTitle(item.title);
        setDesc(item.description);
      })
      .catch(() => setNotFound404(true))
      .finally(() => setFetching(false));
  }, [user, id, itemId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await batchesApi.editItem(parseInt(id), parseInt(itemId), { name: title.trim(), description: desc.trim() });
      router.push(`/batches/${id}/items/${itemId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setLoading(false);
    }
  };

  if (authLoading || !user) return null;
  if (notFound404) notFound();

  return (
    <MobileShell>
      <TopBar back title="Edit item" />
      <PageBody>
        {fetching ? (
          <>
            <Skeleton className="h-12 w-full rounded-full" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-5">
            {error && (
              <p className="rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-small text-danger">{error}</p>
            )}
            <Field label="Item name" required>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                leadingIcon={<Tag size={18} />}
                required
              />
            </Field>
            <Field label="Description">
              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center gap-2 text-small text-gray-400">
                  <FileText size={16} /> Description
                </span>
                <TextArea value={desc} onChange={(e) => setDesc(e.target.value)} rows={6} />
              </div>
            </Field>
            <div className="flex flex-col gap-3">
              <Button type="submit" fullWidth loading={loading}>Save changes</Button>
              <Button asChild fullWidth variant="ghost">
                <Link href={`/batches/${id}/items/${itemId}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        )}
      </PageBody>
    </MobileShell>
  );
}
