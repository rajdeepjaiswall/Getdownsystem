import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { confirmPayment, listPayments } from "@/lib/server/god";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { inr, formatDate } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/god/payments")({ component: Payments });

function Payments() {
  const [status, setStatus] = useState("");
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["payments", status],
    queryFn: () => listPayments({ data: { status: status || undefined } }),
  });
  const mut = useMutation({
    mutationFn: confirmPayment,
    onSuccess: () => {
      toast.success("Marked received — gym activated");
      void qc.invalidateQueries({ queryKey: ["payments"] });
    },
  });
  return (
    <div>
      <h1 className="font-display text-3xl">Payments</h1>
      <select
        className="mt-4 h-11 rounded-md border border-border bg-surface px-3 text-sm"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All</option>
        <option value="pending">pending</option>
        <option value="received">received</option>
      </select>
      <div className="mt-4 grid gap-3">
        {(q.data ?? []).map((p) => (
          <Card key={String(p.id)} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium">
                {String(p.gym_name ?? "—")} · {inr(Number(p.amount))}
              </p>
              <p className="text-sm text-text-muted">
                {String(p.provider)} / {String(p.method)} · {formatDate(String(p.created_at))} · {String(p.reference ?? "")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={p.status === "pending" ? "warn" : "default"}>{String(p.status)}</Badge>
              {p.status === "pending" ? (
                <Button size="sm" onClick={() => mut.mutate({ data: { id: String(p.id) } })}>
                  Mark received
                </Button>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
