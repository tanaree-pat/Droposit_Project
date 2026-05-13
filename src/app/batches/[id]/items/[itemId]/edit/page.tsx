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
import { batches } from "@/lib/mock-data";

/**
 * Edit item — same form layout as the new-item screen but pre-filled
 * with current values. Per the proposal: title and description can be
 * edited at any time prior to deposit.
 */
export default function EditItemPage() {
  const router = useRouter();
  const { id, itemId } = useParams<{ id: string; itemId: string }>();
  const batch = batches.find((b) => b.id === id);
  const item = batch?.items.find((i) => i.id === itemId);
  if (!batch || !item) notFound();

  const [title, setTitle] = React.useState(item.title);
  const [desc, setDesc] = React.useState(item.description);
  const [loading, setLoading] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push(`/batches/${id}/items/${itemId}`), 500);
  };

  return (
    <MobileShell>
      <TopBar back title="Edit item" />
      <PageBody>
        <form onSubmit={submit} className="flex flex-col gap-5">
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
              <TextArea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={6}
              />
            </div>
          </Field>
          <div className="flex flex-col gap-3">
            <Button type="submit" fullWidth loading={loading}>
              Save changes
            </Button>
            <Button asChild fullWidth variant="ghost">
              <Link href={`/batches/${id}/items/${itemId}`}>Cancel</Link>
            </Button>
          </div>
        </form>
      </PageBody>
    </MobileShell>
  );
}
