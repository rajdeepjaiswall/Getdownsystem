import { Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowRight,
  ClipboardList,
  Dumbbell,
  Image as ImageIcon,
  MessageCircle,
  QrCode,
  ScrollText,
  Shield,
  Smartphone,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Wordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PLANS, WHATSAPP_LINK, FOUNDATION, FOUNDATION_CITY } from "@/lib/constants";
import { submitLead } from "@/lib/server/public";
import { inr, cn } from "@/lib/utils";

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <div className="h-11 w-24 animate-pulse rounded-lg bg-border" />;
  if (user) {
    return (
      <Button asChild size="sm">
        <Link to="/go">Open app</Link>
      </Button>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <Link to="/login" className="hidden text-sm font-medium text-text-muted hover:text-text sm:inline">
        Log in
      </Link>
      <Button asChild size="sm">
        <Link to="/signup">Start free</Link>
      </Button>
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Wordmark />
        <nav className="hidden items-center gap-6 text-sm font-medium text-text-muted md:flex">
          <a href="#features" className="hover:text-text">
            Features
          </a>
          <a href="#pricing" className="hover:text-text">
            Pricing
          </a>
          <a href="#contact" className="hover:text-text">
            Contact
          </a>
        </nav>
        <AuthSlot />
      </div>
    </header>
  );
}

function DashboardMock() {
  const rows = [
    { name: "Aman Verma", plan: "Monthly", due: "5d", ok: true },
    { name: "Anjali Tiwari", plan: "Monthly", due: "3d", ok: false },
    { name: "Priya Singh", plan: "Yearly", due: "165d", ok: true },
    { name: "Sanjay Srivastava", plan: "Monthly", due: "12d", ok: true },
  ];
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-soft)] sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="label-caps">Shakti Fitness · today</p>
          <p className="mt-1 font-display text-2xl text-text">Members</p>
        </div>
        <div className="rounded-lg bg-accent-clay/10 px-3 py-2 text-right">
          <p className="label-caps">Renewals due</p>
          <p className="font-display text-3xl tabular-nums text-accent-clay">12</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary-tint/60 text-text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Member</th>
              <th className="px-3 py-2 font-medium">Plan</th>
              <th className="px-3 py-2 font-medium text-right">Left</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-border">
                <td className="px-3 py-2.5 font-medium">{r.name}</td>
                <td className="px-3 py-2.5 text-text-muted">{r.plan}</td>
                <td
                  className={cn(
                    "px-3 py-2.5 text-right tabular-nums",
                    r.ok ? "text-text-muted" : "font-medium text-accent-clay",
                  )}
                >
                  {r.due}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-text-muted">42 / 50 members used</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
        <div className="h-full w-4/5 rounded-full bg-primary" />
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: Users, title: "Member records", body: "Every name, phone and photo. Search instead of flipping the register." },
  { icon: Wallet, title: "Plans and renewals", body: "Monthly, quarterly, yearly. A list of who is due this week, not a surprise at the gate." },
  { icon: QrCode, title: "QR check-in", body: "A code on the door. Members scan. You see who came, and who has not." },
  { icon: Shield, title: "Staff and trainer logins", body: "Front desk sees operations. Trainers see their clients. You see everything." },
  { icon: Smartphone, title: "Member mobile app", body: "Their plan, days left, and a check-in button — branded as your gym." },
  { icon: ClipboardList, title: "Enquiries and leads", body: "The form on your public page writes straight into a list you can call back." },
  { icon: ImageIcon, title: "Transformations gallery", body: "Before and after, on your page. The reason someone walking past comes in." },
  { icon: ScrollText, title: "Reports", body: "Capacity, attendance, money in. One screen instead of three notebooks." },
];

