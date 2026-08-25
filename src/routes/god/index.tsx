import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getGodOverview } from "@/lib/server/god";
import { Card } from "@/components/ui/card";
import { inr } from "@/lib/utils";

export const Route = createFileRoute("/god/")({ component: Overview });

function Overview() {
  const q = useQuery({ queryKey: ["god-overview"], queryFn: () => getGodOverview() });
  const d = q.data;
  const tiles = [
    { label: "Gyms", value: d?.gyms ?? 0, to: "/god/gyms" },
    { label: "Active", value: d?.active ?? 0, to: "/god/gyms" },
    { label: "Suspended", value: d?.suspended ?? 0, to: "/god/gyms" },
    { label: "Monthly recurring", value: inr(d?.mrr ?? 0), to: "/god/settings" },
    { label: "Near member cap", value: d?.nearCap ?? 0, to: "/god/gyms" },
    { label: "Signups this month", value: d?.signupsThisMonth ?? 0, to: "/god/gyms" },
    { label: "Payments awaiting", value: d?.pendingPayments ?? 0, to: "/god/payments" },
  ];
  return (
    <div>
      <h1 className="font-display text-3xl">Overview</h1>
      <p className="mt-1 text-sm text-text-muted">The business, not a single gym.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to}>
            <Card className="p-5 hover:border-primary">
              <p className="label-caps">{t.label}</p>
              <p className="mt-2 font-display text-3xl tabular-nums">{t.value}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
