import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listLeads, updateLead } from "@/lib/server/god";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/god/leads")({ component: Leads });

function Leads() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["leads"], queryFn: () => listLeads() });
  const mut = useMutation({
    mutationFn: updateLead,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["leads"] }),
  });
  return (
    <div>
      <h1 className="font-display text-3xl">Leads</h1>
      <p className="mt-1 text-sm text-text-muted">Marketing contact form.</p>
      <div className="mt-6 grid gap-3">
        {(q.data ?? []).map((l) => (
          <Card key={String(l.id)} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">
                  {String(l.gym_name)} · {String(l.owner_name)}
                </p>
                <p className="text-sm text-text-muted">
                  {String(l.phone ?? "")} · {String(l.city ?? "")} · {l.member_count ?? "?"} members
                </p>
                <p className="mt-2 text-sm">{String(l.message ?? "")}</p>
              </div>
              <Badge>{String(l.status)}</Badge>
            </div>
            <div className="mt-3 flex gap-2">
              <select
                className="h-11 rounded-md border border-border bg-surface px-3 text-sm"
                defaultValue={String(l.status)}
                onChange={(e) => mut.mutate({ data: { id: String(l.id), status: e.target.value } })}
              >
                <option value="new">new</option>
                <option value="open">open</option>
                <option value="won">won</option>
                <option value="lost">lost</option>
              </select>
              <Input
                defaultValue={String(l.notes ?? "")}
                placeholder="Notes"
                onBlur={(e) => mut.mutate({ data: { id: String(l.id), notes: e.target.value } })}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
