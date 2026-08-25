import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getOverview } from "@/lib/server/admin";
import { PageHeader } from "@/components/admin/shell";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/")({ component: Overview });

function Overview() {
  const q = useQuery({ queryKey: ["overview"], queryFn: () => getOverview() });
  if (q.isPending) return <Skeleton className="h-40" />;
  const d = q.data;
  if (!d?.gym) return <p>No gym loaded.</p>;
  const pct = d.cap ? Math.round((d.used / d.cap) * 100) : 0;
  const hot = pct >= 80;
  const kpis = [
    { label: "Members", value: d.used, to: "/admin/members" },
    { label: "Pending signups", value: d.pending, to: "/admin/signups" },
    { label: "Renewals (7d)", value: d.renewals, to: "/admin/renewals" },
    { label: "Checked in today", value: d.checkinsToday, to: "/admin/checkins" },
    { label: "New enquiries", value: d.enquiries, to: "/admin/enquiries" },
    { label: "Red list", value: d.redList, to: "/admin/red-list" },
  ];
  return (
    <div>
      <PageHeader
        title="Overview"
        hint={`${d.gym.name} · ${d.gym.plan} plan`}
        action={
          <Button asChild variant="outline" size="sm">
            <Link to="/g/$slug" params={{ slug: d.gym.slug }}>
              Public page
            </Link>
          </Button>
        }
      />
      <Card className="mb-6 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">
            <span className="tabular-nums">{d.used}</span> / {d.cap} members used
          </p>
          <span className="label-caps">{pct}%</span>
        </div>
        <Progress value={pct} className="mt-3" barClassName={hot ? "bg-accent-clay" : undefined} />
        {hot ? (
          <p className="mt-3 text-sm text-accent-clay">
            You are over 80% of capacity.{" "}
            <Link to="/admin/settings" className="font-medium underline">
              Upgrade
            </Link>{" "}
            before the next walk-in is turned away.
          </p>
        ) : null}
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k) => (
          <Link key={k.label} to={k.to}>
            <Card className="p-5 hover:border-primary">
              <p className="label-caps">{k.label}</p>
              <p className="mt-2 font-display text-4xl tabular-nums">{k.value}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
