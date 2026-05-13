import Link from "next/link";
import { Bell, CheckCheck, PackageCheck, PackageOpen, Sparkles } from "lucide-react";
import { MobileShell, PageBody } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { notifications } from "@/lib/mock-data";
import { formatRelative } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

const iconForType: Record<string, React.ReactNode> = {
  deposit: <PackageOpen size={18} />,
  retrieval: <PackageCheck size={18} />,
  system: <Sparkles size={18} />,
};

/**
 * Notification timeline — soft cards grouped by date affinity.
 * Unread items carry a left primary stripe.
 */
export default function NotificationsPage() {
  return (
    <MobileShell>
      <TopBar back title="Notifications" rightAction={
        <button
          aria-label="Mark all as read"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.06] text-white hover:bg-white/[0.1] transition"
        >
          <CheckCheck size={18} />
        </button>
      } />
      <PageBody>
        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell size={24} />}
            title="No notifications yet"
            description="You'll see deposit, retrieval, and account updates here."
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`relative surface-card p-4 pl-5 ${n.read ? "" : "border-primary-400/30"}`}
              >
                {!n.read && (
                  <span className="absolute left-0 top-4 bottom-4 w-1 rounded-r bg-primary-500 shadow-glow" />
                )}
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/15 text-primary-300">
                    {iconForType[n.type]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-body font-semibold text-white truncate">{n.title}</p>
                      <span className="text-caption text-gray-500 shrink-0">
                        {formatRelative(n.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1 text-small text-gray-400">{n.message}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 text-center text-caption text-gray-500">
          <Link href="/profile" className="text-primary-300 hover:text-primary-200">
            Manage notification preferences →
          </Link>
        </p>
      </PageBody>
      <BottomNav role="depositor" />
    </MobileShell>
  );
}
