import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listGodGyms } from "@/lib/server/god";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/god/gyms")({ component: Gyms });

function Gyms() {
  const [q, setQ] = useState("");
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState("");
  const list = useQuery({
    queryKey: ["god-gyms", q, plan, status],
    queryFn: () => listGodGyms({ data: { q, plan: plan || undefined, status: status || undefined } }),
  });
  return (
    <div>
      <h1 className="font-display text-3xl">Gyms</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <Input className="max-w-xs" placeholder="Search name, city, slug" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="h-11 rounded-md border border-border bg-surface px-3 text-sm" value={plan} onChange={(e) => setPlan(e.target.value)}>
          <option value="">All plans</option>
          <option value="starter">Starter</option>
          <option value="growth">Growth</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <select className="h-11 rounded-md border border-border bg-surface px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="trial">Trial</option>
          <option value="active">Active</option>
          <option value="past_due">Past due</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      <Card className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[48rem] text-left text-sm">
          <thead className="border-b border-border text-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Gym</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Members</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last login</th>
            </tr>
          </thead>
          <tbody>
            {(list.data ?? []).map((r) => (
              <tr key={r.gym?.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <Link to="/god/gyms/$id" params={{ id: r.gym!.id }} className="font-medium text-primary">
                    {r.gym?.name}
                  </Link>
                  <p className="text-xs text-text-muted">{r.gym?.phone}</p>
                </td>
                <td className="px-4 py-3">{r.gym?.city}</td>
                <td className="px-4 py-3 capitalize">{r.gym?.plan}</td>
                <td className="px-4 py-3 tabular-nums">
                  {r.members_used} / {r.gym?.member_cap}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={r.gym?.subscription_status === "active" ? "default" : r.gym?.subscription_status === "suspended" ? "danger" : "warn"}>
                    {r.gym?.subscription_status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-text-muted">{formatDate(r.last_login)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
