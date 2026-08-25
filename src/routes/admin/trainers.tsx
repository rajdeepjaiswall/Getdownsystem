import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/label";
import { Input, Textarea } from "@/components/ui/input";
import { listTrainers, saveTrainer } from "@/lib/server/admin";
import { useState } from "react";
import { fileToDataUrl } from "@/lib/file-to-data-url";

export const Route = createFileRoute("/admin/trainers")({ component: Trainers });

function Trainers() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["trainers"], queryFn: () => listTrainers() });
  const [open, setOpen] = useState(false);
  const mut = useMutation({
    mutationFn: saveTrainer,
    onSuccess: () => {
      toast.success("Saved");
      setOpen(false);
      void qc.invalidateQueries({ queryKey: ["trainers"] });
    },
  });
  return (
    <div>
      <PageHeader title="Trainers" hint="Shown on the public page and in the member app." action={<Button onClick={() => setOpen((v) => !v)}>Add</Button>} />
      {open ? (
        <Card className="mb-4 p-4">
          <form
            className="grid gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const file = (fd.get("photo") as File | null) ?? null;
              const photo_url = file && file.size ? await fileToDataUrl(file) : undefined;
              mut.mutate({
                data: {
                  name: String(fd.get("name") || ""),
                  speciality: String(fd.get("speciality") || ""),
                  bio: String(fd.get("bio") || ""),
                  photo_url,
                },
              });
            }}
          >
            <Field label="Name">
              <Input name="name" required />
            </Field>
            <Field label="Speciality">
              <Input name="speciality" />
            </Field>
            <Field label="Bio">
              <Textarea name="bio" />
            </Field>
            <Field label="Photo">
              <Input name="photo" type="file" accept="image/*" />
            </Field>
            <Button type="submit">Save</Button>
          </form>
        </Card>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {(q.data ?? []).map((t) => (
          <Card key={String(t.id)} className="flex gap-4 p-4">
            {t.photo_url ? (
              <img src={String(t.photo_url)} alt="" className="h-20 w-16 rounded-md object-cover" />
            ) : null}
            <div>
              <p className="font-medium">{String(t.name)}</p>
              <p className="text-sm text-primary">{String(t.speciality ?? "")}</p>
              <p className="mt-1 text-sm text-text-muted">{String(t.bio ?? "")}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
