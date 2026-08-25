import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/label";
import { Input, Textarea } from "@/components/ui/input";
import { listTestimonials, saveTestimonial } from "@/lib/server/admin";
import { useState } from "react";

export const Route = createFileRoute("/admin/testimonials")({ component: Page });

function Page() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["testimonials"], queryFn: () => listTestimonials() });
  const [open, setOpen] = useState(false);
  const mut = useMutation({
    mutationFn: saveTestimonial,
    onSuccess: () => {
      toast.success("Saved");
      setOpen(false);
      void qc.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
  return (
    <div>
      <PageHeader title="Testimonials" hint="Quotes on the public page." action={<Button onClick={() => setOpen((v) => !v)}>Add</Button>} />
      {open ? (
        <Card className="mb-4 p-4">
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              mut.mutate({
                data: {
                  member_name: String(fd.get("member_name") || ""),
                  quote: String(fd.get("quote") || ""),
                  rating: 5,
                },
              });
            }}
          >
            <Field label="Member name">
              <Input name="member_name" required />
            </Field>
            <Field label="Quote">
              <Textarea name="quote" required />
            </Field>
            <Button type="submit">Save</Button>
          </form>
        </Card>
      ) : null}
      <div className="grid gap-3">
        {(q.data ?? []).map((t) => (
          <Card key={String(t.id)} className="p-4">
            <p className="text-text">“{String(t.quote)}”</p>
            <p className="mt-2 text-sm text-text-muted">— {String(t.member_name)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
