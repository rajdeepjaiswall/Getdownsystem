import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getMemberProgramFor, saveMemberProgram } from "@/lib/server/member";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Textarea } from "@/components/ui/input";

export const Route = createFileRoute("/trainer/clients/$id")({ component: ClientPlan });

function ClientPlan() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["program", id],
    queryFn: () => getMemberProgramFor({ data: { member_id: id } }),
  });
  const mut = useMutation({
    mutationFn: saveMemberProgram,
    onSuccess: () => {
      toast.success("Plan saved");
      void qc.invalidateQueries({ queryKey: ["program", id] });
    },
  });
  const m = q.data?.member;
  const p = q.data?.program;
  return (
    <div>
      <p className="text-sm">
        <Link to="/trainer" className="text-primary">
          Clients
        </Link>
      </p>
      <h1 className="mt-2 font-display text-3xl">{String(m?.full_name ?? "Client")}</h1>
      <form
        className="mt-6 grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          mut.mutate({
            data: {
              member_id: id,
              workout_text: String(fd.get("workout") || ""),
              diet_text: String(fd.get("diet") || ""),
            },
          });
        }}
      >
        <Field label="Workout">
          <Textarea name="workout" className="min-h-40" defaultValue={String(p?.workout_text ?? "")} />
        </Field>
        <Field label="Diet">
          <Textarea name="diet" className="min-h-40" defaultValue={String(p?.diet_text ?? "")} />
        </Field>
        <Button type="submit">Save plan</Button>
      </form>
    </div>
  );
}