function PricingRail({ hover }: { hover: number | null }) {
  const idx = hover ?? -1;
  const fill = idx < 0 ? 0 : idx === 3 ? 100 : ((idx + 1) / 4) * 100;
  const label = idx < 0 ? "" : idx === 3 ? "∞" : String([50, 100, 150][idx]);
  return (
    <div className="relative mt-6 px-1">
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out motion-reduce:transition-none"
          style={{ width: `${fill}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-text-muted">
        <span className="label-caps">Capacity</span>
        <span className="font-display text-3xl tabular-nums text-accent-clay" aria-live="polite">
          {label || "—"}
        </span>
      </div>
    </div>
  );
}

function Pricing() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <section id="pricing" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <p className="label-caps">Pricing</p>
        <h2 className="mt-2 max-w-xl font-display text-3xl sm:text-4xl">
          Four prices. One product. The only difference is how many members you can hold.
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p, i) => (
            <Card
              key={p.id}
              tabIndex={0}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className={cn(
                "flex flex-col p-5 transition-colors",
                p.popular && "border-primary ring-1 ring-primary",
                p.enterprise && "border-accent-clay/40",
              )}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{p.name}</p>
                {p.popular ? <Badge>Most popular</Badge> : null}
              </div>
              <p className="mt-4 font-display text-4xl tabular-nums text-text">
                {p.price == null ? (
                  <span className="text-accent-clay">Custom</span>
                ) : (
                  <>
                    {inr(p.price)}
                    <span className="ml-1 text-base font-sans font-normal text-text-muted">/month</span>
                  </>
                )}
              </p>
              <p className="mt-2 text-sm text-text-muted">
                {p.enterprise ? "150+ members, or more than one branch" : `Up to ${p.memberCap} members`}
              </p>
              <div className="mt-auto pt-6">
                {p.enterprise ? (
                  <Button asChild variant="clay" className="w-full">
                    <Link to="/contact">Contact us</Link>
                  </Button>
                ) : (
                  <Button asChild variant={p.popular ? "default" : "outline"} className="w-full">
                    <Link to="/signup" search={{ plan: p.id }}>
                      Start free
                    </Link>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
        <PricingRail hover={hover} />
        <p className="mt-6 max-w-2xl text-sm text-text">
          <strong>Every plan includes every feature and unlimited staff logins. Only the member limit changes.</strong>
        </p>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const mut = useMutation({
    mutationFn: submitLead,
    onSuccess: () => {
      setSent(true);
      toast.success("We have the note. Someone will call.");
    },
    onError: () => toast.error("Could not send. Try WhatsApp."),
  });
  return (
    <section id="contact" className="scroll-mt-20 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-24 lg:grid-cols-2">
        <div>
          <p className="label-caps">Talk to us</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">
            Sit with the register. We will tell you if software is worth it.
          </h2>
          <p className="mt-4 text-text-muted">
            Getdown Fitness is built by {FOUNDATION}, {FOUNDATION_CITY}. The first gyms we take on, we sit with in
            person.
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-white hover:bg-primary-hover"
          >
            <MessageCircle className="size-4" />
            WhatsApp us
          </a>
        </div>
        {sent ? (
          <Card className="flex flex-col justify-center p-8">
            <p className="font-display text-2xl">Received.</p>
            <p className="mt-2 text-text-muted">We will call the number you left. No drip emails.</p>
          </Card>
        ) : (
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              mut.mutate({
                data: {
                  gym_name: String(fd.get("gym_name") || ""),
                  owner_name: String(fd.get("owner_name") || ""),
                  phone: String(fd.get("phone") || ""),
                  city: String(fd.get("city") || ""),
                  member_count: Number(fd.get("member_count") || 0) || undefined,
                  message: String(fd.get("message") || ""),
                },
              });
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Gym name">
                <Input name="gym_name" required placeholder="Shakti Fitness" />
              </Field>
              <Field label="Owner name">
                <Input name="owner_name" required placeholder="Your name" />
              </Field>
              <Field label="Phone">
                <Input name="phone" type="tel" required placeholder="98xxxxxxxx" />
              </Field>
              <Field label="City">
                <Input name="city" placeholder="Prayagraj" />
              </Field>
            </div>
            <Field label="Current member count">
              <Input name="member_count" type="number" min={0} placeholder="80" />
            </Field>
            <Field label="Message">
              <Textarea name="message" placeholder="How you run the gym today" />
            </Field>
            <Button type="submit" disabled={mut.isPending}>
              {mut.isPending ? "Sending…" : "Send"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

export function MarketingHome() {
  return (
    <div className="min-h-dvh bg-bg">
      <Nav />
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:py-20 lg:grid-cols-2">
        <div className="fade-up">
          <img
            src="/getdown-logo.jpg"
            alt="Getdown Foundation"
            className="mb-6 h-14 w-auto object-contain object-left sm:h-16"
          />
          <p className="label-caps">Gym software · Prayagraj</p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-text sm:text-5xl">
            Run the gym without the register.
          </h1>
          <p className="mt-4 max-w-md text-base text-text-muted sm:text-lg">
            Memberships, renewals, check-ins and staff — in your name, on your phone. Built for a single-location gym
            that still keeps names in a notebook and reminders on WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/signup">
                Start free <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Talk to us</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-text-muted">
            Or{" "}
            <Link to="/g/$slug" params={{ slug: "shakti-fitness" }} className="font-medium text-primary">
              open a live gym page
            </Link>{" "}
            to see what members see.
          </p>
        </div>
        <div className="fade-up">
          <DashboardMock />
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:grid-cols-3">
          {[
            {
              icon: ScrollText,
              title: "The register",
              body: "A name, a date, a tick. It works until the page tears, the ink fades, and you cannot find who paid in March.",
            },
            {
              icon: Wallet,
              title: "The missed renewals",
              body: "People keep training. You keep being nice. At month-end the cash does not match the floor.",
            },
            {
              icon: MessageCircle,
              title: "The WhatsApp chaos",
              body: "Diet charts in one chat, overdue fees in another, the trainer asking who is coming tomorrow in a third.",
            },
          ].map((c) => (
            <Card key={c.title} className="p-5">
              <c.icon className="size-5 text-primary" />
              <h3 className="mt-3 font-display text-xl">{c.title}</h3>
              <p className="mt-2 text-sm text-text-muted">{c.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="features" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <p className="label-caps">What you get</p>
          <h2 className="mt-2 max-w-xl font-display text-3xl sm:text-4xl">
            The desk, the gate, and the member’s phone — one system.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <Card key={f.title} className="p-5">
                <f.icon className="size-5 text-primary" />
                <h3 className="mt-3 font-medium">{f.title}</h3>
                <p className="mt-1.5 text-sm text-text-muted">{f.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Pricing />

      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
          <p className="label-caps">Questions</p>
          <h2 className="mt-2 font-display text-3xl">Before you decide on ₹2,500 a month.</h2>
          <Accordion type="single" collapsible className="mt-8">
            <AccordionItem value="cap">
              <AccordionTrigger>What happens when I cross my member limit?</AccordionTrigger>
              <AccordionContent>
                New active members are blocked until you upgrade. Existing people keep training. We show a plain
                upgrade link — not a database error. You can also ask us to raise the cap by hand for Enterprise deals.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="change">
              <AccordionTrigger>Can I change plans?</AccordionTrigger>
              <AccordionContent>
                Yes. Starter, Growth and Pro are the same product. Move up when the floor fills. Move down at the next
                billing date if you shrink. Enterprise is quoted, not self-serve.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="safe">
              <AccordionTrigger>Is my member data safe?</AccordionTrigger>
              <AccordionContent>
                Each gym is a tenant. Queries are scoped to your gym. Another owner cannot open your register. Staff see
                operations; they do not see your billing settings.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="app">
              <AccordionTrigger>Do my members need to install anything?</AccordionTrigger>
              <AccordionContent>
                No. The member app is a website that sits on a phone like an app. They can add it to the home screen.
                Check-in is a QR on your door.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Contact />

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Wordmark />
            <p className="mt-3 max-w-sm text-sm text-text-muted">
              {FOUNDATION}, {FOUNDATION_CITY}. Software for gyms that still know their members by name.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
            <Link to="/g/$slug" params={{ slug: "shakti-fitness" }} className="hover:text-text">
              Sample gym
            </Link>
            <Link to="/login" className="hover:text-text">
              Log in
            </Link>
            <Link to="/login" search={{ next: "/god" }} className="text-text-muted/70 hover:text-text-muted">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
