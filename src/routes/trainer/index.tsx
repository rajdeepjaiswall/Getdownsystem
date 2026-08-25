import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listTrainerClients, trainerCheckin } from "@/lib/server/member";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/trainer/")({ component: Clients });

function Clients() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["trainer-clients"], queryFn: () => listTrainerClients() });
  const mut = useMutation({
    mutationFn: trainerCheckin,
    onSuccess: () => {
      toast.success("Marked present");
      void qc.invalidateQueries({ queryKey: ["trainer-clients"] });
    },
  });
  return (
    <div>
      <h1 className="font-display text-3xl">Clients</h1>
      <p className="mt-1 text-sm text-text-muted">Attendance and plans for people assigned to you.</p>
      <div className="mt-6 grid gap-3">
        {(q.data ?? []).map((m) => (
          <Card key={String(m.id)} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium">{String(m.full_name)}</p>
              <p className="text-sm text-text-muted">
                Last in {m.last_checkin ? formatDate(String(m.last_checkin)) : "—"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => mut.mutate({ data: { member_id: String(m.id) } })}>
                Mark present
              </Button>
              <Button size="sm" asChild>
                <Link to="/trainer/clients/$id" params={{ id: String(m.id) }}>
                  Plan
                </Link>
              </Button>
            </div>
          </Card>
        ))}
        {q.data?.length === 0 ? <p className="text-sm text-text-muted">No clients assigned yet.</p> : null}
      </div>
    </div>
  );
}
