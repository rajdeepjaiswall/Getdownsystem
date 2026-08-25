import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMemberHome } from "@/lib/server/member";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/app/")({ component: Home });

function daysLeft(ends: string | null | undefined) {
  if (!ends) return null;
  const end = new Date(ends);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((end.getTime() - today.getTime()) / 86400000);
}

function Home() {
  const q = useQuery({ queryKey: ["member-home"], queryFn: () => getMemberHome() });
  if (q.isPending) return <p className="text-sm text-text-muted">Loading…</p>;
  if (q.error) return <p className="text-sm text-danger">{(q.error as Error).message}</p>;
  const d = q.data;
  const left = daysLeft(d?.subscription ? String(d.subscription.ends_on) : null);
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">{String(d?.member?.full_name ?? "Welcome")}</h1>
      <Card className="p-5">
        <p className="label-caps">Membership</p>
        <p className="mt-1 font-medium">{String(d?.subscription?.plan_name ?? "No plan assigned")}</p>
        <p className="mt-3 font-display text-5xl tabular-nums" style={{ color: d?.gym?.brand_color }}>
          {left == null ? "—" : left}
        </p>
        <p className="text-sm text-text-muted">days remaining</p>
      </Card>
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="label-caps">Streak</p>
          <p className="mt-1 font-display text-3xl tabular-nums">{d?.streak ?? 0}</p>
          <p className="text-xs text-text-muted">days</p>
        </Card>
        <Card className="p-4">
          <p className="label-caps">Check-ins</p>
          <p className="mt-1 font-display text-3xl tabular-nums">{d?.checkinCount ?? 0}</p>
          <p className="text-xs text-text-muted">all time</p>
        </Card>
      </div>
    </div>
  );
}
