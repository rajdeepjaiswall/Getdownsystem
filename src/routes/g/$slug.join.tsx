import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getPublicGym, publicSignup } from "@/lib/server/public";

export const Route = createFileRoute("/g/$slug/join")({ component: Join });

function Join() {
  const { slug } = Route.useParams();
  const q = useQuery({ queryKey: ["public-gym", slug], queryFn: () => getPublicGym({ data: slug }) });
  const [done, setDone] = useState(false);
  const mut = useMutation({
    mutationFn: publicSignup,
    onSuccess: () => setDone(true),
  });
  const gym = q.data?.gym;

  return (
    <div className="min-h-dvh bg-bg">
      <div className="mx-auto max-w-md px-4 py-12">
        <p className="label-caps">{gym?.name ?? "Gym"}</p>
        <h1 className="mt-2 font-display text-3xl">Join on your phone</h1>
        <p className="mt-2 text-sm text-text-muted">
          The owner approves you from the Signups screen. You do not get in until they say yes.
        </p>
        {done ? (
          <p className="mt-8 font-medium">Submitted. Wait for a call or a WhatsApp from the desk.</p>
        ) : (
          <form
            className="mt-8 grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              mut.mutate({
                data: {
                  slug,
                  full_name: String(fd.get("full_name") || ""),
                  phone: String(fd.get("phone") || ""),
                  email: String(fd.get("email") || ""),
                  gender: String(fd.get("gender") || ""),
                },
              });
            }}
          >
            <Field label="Full name">
              <Input name="full_name" required />
            </Field>
            <Field label="Phone">
              <Input name="phone" type="tel" required />
            </Field>
            <Field label="Email">
              <Input name="email" type="email" />
            </Field>
            <Button type="submit" disabled={mut.isPending}>
              Submit for approval
            </Button>
          </form>
        )}
        <p className="mt-6 text-sm">
          <Link to="/g/$slug" params={{ slug }} className="text-primary">
            Back to gym page
          </Link>
        </p>
      </div>
    </div>
  );
}
