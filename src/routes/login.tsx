import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type Search = { next?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    next: typeof s.next === "string" ? s.next : undefined,
  }),
  component: Login,
});

function Login() {
  const { next } = Route.useSearch();
  const dest = next || "/go";
  const nav = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isPending && user) {
    nav({ to: dest });
  }

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await authClient.signIn.email({ email, password });
    setBusy(false);
    if (err) {
      setError(err.message ?? "Could not sign in");
      return;
    }
    window.location.href = dest;
  }

  return (
    <AuthShell title="Log in" subtitle="Owners, staff, trainers and members use the same door. Where you land depends on your role.">
      {!authEnabled ? (
        <p className="text-sm text-text-muted">Sign-in is disabled.</p>
      ) : (
        <>
          <div className="grid gap-2">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="outline"
                onClick={() => signIn(p.providerId, { callbackURL: dest })}
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
          <form className="grid gap-3" onSubmit={onEmail}>
            <Field label="Email">
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </Field>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" disabled={busy}>
              {busy ? "Signing in…" : "Log in"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-text-muted">
            <Link to="/forgot-password" className="text-primary">
              Forgot password
            </Link>
            <span className="mx-2">·</span>
            New gym?{" "}
            <Link to="/signup" className="text-primary">
              Start free
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
