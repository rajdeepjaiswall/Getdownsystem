import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { memberCheckin } from "@/lib/server/member";
import { useSessionContext } from "@/components/role-gate";

export const Route = createFileRoute("/app/checkin")({ component: Checkin });

function Checkin() {
  const { ctx } = useSessionContext();
  const qc = useQueryClient();
  const mut = useMutation({
    mutationFn: () => memberCheckin(),
    onSuccess: (r) => {
      toast.success(r.already ? "Already in for today" : "You’re in");
      void qc.invalidateQueries({ queryKey: ["member-home"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div className="flex flex-col items-center pt-8 text-center">
      <div
        className="grid size-40 place-items-center rounded-xl text-white"
        style={{ background: ctx?.gym?.brand_color ?? "#5B8C51" }}
      >
        <span className="font-display text-6xl">QR</span>
      </div>
      <h1 className="mt-6 font-display text-2xl">At the gate?</h1>
      <p className="mt-2 max-w-xs text-sm text-text-muted">
        Point this at the gym’s code, or tap below if you’re already inside. One check-in per day.
      </p>
      <Button className="mt-6 w-full max-w-xs" onClick={() => mut.mutate()} disabled={mut.isPending}>
        {mut.isPending ? "Saving…" : "I’m here — check in"}
      </Button>
    </div>
  );
}
