import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { approveMember, listMembers, listPlans, rejectMember } from "@/lib/server/admin";
import { useSessionContext } from "@/components/role-gate";

export const Route = createFileRoute("/admin/signups")({ component: Signups });

function Signups() {
  const qc = useQueryClient();
  const { ctx } = useSessionContext();
  const members = useQuery({
    queryKey: ["members", "pending"],
    queryFn: () => listMembers({ data: { status: "pending" } }),
  });
  const plans = useQuery({ queryKey: ["plans"], queryFn: () => listPlans() });
  const approve = useMutation({
    mutationFn: approveMember,
    onSuccess: () => {
      toast.success("Approved");
      void qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const reject = useMutation({
    mutationFn: rejectMember,
    onSuccess: () => {
      toast.success("Removed");
      void qc.invalidateQueries();
    },
  });
  const joinUrl =
    typeof window !== "undefined" && ctx?.gym
      ? `${window.location.origin}/g/${ctx.gym.slug}/join`
      : "";

  return (
    <div>
      <PageHeader
        title="Signups"
        hint="People who filled the phone form. Approve to make them a member — this counts against your cap."
      />
      {joinUrl ? (
        <Card className="mb-4 p-4 text-sm">
          <p className="label-caps">Share this link or QR</p>
          <p className="mt-1 break-all font-mono text-xs">{joinUrl}</p>
          <img
            alt="Signup QR"
            className="mt-3 h-36 w-36"
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(joinUrl)}`}
          />
        </Card>
      ) : null}
      <div className="grid gap-3">
        {(members.data ?? []).map((m) => (
          <Card key={String(m.id)} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium">{String(m.full_name)}</p>
              <p className="text-sm text-text-muted">
                {String(m.phone ?? "")} {m.email ? `· ${String(m.email)}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="warn">pending</Badge>
              <select
                className="h-11 rounded-md border border-border bg-surface px-3 text-sm"
                defaultValue={plans.data?.[0]?.id ?? ""}
                id={`plan-${String(m.id)}`}
              >
                {(plans.data ?? []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                onClick={() => {
                  const sel = document.getElementById(`plan-${String(m.id)}`) as HTMLSelectElement | null;
                  approve.mutate({ data: { id: String(m.id), plan_id: sel?.value } });
                }}
              >
                Approve
              </Button>
              <Button size="sm" variant="ghost" onClick={() => reject.mutate({ data: { id: String(m.id) } })}>
                Reject
              </Button>
            </div>
          </Card>
        ))}
        {members.data?.length === 0 ? (
          <p className="text-sm text-text-muted">No pending signups. Share the link above — it is how a 200-name register actually gets in.</p>
        ) : null}
      </div>
    </div>
  );
}
