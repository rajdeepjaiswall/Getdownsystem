import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { WHATSAPP_LINK } from "@/lib/constants";

export const Route = createFileRoute("/forgot-password")({ component: Forgot });

function Forgot() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <AuthShell
      title="Reset password"
      subtitle="We do not send reset mail yet. For gyms we onboard in person, WhatsApp is faster."
    >
      {done ? (
        <div className="grid gap-3 text-sm text-text">
          <p>Noted {email}. Message us on WhatsApp and we will reset it the same day.</p>
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="font-medium text-primary">
            WhatsApp Get Down Foundation
          </a>
        </div>
      ) : (
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <Field label="Email">
            <Input type="email" required value={email} onChange={(ev) => setEmail(ev.target.value)} />
          </Field>
          <Button type="submit">Request reset</Button>
        </form>
      )}
      <p className="mt-4 text-sm">
        <Link to="/login" className="text-primary">
          Back to log in
        </Link>
      </p>
    </AuthShell>
  );
}