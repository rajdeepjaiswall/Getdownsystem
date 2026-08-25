import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { listPlans, savePlan } from "@/lib/server/admin";
import { inr } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/admin/plans")({ component: Plans });

function Plans() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["plans"], queryFn: () => listPlans() });
  const [open, setOpen] = useState(false);
  const mut = useMutation({
    mutationFn: savePlan,
    onSuccess: () => {
      toast.success("Saved");
      setOpen(false);
      void qc.invalidateQueries({ queryKey: ["plans"] });
    },
  });
  return (
    <div>
      <PageHeader
        title="Plans"
        hint="These are what you sell to your members — not the Getdown Fitness subscription."
        action={<Button onClick={() => setOpen((v) => !v)}>Add plan</Button>}
      />
      {open ? (
        <Card className="mb-4 p-4">
          <form
            className="grid gap-3 sm:grid-cols-3"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              mut.mutate({
                data: {
                  name: String(fd.get("name") || ""),
                  duration_days: Number(fd.get("duration_days") || 30),
                  price: Number(fd.get("price") || 0),
                },
              });
            }}
          >
            <Field label="Name">
              <Input name="name" required placeholder="Monthly" />
            </Field>
            <Field label="Days">
              <Input name="duration_days" type="number" defaultValue={30} />
            </Field>
            <Field label="Price (₹)">
              <Input name="price" type="number" defaultValue={1500} />
            </Field>
            <Button type="submit" className="sm:col-span-3">
              Save
            </Button>
          </form>
        </Card>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-3">
        {(q.data ?? []).map((p) => (
          <Card key={p.id} className="p-5">
            <p className="font-medium">{p.name}</p>
            <p className="mt-2 font-display text-3xl tabular-nums">{inr(p.price)}</p>
            <p className="text-sm text-text-muted">{p.duration_days} days</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
