import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Wordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/label";
import { Input, Textarea } from "@/components/ui/input";
import { FOUNDATION, FOUNDATION_CITY, WHATSAPP_LINK } from "@/lib/constants";
import { submitLead } from "@/lib/server/public";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  const [sent, setSent] = useState(false);
  const mut = useMutation({
    mutationFn: (payload: {
      gym_name: string;
      owner_name: string;
      phone?: string;
      city?: string;
      member_count?: number;
      message?: string;
    }) => submitLead({ data: payload }),
    onSuccess: () => {
      setSent(true);
      toast.success("Received.");
    },
  });
  return (
    <div className="min-h-dvh bg-bg">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4">
          <Wordmark />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="label-caps">Enterprise and in-person setup</p>
        <h1 className="mt-2 font-display text-4xl">Talk to {FOUNDATION}</h1>
        <p className="mt-3 max-w-xl text-text-muted">
          {FOUNDATION_CITY}. For gyms over 150 members, more than one branch, or if you would rather we import the
          register with you.
        </p>
        <a
          href={WHATSAPP_LINK}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-white"
        >
          <MessageCircle className="size-4" /> WhatsApp
        </a>
        {sent ? (
          <Card className="mt-10 p-6">
            <p className="font-display text-2xl">We have it.</p>
            <p className="mt-2 text-text-muted">Someone will call. No drip sequence.</p>
            <Button asChild className="mt-4" variant="outline">
              <Link to="/">Back home</Link>
            </Button>
          </Card>
        ) : (
          <form
            className="mt-10 grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              mut.mutate({
                gym_name: String(fd.get("gym_name") || ""),
                owner_name: String(fd.get("owner_name") || ""),
                phone: String(fd.get("phone") || ""),
                city: String(fd.get("city") || ""),
                member_count: Number(fd.get("member_count") || 0) || undefined,
                message: String(fd.get("message") || ""),
              });
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Gym name">
                <Input name="gym_name" required />
              </Field>
              <Field label="Owner name">
                <Input name="owner_name" required />
              </Field>
              <Field label="Phone">
                <Input name="phone" type="tel" required />
              </Field>
              <Field label="City">
                <Input name="city" />
              </Field>
            </div>
            <Field label="Current member count">
              <Input name="member_count" type="number" />
            </Field>
            <Field label="Message">
              <Textarea name="message" placeholder="Branches, current software, what you need" />
            </Field>
            <Button type="submit" disabled={mut.isPending}>
              Send
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
