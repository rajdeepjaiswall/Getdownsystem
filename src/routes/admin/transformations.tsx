import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/label";
import { Input, Textarea } from "@/components/ui/input";
import { listTransformations, saveTransformation } from "@/lib/server/admin";
import { fileToDataUrl } from "@/lib/file-to-data-url";
import { useState } from "react";

export const Route = createFileRoute("/admin/transformations")({ component: Page });

function Page() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["transformations"], queryFn: () => listTransformations() });
  const [open, setOpen] = useState(false);
  const mut = useMutation({
    mutationFn: saveTransformation,
    onSuccess: () => {
      toast.success("Saved");
      setOpen(false);
      void qc.invalidateQueries({ queryKey: ["transformations"] });
    },
  });
  return (
    <div>
      <PageHeader title="Transformations" hint="Before and after — the reason a walk-in becomes a member." action={<Button onClick={() => setOpen((v) => !v)}>Add</Button>} />
      {open ? (
        <Card className="mb-4 p-4">
          <form
            className="grid gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const before = fd.get("before") as File | null;
              const after = fd.get("after") as File | null;
              mut.mutate({
                data: {
                  member_name: String(fd.get("member_name") || ""),
                  story: String(fd.get("story") || ""),
                  before_url: before && before.size ? await fileToDataUrl(before) : undefined,
                  after_url: after && after.size ? await fileToDataUrl(after) : undefined,
                },
              });
            }}
          >
            <Field label="Member name">
              <Input name="member_name" required />
            </Field>
            <Field label="Story">
              <Textarea name="story" />
            </Field>
            <Field label="Photo">
              <Input name="after" type="file" accept="image/*" />
            </Field>
            <Button type="submit">Save</Button>
          </form>
        </Card>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {(q.data ?? []).map((t) => (
          <Card key={String(t.id)} className="overflow-hidden">
            {t.after_url ? <img src={String(t.after_url)} alt="" className="h-48 w-full object-cover" /> : null}
            <div className="p-4">
              <p className="font-medium">{String(t.member_name)}</p>
              <p className="text-sm text-text-muted">{String(t.story ?? "")}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
