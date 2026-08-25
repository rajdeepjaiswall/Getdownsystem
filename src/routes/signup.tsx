import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PLANS } from "@/lib/constants";
import { createGymForOwner } from "@/lib/server/admin";
import { getPublicCheckout, markManualPaid } from "@/lib/server/god";
import { inr } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

type Search = { plan?: string };

export const Route = createFileRoute("/signup")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    plan: typeof s.plan === "string" ? s.plan : undefined,
  }),
  component: Signup,
});

function Signup() {
  const { plan: planParam } = Route.useSearch();
  const plan = PLANS.find((p) => p.id === planParam && !p.enterprise)?.id ?? "starter";
  const chosen = PLANS.find((p) => p.id === plan)!;
  const { user, isPending } = useCurrentUserState();
  const nav = useNavigate();
  const checkout = useQuery({ queryKey: ["checkout"], queryFn: () => getPublicCheckout() });

  const [step, setStep] = useState<"form" | "pay">("form");
  const [payId, setPayId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    gym: "",
    owner: "",
    email: "",
    password: "",
    phone: "",
    city: "",
  });

  if (planParam === "enterprise") {
    nav({ to: "/contact" });
  }

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function afterAuth() {
    const created = await createGymForOwner({
      data: {
        name: form.gym,
        city: form.city,
        phone: form.phone,
        plan,
        owner_name: form.owner,
      },
    });
    setPayId(created.paymentId);
    setStep("pay");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (!user) {
        const { error: err } = await authClient.signUp.email({
          email: form.email,
          password: form.password,
          name: form.owner,
        });
        if (err) throw new Error(err.message ?? "Could not create account");
      }
      await afterAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function paid() {
    if (payId) {
      try {
        await markManualPaid({ data: { paymentId: payId } });
      } catch {
        /* god panel confirms */
      }
    }
    window.location.href = "/setup";
  }

  if (step === "pay") {
    const c = checkout.data;
    return (
      <AuthShell
        title="Pay the first month"
        subtitle="Manual UPI is the default. We switch the gym on when the payment lands."
      >
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="label-caps">{chosen.name} plan</p>
          <p className="mt-1 font-display text-4xl tabular-nums">{inr(chosen.price ?? 0)}</p>
          <p className="mt-4 text-sm text-text-muted">Pay to</p>
          <p className="font-medium">{c?.account}</p>
          <p className="mt-1 font-mono text-sm tabular-nums">{c?.upi}</p>
          <p className="mt-4 text-sm text-text-muted">{c?.instructions}</p>
        </div>
        <Button className="mt-6 w-full" onClick={() => void paid()}>
          I have paid
        </Button>
        <button type="button" className="mt-3 w-full text-sm text-text-muted" onClick={() => (window.location.href = "/setup")}>
          Skip for now — 14-day trial
        </button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Open your gym on Getdown"
      subtitle={`${chosen.name} · ${chosen.price ? inr(chosen.price) + "/month" : "custom"} · up to ${chosen.memberCap} members`}
    >
      {isPending ? <div className="h-40 animate-pulse rounded-lg bg-border" /> : null}
      {!isPending && !user ? (
        <>
          <div className="grid gap-2">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="outline"
                onClick={() => signIn(p.providerId, { callbackURL: `/signup?plan=${plan}` })}
              >
                Continue with {p.label}
              </Button>
            ))}
          </div>
          <div className="my-6 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="label-caps">or email</span>
            <Separator className="flex-1" />
          </div>
        </>
      ) : null}
      <form className="grid gap-3" onSubmit={(e) => void onSubmit(e)}>
        <Field label="Gym name">
          <Input required value={form.gym} onChange={(e) => set("gym", e.target.value)} placeholder="Shakti Fitness" />
        </Field>
        <Field label="Your name">
          <Input required value={form.owner} onChange={(e) => set("owner", e.target.value)} />
        </Field>
        {!user ? (
          <>
            <Field label="Email">
              <Input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Password" hint="At least 8 characters">
              <Input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
              />
            </Field>
          </>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Phone">
            <Input type="tel" required value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="City">
            <Input required value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Prayagraj" />
          </Field>
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" disabled={busy}>
          {busy ? "Creating…" : "Create gym"}
        </Button>
      </form>
      <p className="mt-4 text-sm text-text-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-primary">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
