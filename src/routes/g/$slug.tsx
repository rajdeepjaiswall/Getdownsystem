import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Clock, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/label";
import { Input, Textarea } from "@/components/ui/input";
import { getPublicGym, submitEnquiry } from "@/lib/server/public";
import { inr } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

export const Route = createFileRoute("/g/$slug")({ component: GymPage });

function GymPage() {
  const { slug } = Route.useParams();
  const q = useQuery({ queryKey: ["public-gym", slug], queryFn: () => getPublicGym({ data: slug }) });
  const [sent, setSent] = useState(false);
  const mut = useMutation({
    mutationFn: submitEnquiry,
    onSuccess: () => {
      setSent(true);
      toast.success("Enquiry sent. They will call you.");
    },
  });

  if (q.isPending) {
    return <div className="min-h-dvh bg-bg p-8 text-text-muted">Loading gym…</div>;
  }
  if (!q.data) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg px-4 text-center">
        <div>
          <h1 className="font-display text-3xl">No gym at this address</h1>
          <Button asChild className="mt-4">
            <Link to="/">Getdown Fitness</Link>
          </Button>
        </div>
      </div>
    );
  }
  const { gym, plans, amenities, equipment, trainers, testimonials, transformations } = q.data;
  const color = gym.brand_color || "#5B8C51";

  return (
    <div className="min-h-dvh bg-bg">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3 min-w-0">
            {gym.logo_url ? (
              <img src={gym.logo_url} alt="" className="h-9 w-9 rounded-md object-cover" />
            ) : (
              <span className="grid h-9 w-9 place-items-center rounded-md text-white" style={{ background: color }}>
                {gym.name[0]}
              </span>
            )}
            <span className="truncate font-display text-lg">{gym.name}</span>
          </div>
          <a href="#enquire" className="text-sm font-medium" style={{ color }}>
            Join
          </a>
        </div>
      </header>

      <div className="relative h-56 w-full sm:h-80">
        {gym.cover_image_url ? (
          <img src={gym.cover_image_url} alt="" className="size-full object-cover" />
        ) : (
          <div className="size-full" style={{ background: color }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-text/50 to-transparent" />
        <div className="absolute bottom-4 left-0 right-0 mx-auto max-w-5xl px-4 text-white">
          <h1 className="font-display text-4xl">{gym.name}</h1>
          <p className="mt-1 text-sm opacity-90">
            {[gym.city, gym.established_year ? `Est. ${gym.established_year}` : null].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-5xl space-y-14 px-4 py-10">
        <section className="grid gap-6 lg:grid-cols-3">
          <p className="text-text-muted lg:col-span-2">{gym.about_text}</p>
          <Card className="space-y-3 p-5 text-sm">
            {gym.address ? (
              <p className="flex gap-2">
                <MapPin className="mt-0.5 size-4 text-primary" /> {gym.address}
              </p>
            ) : null}
            {gym.phone ? (
              <p className="flex gap-2">
                <Phone className="mt-0.5 size-4 text-primary" /> {gym.phone}
              </p>
            ) : null}
            {gym.opening_hours ? (
              <div className="flex gap-2">
                <Clock className="mt-0.5 size-4 text-primary" />
                <ul>
                  {Object.entries(gym.opening_hours).map(([d, h]) => (
                    <li key={d} className="capitalize">
                      <span className="inline-block w-10 text-text-muted">{d}</span> {h}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Card>
        </section>

        {plans.length ? (
          <section>
            <h2 className="font-display text-2xl">Memberships</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {plans.map((p) => (
                <Card key={p.id} className="p-5">
                  <p className="font-medium">{p.name}</p>
                  <p className="mt-2 font-display text-3xl tabular-nums" style={{ color }}>
                    {inr(p.price)}
                  </p>
                  <p className="text-sm text-text-muted">{p.duration_days} days</p>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        {amenities.length ? (
          <section>
            <h2 className="font-display text-2xl">Amenities</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {amenities.map((a) => (
                <Card key={a.id} className="overflow-hidden">
                  {a.image_url ? <img src={a.image_url} alt="" className="h-36 w-full object-cover" /> : null}
                  <div className="p-4">
                    <p className="font-medium">{a.name}</p>
                    {a.description ? <p className="mt-1 text-sm text-text-muted">{a.description}</p> : null}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        {equipment.length ? (
          <section>
            <h2 className="font-display text-2xl">Equipment</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {equipment.map((a) => (
                <Card key={a.id} className="overflow-hidden">
                  {a.image_url ? <img src={a.image_url} alt="" className="h-36 w-full object-cover" /> : null}
                  <div className="p-4">
                    <p className="font-medium">{a.name}</p>
                    {a.description ? <p className="mt-1 text-sm text-text-muted">{a.description}</p> : null}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        {trainers.length ? (
          <section>
            <h2 className="font-display text-2xl">Trainers</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {trainers.map((t) => (
                <Card key={t.id} className="flex gap-4 p-4">
                  {t.photo_url ? (
                    <img src={t.photo_url} alt="" className="h-24 w-20 rounded-md object-cover" />
                  ) : (
                    <div className="grid h-24 w-20 place-items-center rounded-md bg-primary-tint font-display text-2xl">
                      {t.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm" style={{ color }}>
                      {t.speciality}
                    </p>
                    <p className="mt-1 text-sm text-text-muted">{t.bio}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        {transformations.length ? (
          <section>
            <h2 className="font-display text-2xl">Transformations</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {transformations.map((t) => (
                <Card key={t.id} className="overflow-hidden">
                  {t.after_url ? <img src={t.after_url} alt="" className="h-56 w-full object-cover" /> : null}
                  <div className="p-4">
                    <p className="font-medium">{t.member_name}</p>
                    <p className="mt-1 text-sm text-text-muted">{t.story}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        {testimonials.length ? (
          <section className="grid gap-3 sm:grid-cols-2">
            {testimonials.map((t) => (
              <blockquote key={t.id} className="rounded-lg border border-border bg-surface p-5">
                <p className="text-text">“{t.quote}”</p>
                <footer className="mt-3 text-sm text-text-muted">— {t.member_name}</footer>
              </blockquote>
            ))}
          </section>
        ) : null}

        <section id="enquire" className="scroll-mt-20">
          <h2 className="font-display text-2xl">Enquire</h2>
          <p className="mt-1 text-sm text-text-muted">
            Fill this and it lands on {gym.name}’s desk — not a shared inbox.
          </p>
          {sent ? (
            <p className="mt-4 font-medium">Sent. They have your number.</p>
          ) : (
            <form
              className="mt-4 grid max-w-lg gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                mut.mutate({
                  data: {
                    slug,
                    name: String(fd.get("name") || ""),
                    phone: String(fd.get("phone") || ""),
                    message: String(fd.get("message") || ""),
                  },
                });
              }}
            >
              <Field label="Your name">
                <Input name="name" required />
              </Field>
              <Field label="Phone">
                <Input name="phone" type="tel" required />
              </Field>
              <Field label="Message">
                <Textarea name="message" placeholder="Looking for a morning batch…" />
              </Field>
              <Button type="submit" style={{ background: color }} disabled={mut.isPending}>
                Send enquiry
              </Button>
            </form>
          )}
          <p className="mt-6">
            <Link
              to="/g/$slug/join"
              params={{ slug }}
              className="text-sm font-medium"
              style={{ color }}
            >
              Already decided? Fill your own membership form →
            </Link>
          </p>
        </section>
      </main>
      {gym.show_powered_by ? (
        <footer className="border-t border-border py-6 text-center text-xs text-text-muted">
          Powered by {APP_NAME}
        </footer>
      ) : null}
    </div>
  );
}
