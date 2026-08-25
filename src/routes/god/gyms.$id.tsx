import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { confirmPayment, getGodGym, updateGodGym } from "@/lib/server/god";
import { startImpersonation } from "@/lib/server/session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { inr } from "@/lib/utils";

export const Route = createFileRoute("/god/gyms/$id")({ component: GymDetail });

function GymDetail() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["god-gym", id], queryFn: () => getGodGym({ data: { id } }) });
  const save = useMutation({
    mutationFn: updateGodGym,
    onSuccess: () => {
      toast.success("Updated");
      void qc.invalidateQueries({ queryKey: ["god-gym", id] });
    },
  });
  const pay = useMutation({
    mutationFn: confirmPayment,
    onSuccess: () => {
      toast.success("Marked received");
      void qc.invalidateQueries({ queryKey: ["god-gym", id] });
    },
  });
  const gym = q.data?.gym;
  if (!gym) return <p className="text-sm text-text-muted">Loading…</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div>
        <p className="text-sm">
          <Link to="/god/gyms" className="text-primary">
            Gyms
          </Link>
        </p>
        <h1 className="mt-1 font-display text-3xl">{gym.name}</h1>
        <p className="text-sm text-text-muted">
          {gym.city} · {gym.slug}.getdownfitness.in
        </p>
        <form
          className="mt-6 grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            save.mutate({
              data: {
                id,
                plan: String(fd.get("plan") || gym.plan),
                member_cap: Number(fd.get("member_cap") || gym.member_cap),
                subscription_status: String(fd.get("subscription_status") || gym.subscription_status),
                current_period_end: String(fd.get("current_period_end") || "") || undefined,
                custom_domain: String(fd.get("custom_domain") || "") || null,
                domain_status: String(fd.get("domain_status") || gym.domain_status),
                brand_color: String(fd.get("brand_color") || gym.brand_color),
              },
            });
          }}
        >
          <Field label="Plan">
            <select name="plan" defaultValue={gym.plan} className="h-11 rounded-md border border-border bg-surface px-3 text-sm">
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </Field>
          <Field label="Member cap" hint="Override by hand for Enterprise deals">
            <Input name="member_cap" type="number" defaultValue={gym.member_cap} />
          </Field>
          <Field label="Status">
            <select
              name="subscription_status"
              defaultValue={gym.subscription_status}
              className="h-11 rounded-md border border-border bg-surface px-3 text-sm"
            >
              <option value="trial">trial</option>
              <option value="active">active</option>
              <option value="past_due">past_due</option>
              <option value="suspended">suspended</option>
            </select>
          </Field>
          <Field label="Current period end">
            <Input name="current_period_end" defaultValue={gym.current_period_end?.slice(0, 10) ?? ""} placeholder="YYYY-MM-DD" />
          </Field>
          <Field label="Custom domain" hint="Owner must add a CNAME to this host.">
            <Input name="custom_domain" defaultValue={gym.custom_domain ?? ""} placeholder="gym.example.in" />
          </Field>
          <Field label="Domain status">
            <select name="domain_status" defaultValue={gym.domain_status} className="h-11 rounded-md border border-border bg-surface px-3 text-sm">
              <option value="none">none</option>
              <option value="pending">pending</option>
              <option value="live">live</option>
            </select>
          </Field>
          <Field label="Brand colour">
            <Input name="brand_color" type="color" defaultValue={gym.brand_color} className="h-11 w-20 p-1" />
          </Field>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Switch
              checked={gym.show_powered_by}
              onCheckedChange={(v) => save.mutate({ data: { id, show_powered_by: v } })}
            />
            <span className="text-sm">Show “Powered by Getdown Fitness”</span>
          </div>
          <Button type="submit" className="sm:col-span-2">
            Save
          </Button>
        </form>
        {gym.custom_domain ? (
          <Card className="mt-4 p-4 text-sm text-text-muted">
            CNAME <span className="font-mono text-text">{gym.custom_domain}</span> →{" "}
            <span className="font-mono text-text">{gym.slug}.getdownfitness.in</span>
          </Card>
        ) : null}
      </div>
      <div className="space-y-4">
        <Card className="p-4">
          <p className="label-caps">Usage</p>
          <p className="mt-1 font-display text-3xl tabular-nums">
            {q.data?.used} / {gym.member_cap}
          </p>
          <Button
            className="mt-4 w-full"
            variant="outline"
            onClick={async () => {
              await startImpersonation({ data: { gymId: id } });
              toast.message("Impersonation logged");
              nav({ to: "/admin" });
            }}
          >
            Impersonate owner
          </Button>
        </Card>
        <Card className="p-4">
          <p className="font-medium">Payments</p>
          <ul className="mt-2 space-y-2 text-sm">
            {(q.data?.payments ?? []).map((p) => (
              <li key={String(p.id)} className="flex items-center justify-between gap-2">
                <span>
                  {inr(Number(p.amount))} · {String(p.status)}
                </span>
                {p.status === "pending" ? (
                  <Button size="sm" onClick={() => pay.mutate({ data: { id: String(p.id) } })}>
                    Received
                  </Button>
                ) : (
                  <Badge>{String(p.provider)}</Badge>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
