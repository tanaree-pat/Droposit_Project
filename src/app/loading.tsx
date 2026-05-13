import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Global route loading skeleton — used by the App Router whenever a
 * route's data is being prepared. Mirrors the visual rhythm of a list
 * page so transitions feel intentional rather than abrupt.
 */
export default function Loading() {
  return (
    <MobileShell>
      <div className="pt-8 px-5">
        <Skeleton className="h-11 w-2/3 rounded-md" />
        <Skeleton className="mt-3 h-4 w-1/2 rounded-md" />
      </div>
      <PageBody className="mt-2">
        <Skeleton className="h-12 w-full rounded-full" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 shrink-0 rounded-full" />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      </PageBody>
    </MobileShell>
  );
}
