import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addProgress, listProgress } from "@/lib/server/member";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { fileToDataUrl } from "@/lib/file-to-data-url";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/app/progress")({ component: Progress });

function Progress() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["progress"], queryFn: () => listProgress() });
  const mut = useMutation({
    mutationFn: addProgress,
    onSuccess: () => {
      toast.success("Logged");
      void qc.invalidateQueries({ queryKey: ["progress"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">Progress</h1>
      <Card className="p-4">
        <form
          className="grid gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const photo = fd.get("photo") as File | null;
            mut.mutate({
              data: {
                weight_kg: Number(fd.get("weight") || 0) || undefined,
                notes: String(fd.get("notes") || ""),
                photo_url: photo && photo.size ? await fileToDataUrl(photo) : undefined,
              },
            });
            e.currentTarget.reset();
          }}
        >
          <Field label="Weight (kg)">
            <Input name="weight" type="number" step="0.1" />
          </Field>
          <Field label="Photo">
            <Input name="photo" type="file" accept="image/*" />
          </Field>
          <Field label="Notes">
            <Input name="notes" />
          </Field>
          <Button type="submit">Log</Button>
        </form>
      </Card>
      {(q.data ?? []).map((r) => (
        <Card key={String(r.id)} className="p-4">
          <p className="text-sm text-text-muted">{formatDate(String(r.logged_on))}</p>
          <p className="font-display text-2xl tabular-nums">{r.weight_kg ? `${r.weight_kg} kg` : "—"}</p>
          {r.photo_url ? <img src={String(r.photo_url)} alt="" className="mt-2 h-40 w-full rounded-md object-cover" /> : null}
          <p className="mt-1 text-sm">{String(r.notes ?? "")}</p>
        </Card>
      ))}
    </div>
  );
}
