import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getPaymentSettings, listPlanCatalog, savePaymentSettings, savePlanCatalog } from "@/lib/server/god";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/label";
import { Input, Textarea } from "@/components/ui/input";
import { inr } from "@/lib/utils";

export const Route = createFileRoute("/god/settings")({ component: Settings });

function Settings() {
  const qc = useQueryClient();
  const pay = useQuery({ queryKey: ["pay-settings"], queryFn: () => getPaymentSettings() });
  const catalog = useQuery({ queryKey: ["plan-catalog"], queryFn: () => listPlanCatalog() });
  const savePay = useMutation({
    mutationFn: savePaymentSettings,
    onSuccess: () => {
      toast.success("Provider saved — checkout updates for every gym");
      void qc.invalidateQueries({ queryKey: ["pay-settings"] });
    },
  });
  const savePlan = useMutation({
    mutationFn: savePlanCatalog,
    onSuccess: () => {
      toast.success("Prices updated");
      void qc.invalidateQueries({ queryKey: ["plan-catalog"] });
    },
  });
  const s = pay.data;
  return (
    <div className="grid max-w-2xl gap-8">
      <div>
        <h1 className="font-display text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-text-muted">
          Payment provider and plan prices live here so a change does not need a redeploy.
        </p>
      </div>
      {s ? (
        <Card className="p-5">
          <p className="font-medium">Payment provider</p>
          <form
            className="mt-4 grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              savePay.mutate({
                data: {
                  active_provider: String(fd.get("active_provider") || "manual"),
                  manual_upi_id: String(fd.get("manual_upi_id") || ""),
                  manual_account_name: String(fd.get("manual_account_name") || ""),
                  manual_instructions: String(fd.get("manual_instructions") || ""),
                  razorpay_key_id: String(fd.get("razorpay_key_id") || ""),
                  razorpay_key_secret: String(fd.get("razorpay_key_secret") || ""),
                },
              });
            }}
          >
            <Field label="Active provider">
              <select
                name="active_provider"
                defaultValue={s.active_provider}
                className="h-11 rounded-md border border-border bg-surface px-3 text-sm"
              >
                <option value="manual">manual (UPI)</option>
                <option value="razorpay">razorpay</option>
                <option value="coming_soon">coming_soon stub</option>
              </select>
            </Field>
            <Field label="UPI ID">
              <Input name="manual_upi_id" defaultValue={s.manual_upi_id} />
            </Field>
            <Field label="Account name">
              <Input name="manual_account_name" defaultValue={s.manual_account_name} />
            </Field>
            <Field label="Instructions">
              <Textarea name="manual_instructions" defaultValue={s.manual_instructions} />
            </Field>
            <Field label="Razorpay key id" hint="Public. Secret is verified only on the server.">
              <Input name="razorpay_key_id" defaultValue={s.razorpay_key_id} />
            </Field>
            <Field label="Razorpay key secret">
              <Input name="razorpay_key_secret" type="password" defaultValue={s.razorpay_key_secret} />
            </Field>
            <Button type="submit">Save provider</Button>
          </form>
        </Card>
      ) : null}
      <Card className="p-5">
        <p className="font-medium">Plan catalogue</p>
        <div className="mt-4 grid gap-3">
          {(catalog.data ?? []).map((p) => (
            <form
              key={p.id}
              className="grid gap-2 sm:grid-cols-[1fr_8rem_8rem_auto] sm:items-end"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                savePlan.mutate({
                  data: {
                    id: p.id,
                    price: fd.get("price") === "" ? null : Number(fd.get("price")),
                    member_cap: Number(fd.get("member_cap") || p.member_cap),
                  },
                });
              }}
            >
              <p className="font-medium">
                {p.name}
                {p.price != null ? <span className="ml-2 text-sm text-text-muted">{inr(p.price)}</span> : null}
              </p>
              <Field label="₹ / month">
                <Input name="price" type="number" defaultValue={p.price ?? ""} />
              </Field>
              <Field label="Cap">
                <Input name="member_cap" type="number" defaultValue={p.member_cap} />
              </Field>
              <Button type="submit" size="sm" variant="outline">
                Save
              </Button>
            </form>
          ))}
        </div>
      </Card>
    </div>
  );
}
