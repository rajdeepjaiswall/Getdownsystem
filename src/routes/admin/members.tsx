import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { listMembers, listPlans, upsertMember } from "@/lib/server/admin";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/admin/members")({ component: MembersPage });

function MembersPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const members = useQuery({ queryKey: ["members", q], queryFn: () => listMembers({ data: { q } }) });
  const plans = useQuery({ queryKey: ["plans"], queryFn: () => listPlans() });
  const mut = useMutation({
    mutationFn: upsertMember,
    onSuccess: () => {
      toast.success("Saved");
      setOpen(false);
      void qc.invalidateQueries({ queryKey: ["members"] });
      void qc.invalidateQueries({ queryKey: ["overview"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        title="Members"
        hint="The live register. Capacity is enforced when you add someone as active."
        action={<Button onClick={() => setOpen(true)}>Add member</Button>}
      />
      <Input
        className="mb-4 max-w-sm"
        placeholder="Search name or phone"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-border text-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Ends</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(members.data ?? []).map((m) => (
              <tr key={String(m.id)} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{String(m.full_name)}</td>
                <td className="px-4 py-3 text-text-muted">{String(m.phone ?? "—")}</td>
                <td className="px-4 py-3">{String(m.plan_name ?? "—")}</td>
                <td className="px-4 py-3 tabular-nums">{formatDate(m.sub_ends_on as string)}</td>
                <td className="px-4 py-3">
                  <Badge tone={m.status === "active" ? "default" : m.status === "pending" ? "warn" : "muted"}>
                    {String(m.status)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.data?.length === 0 ? (
          <p className="p-6 text-sm text-text-muted">No members yet. Add one, import a sheet, or share the signup link.</p>
        ) : null}
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add member</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              mut.mutate({
                data: {
                  full_name: String(fd.get("full_name") || ""),
                  phone: String(fd.get("phone") || ""),
                  email: String(fd.get("email") || ""),
                  plan_id: String(fd.get("plan_id") || "") || undefined,
                },
              });
            }}
          >
            <Field label="Full name">
              <Input name="full_name" required />
            </Field>
            <Field label="Phone">
              <Input name="phone" />
            </Field>
            <Field label="Email">
              <Input name="email" type="email" />
            </Field>
            <Field label="Plan">
              <select name="plan_id" className="h-11 rounded-md border border-border bg-surface px-3 text-sm">
                <option value="">Assign later</option>
                {(plans.data ?? []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
            <Button type="submit" disabled={mut.isPending}>
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
