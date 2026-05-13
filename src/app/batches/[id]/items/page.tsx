import { redirect } from "next/navigation";

/**
 * /batches/[id]/items always redirects to the batch detail view —
 * the detail already shows all items inline.
 */
export default async function ItemsIndex({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/batches/${id}`);
}
