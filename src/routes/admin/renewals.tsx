import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { listRenewals, renewSubscription } from "@/lib/server/admin";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/admin/renewals")({ component: Renewals });

function Renewals() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["renewals"], queryFn: () => listRenewals() });
  const mut = useMutation({
    mutationFn: renewSubscription,
    onSuccess: () => {
      toast.success("Renewed");
      void qc.invalidateQueries({ queryKey: ["renewals"] });
    },
  });
  return (
    <div>
      <PageHeader title="Renewals due" hint="Active memberships ending in the next 14 days." />
      <div className="grid gap-3">
        {(q.data ?? []).map((r) => (
          <Card key={String(r.id)} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium">{String(r.full_name)}</p>
              <p className="text-sm text-text-muted">
                {String(r.plan_name ?? "Plan")} · ends {formatDate(String(r.ends_on))} · {String(r.phone ?? "")}
              </p>
            </div>
            <Button size="sm" onClick={() => mut.mutate({ data: { subscriptionId: String(r.id) } })}>
              Mark renewed
            </Button>
          </Card>
        ))}
        {q.data?.length === 0 ? <p className="text-sm text-text-muted">Nobody is due. Enjoy the quiet.</p> : null}
      </div>
    </div>
  );
}
