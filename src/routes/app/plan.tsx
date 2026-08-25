import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMemberProgram } from "@/lib/server/member";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/app/plan")({ component: Plan });

function Plan() {
  const q = useQuery({ queryKey: ["member-program"], queryFn: () => getMemberProgram() });
  const p = q.data;
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">My plan</h1>
      {!p ? (
        <p className="text-sm text-text-muted">Your trainer has not assigned a plan yet.</p>
      ) : (
        <>
          <p className="text-sm text-text-muted">Coach {String(p.trainer_name ?? "")}</p>
          <Card className="p-5">
            <p className="label-caps">Workout</p>
            <pre className="mt-2 whitespace-pre-wrap font-sans text-sm">{String(p.workout_text ?? "")}</pre>
          </Card>
          <Card className="p-5">
            <p className="label-caps">Diet</p>
            <pre className="mt-2 whitespace-pre-wrap font-sans text-sm">{String(p.diet_text ?? "")}</pre>
          </Card>
        </>
      )}
    </div>
  );
}
