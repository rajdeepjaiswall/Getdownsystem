import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { inviteStaff, listStaffInvites } from "@/lib/server/admin";
import { getOverview } from "@/lib/server/admin";
import { useSessionContext } from "@/components/role-gate";
import { PLANS } from "@/lib/constants";
import { inr } from "@/lib/utils";
import { authClient } from "@/lib/auth/client";
import { useState } from "react";

export const Route = createFileRoute("/admin/settings")({ component: Settings });

function Settings() {
  const { ctx } = useSessionContext();
  const qc = useQueryClient();
  const overview = useQuery({ queryKey: ["overview"], queryFn: () => getOverview() });
  const invites = useQuery({ queryKey: ["invites"], queryFn: () => listStaffInvites() });
  const invite = useMutation({
    mutationFn: inviteStaff,
    onSuccess: (r) => {
      toast.success(r.attached ? "Attached to existing account" : "Invite saved — they get the role on first login");
      void qc.invalidateQueries({ queryKey: ["invites"] });
    },
  });
  const [pw, setPw] = useState({ current: "", next: "" });
  const gym = ctx?.gym;
  const used = overview.data?.used ?? 0;
  const cap = overview.data?.cap ?? gym?.member_cap ?? 50;
  const plan = PLANS.find((p) => p.id === gym?.plan);

  return (
    <div className="grid max-w-2xl gap-8">
      <PageHeader title="Settings" hint="Branding lives under Gym profile. This is access, plan, and password." />

      <Card className="p-5">
        <p className="label-caps">Current plan</p>
        <p className="mt-1 font-display text-2xl capitalize">{gym?.plan}</p>
        <p className="text-sm text-text-muted">
          {plan?.price ? `${inr(plan.price)}/month` : "Custom"} · {used} / {cap} members
        </p>
        <Progress className="mt-3" value={cap ? (used / cap) * 100 : 0} />
        <Button asChild className="mt-4" variant="outline" size="sm">
          <Link to="/signup" search={{ plan: "growth" }}>
            Upgrade
          </Link>
        </Button>
      </Card>

      <Card className="p-5">
        <p className="font-medium">Invite staff by email</p>
        <p className="mt-1 text-sm text-text-muted">Unlimited logins on every plan. Staff see operations only.</p>
        <form
          className="mt-4 grid gap-3 sm:grid-cols-[1fr_8rem_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            invite.mutate({
              data: {
                email: String(fd.get("email") || ""),
                role: String(fd.get("role") || "staff") as "staff" | "trainer",
              },
            });
            e.currentTarget.reset();
          }}
        >
          <Input name="email" type="email" required placeholder="desk@gym.in" />
          <select name="role" className="h-11 rounded-md border border-border bg-surface px-3 text-sm">
            <option value="staff">Staff</option>
            <option value="trainer">Trainer</option>
          </select>
          <Button type="submit">Invite</Button>
        </form>
        <ul className="mt-4 space-y-1 text-sm text-text-muted">
          {(invites.data ?? []).map((i) => (
            <li key={String(i.id)}>
              {String(i.email)} · {String(i.role)} · {i.accepted ? "accepted" : "pending"}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <p className="font-medium">Change password</p>
        <form
          className="mt-4 grid gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const { error } = await authClient.changePassword({
              currentPassword: pw.current,
              newPassword: pw.next,
            });
            if (error) toast.error(error.message ?? "Could not change password");
            else {
              toast.success("Password updated");
              setPw({ current: "", next: "" });
            }
          }}
        >
          <Field label="Current">
            <Input type="password" value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} />
          </Field>
          <Field label="New">
            <Input type="password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} />
          </Field>
          <Button type="submit" variant="outline">
            Update password
          </Button>
        </form>
      </Card>
    </div>
  );
}
