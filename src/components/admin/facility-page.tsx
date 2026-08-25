import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { PageHeader } from "./shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/label";
import { Input, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  deleteFacility,
  listAmenities,
  listEquipment,
  reorderFacilities,
  saveFacility,
} from "@/lib/server/admin";
import { fileToDataUrl } from "@/lib/file-to-data-url";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

export function FacilityPage({
  kind,
  title,
  hint,
}: {
  kind: "amenities" | "equipment";
  title: string;
  hint: string;
}) {
  const qc = useQueryClient();
  const key = kind;
  const q = useQuery({
    queryKey: [key],
    queryFn: () => (kind === "amenities" ? listAmenities() : listEquipment()),
  });
  const [open, setOpen] = useState(false);
  const save = useMutation({
    mutationFn: saveFacility,
    onSuccess: () => {
      toast.success("Saved");
      setOpen(false);
      void qc.invalidateQueries({ queryKey: [key] });
    },
  });
  const del = useMutation({
    mutationFn: deleteFacility,
    onSuccess: () => void qc.invalidateQueries({ queryKey: [key] }),
  });
  const rows = q.data ?? [];

  async function move(id: string, dir: -1 | 1) {
    const ids = rows.map((r) => String(r.id));
    const i = ids.indexOf(id);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    const next = [...ids];
    const [x] = next.splice(i, 1);
    next.splice(j, 0, x);
    await reorderFacilities({ data: { kind, ids: next } });
    void qc.invalidateQueries({ queryKey: [key] });
  }

  return (
    <div>
      <PageHeader title={title} hint={hint} action={<Button onClick={() => setOpen((v) => !v)}>Add</Button>} />
      {open ? (
        <Card className="mb-4 p-4">
          <form
            className="grid gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const file = (fd.get("image") as File | null) ?? null;
              const image_url = file && file.size ? await fileToDataUrl(file) : undefined;
              save.mutate({
                data: {
                  kind,
                  name: String(fd.get("name") || ""),
                  description: String(fd.get("description") || ""),
                  image_url,
                },
              });
            }}
          >
            <Field label="Name">
              <Input name="name" required />
            </Field>
            <Field label="Description">
              <Textarea name="description" />
            </Field>
            <Field label="Photo">
              <Input name="image" type="file" accept="image/*" />
            </Field>
            <Button type="submit">Save</Button>
          </form>
        </Card>
      ) : null}
      <div className="grid gap-3">
        {rows.map((r) => (
          <Card key={String(r.id)} className="flex items-center gap-3 p-3">
            {r.image_url ? (
              <img src={String(r.image_url)} alt="" className="h-16 w-20 rounded-md object-cover" />
            ) : (
              <div className="h-16 w-20 rounded-md bg-primary-tint" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium">{String(r.name)}</p>
              <p className="truncate text-sm text-text-muted">{String(r.description ?? "")}</p>
            </div>
            <Switch
              checked={Boolean(r.is_visible)}
              onCheckedChange={(v) =>
                save.mutate({ data: { kind, id: String(r.id), name: String(r.name), is_visible: v } })
              }
              aria-label="Visible on public page"
            />
            <button type="button" className="rounded-md p-2 hover:bg-primary-tint" onClick={() => void move(String(r.id), -1)}>
              <ArrowUp className="size-4" />
            </button>
            <button type="button" className="rounded-md p-2 hover:bg-primary-tint" onClick={() => void move(String(r.id), 1)}>
              <ArrowDown className="size-4" />
            </button>
            <button
              type="button"
              className="rounded-md p-2 text-danger hover:bg-danger-tint"
              onClick={() => del.mutate({ data: { kind, id: String(r.id) } })}
            >
              <Trash2 className="size-4" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
