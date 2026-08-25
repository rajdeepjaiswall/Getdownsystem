import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { RoleGate, useSessionContext } from "@/components/role-gate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/label";
import { Input, Textarea } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Wordmark } from "@/components/brand";
import {
  importMembers,
  listPlans,
  saveFacility,
  saveTrainer,
  seedDefaultPlans,
  updateGym,
  upsertMember,
} from "@/lib/server/admin";
import { DEFAULT_AMENITIES, DEFAULT_EQUIPMENT, DEFAULT_MEMBERSHIP_PLANS } from "@/lib/constants";
import { fileToDataUrl } from "@/lib/file-to-data-url";
import { toast } from "sonner";
import type { Gym } from "@/lib/types";

type GymPatch = Record<string, string | number | boolean | null | undefined | Record<string, string>>;

export const Route = createFileRoute("/setup/")({ component: Setup });

function Setup() {
  return (
    <RoleGate allow={["gym_owner", "super_admin"]}>
      <Wizard />
    </RoleGate>
  );
}

function Wizard() {
  const { ctx } = useSessionContext();
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const gym = ctx?.gym;
  if (!gym) return <Navigate to="/signup" />;

  const steps = ["Identity", "Plans", "Facilities", "Trainers", "Members", "Story", "Live"];

  async function persistGym(patch: GymPatch) {
    await updateGym({ data: patch });
    await qc.invalidateQueries({ queryKey: ["me"] });
  }

  return (
    <div className="min-h-dvh bg-bg">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Wordmark to="/admin" />
          <button
            type="button"
            className="text-sm text-text-muted"
            onClick={async () => {
              await persistGym({ onboarding_completed: true });
              window.location.href = "/admin";
            }}
          >
            Skip
          </button>
        </div>
      </header>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="label-caps">
          Step {step + 1} of {steps.length}
        </p>
        <div className="mt-2 flex gap-1">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        {step === 0 ? <Identity gym={gym} onNext={() => setStep(1)} persist={persistGym} /> : null}
        {step === 1 ? <PlansStep onNext={() => setStep(2)} onBack={() => setStep(0)} /> : null}
        {step === 2 ? <FacilitiesStep onNext={() => setStep(3)} onBack={() => setStep(1)} /> : null}
        {step === 3 ? <TrainersStep onNext={() => setStep(4)} onBack={() => setStep(2)} /> : null}
        {step === 4 ? <MembersStep slug={gym.slug} onNext={() => setStep(5)} onBack={() => setStep(3)} /> : null}
        {step === 5 ? <StoryStep onNext={() => setStep(6)} onBack={() => setStep(4)} persist={persistGym} /> : null}
        {step === 6 ? <Done slug={gym.slug} persist={persistGym} /> : null}
      </div>
    </div>
  );
}

function Identity({
  gym,
  onNext,
  persist,
}: {
  gym: Gym;
  onNext: () => void;
  persist: (p: GymPatch) => Promise<void>;
}) {
  return (
    <form
      className="mt-8 grid gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const logo = fd.get("logo") as File | null;
        const cover = fd.get("cover") as File | null;
        await persist({
          name: String(fd.get("name") || ""),
          city: String(fd.get("city") || ""),
          address: String(fd.get("address") || ""),
          phone: String(fd.get("phone") || ""),
          brand_color: String(fd.get("brand_color") || "#5B8C51"),
          opening_hours: {
            mon: String(fd.get("hours") || "6:00–22:00"),
            tue: String(fd.get("hours") || "6:00–22:00"),
            wed: String(fd.get("hours") || "6:00–22:00"),
            thu: String(fd.get("hours") || "6:00–22:00"),
            fri: String(fd.get("hours") || "6:00–22:00"),
            sat: String(fd.get("hours") || "6:00–21:00"),
            sun: String(fd.get("sun") || "7:00–13:00"),
          },
          logo_url: logo && logo.size ? await fileToDataUrl(logo) : undefined,
          cover_image_url: cover && cover.size ? await fileToDataUrl(cover) : undefined,
        });
        onNext();
      }}
    >
      <h1 className="font-display text-3xl">Gym identity</h1>
      <p className="text-sm text-text-muted">Saved as you go. Close the tab; come back.</p>
      <Field label="Gym name">
        <Input name="name" defaultValue={gym.name} required />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="City">
          <Input name="city" defaultValue={gym.city ?? ""} />
        </Field>
        <Field label="Phone">
          <Input name="phone" defaultValue={gym.phone ?? ""} />
        </Field>
      </div>
      <Field label="Address">
        <Input name="address" defaultValue={gym.address ?? ""} />
      </Field>
      <Field label="Weekday hours">
        <Input name="hours" defaultValue="6:00–22:00" />
      </Field>
      <Field label="Brand colour">
        <Input name="brand_color" type="color" defaultValue={gym.brand_color ?? "#5B8C51"} className="h-11 w-20 p-1" />
      </Field>
      <Field label="Logo">
        <Input name="logo" type="file" accept="image/*" />
      </Field>
      <Field label="Cover photo">
        <Input name="cover" type="file" accept="image/*" />
      </Field>
      <Button type="submit">Continue</Button>
    </form>
  );
}

function PlansStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const plans = useQuery({ queryKey: ["plans"], queryFn: () => listPlans() });
  const [rows, setRows] = useState(DEFAULT_MEMBERSHIP_PLANS);
  return (
    <div className="mt-8">
      <h1 className="font-display text-3xl">Your plans</h1>
      <p className="mt-2 text-sm text-text-muted">Three typical Indian gym plans. Edit, don’t start from zero.</p>
      <div className="mt-6 grid gap-3">
        {rows.map((r, i) => (
          <Card key={i} className="grid gap-2 p-4 sm:grid-cols-3">
            <Input
              value={r.name}
              onChange={(e) => setRows((x) => x.map((y, j) => (j === i ? { ...y, name: e.target.value } : y)))}
            />
            <Input
              type="number"
              value={r.durationDays}
              onChange={(e) =>
                setRows((x) => x.map((y, j) => (j === i ? { ...y, durationDays: Number(e.target.value) } : y)))
              }
            />
            <Input
              type="number"
              value={r.price}
              onChange={(e) => setRows((x) => x.map((y, j) => (j === i ? { ...y, price: Number(e.target.value) } : y)))}
            />
          </Card>
        ))}
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={async () => {
            if (!plans.data?.length) {
              await seedDefaultPlans({
                data: {
                  plans: rows.map((r) => ({
                    name: r.name,
                    duration_days: r.durationDays,
                    price: r.price,
                  })),
                },
              });
            }
            onNext();
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

function FacilitiesStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [am, setAm] = useState<string[]>(["Air conditioning", "Lockers", "Drinking water"]);
  const [eq, setEq] = useState<string[]>(["Dumbbells", "Treadmills", "Squat rack"]);
  const [extra, setExtra] = useState("");
  function toggle(list: string[], set: (s: string[]) => void, name: string) {
    set(list.includes(name) ? list.filter((x) => x !== name) : [...list, name]);
  }
  return (
    <div className="mt-8">
      <h1 className="font-display text-3xl">Facilities</h1>
      <p className="mt-2 text-sm text-text-muted">
        Tick what you have. Each tick becomes a row you can photograph later. This list is what members see.
      </p>
      <p className="label-caps mt-6">Amenities</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {DEFAULT_AMENITIES.map((a) => (
          <label key={a.name} className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm">
            <Checkbox checked={am.includes(a.name)} onCheckedChange={() => toggle(am, setAm, a.name)} />
            {a.name}
          </label>
        ))}
      </div>
      <p className="label-caps mt-6">Equipment</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {DEFAULT_EQUIPMENT.map((a) => (
          <label key={a.name} className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm">
            <Checkbox checked={eq.includes(a.name)} onCheckedChange={() => toggle(eq, setEq, a.name)} />
            {a.name}
          </label>
        ))}
      </div>
      <Field label="Anything missing?" className="mt-4">
        <Input value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Steam, combat class…" />
      </Field>
      <div className="mt-6 flex gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={async () => {
            for (const name of am) {
              await saveFacility({ data: { kind: "amenities", name } });
            }
            for (const name of eq) {
              await saveFacility({ data: { kind: "equipment", name } });
            }
            if (extra.trim()) await saveFacility({ data: { kind: "amenities", name: extra.trim() } });
            onNext();
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

function TrainersStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="mt-8">
      <h1 className="font-display text-3xl">Trainers</h1>
      <p className="mt-2 text-sm text-text-muted">Skippable. Add a face if you have one.</p>
      <form
        className="mt-6 grid gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const name = String(fd.get("name") || "").trim();
          if (name) {
            const photo = fd.get("photo") as File | null;
            await saveTrainer({
              data: {
                name,
                speciality: String(fd.get("speciality") || ""),
                photo_url: photo && photo.size ? await fileToDataUrl(photo) : undefined,
              },
            });
          }
          onNext();
        }}
      >
        <Field label="Name">
          <Input name="name" />
        </Field>
        <Field label="Speciality">
          <Input name="speciality" placeholder="Strength, weight loss…" />
        </Field>
        <Field label="Photo">
          <Input name="photo" type="file" accept="image/*" />
        </Field>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </div>
  );
}

function MembersStep({ slug, onNext, onBack }: { slug: string; onNext: () => void; onBack: () => void }) {
  const join =
    typeof window !== "undefined" ? `${window.location.origin}/g/${slug}/join` : `/g/${slug}/join`;
  return (
    <div className="mt-8">
      <h1 className="font-display text-3xl">Your members</h1>
      <p className="mt-2 text-sm text-text-muted">Three ways in. The third is how a 200-name register actually finishes.</p>
      <Card className="mt-6 border-primary p-5">
        <p className="label-caps">Most useful</p>
        <p className="mt-1 font-medium">Share a signup link or QR</p>
        <p className="mt-1 text-sm text-text-muted">Member fills details on their phone. You approve from Signups.</p>
        <p className="mt-3 break-all font-mono text-xs">{join}</p>
        <img
          alt="QR"
          className="mt-3 h-36 w-36"
          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(join)}`}
        />
      </Card>
      <Card className="mt-3 p-5">
        <p className="font-medium">Type one in</p>
        <form
          className="mt-3 grid gap-2 sm:grid-cols-[1fr_8rem_auto]"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            try {
              await upsertMember({
                data: {
                  full_name: String(fd.get("full_name") || ""),
                  phone: String(fd.get("phone") || ""),
                },
              });
              toast.success("Added");
              e.currentTarget.reset();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Could not add");
            }
          }}
        >
          <Input name="full_name" required placeholder="Name" />
          <Input name="phone" placeholder="Phone" />
          <Button type="submit" size="sm">
            Add
          </Button>
        </form>
      </Card>
      <Card className="mt-3 p-5">
        <p className="font-medium">Bulk upload CSV</p>
        <p className="text-sm text-text-muted">Columns: full_name, phone, email. Preview before commit.</p>
        <input
          className="mt-3 text-sm"
          type="file"
          accept=".csv,text/csv"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const text = await file.text();
            const lines = text.split(/\r?\n/).filter(Boolean);
            const header = lines[0]?.split(",").map((h) => h.trim().toLowerCase()) ?? [];
            const ni = header.findIndex((h) => h.includes("name"));
            const pi = header.findIndex((h) => h.includes("phone"));
            const ei = header.findIndex((h) => h.includes("email"));
            const rows = lines.slice(1).map((line) => {
              const c = line.split(",");
              return {
                full_name: (c[ni] ?? c[0] ?? "").trim(),
                phone: (pi >= 0 ? c[pi] : "").trim(),
                email: (ei >= 0 ? c[ei] : "").trim(),
              };
            });
            const preview = rows.slice(0, 8).map((r) => r.full_name).join(", ");
            if (!confirm(`Import ${rows.length} rows? First names: ${preview}`)) return;
            const res = await importMembers({ data: { rows } });
            toast.success(`Imported ${res.imported}. Skipped ${res.skipped.length}.`);
          }}
        />
      </Card>
      <div className="mt-6 flex gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Continue</Button>
      </div>
    </div>
  );
}

function StoryStep({
  onNext,
  onBack,
  persist,
}: {
  onNext: () => void;
  onBack: () => void;
  persist: (p: GymPatch) => Promise<void>;
}) {
  const [year, setYear] = useState("2018");
  const [proud, setProud] = useState("We still know every member by name.");
  const [who, setWho] = useState("Neighbourhood people who want to train seriously without a chain-gym price.");
  const [about, setAbout] = useState(
    "Neighbourhood people who want to train seriously without a chain-gym price. We opened in 2018. We still know every member by name.",
  );
  return (
    <div className="mt-8">
      <h1 className="font-display text-3xl">Your story</h1>
      <p className="mt-2 text-sm text-text-muted">Three short answers. We draft the about text. You can rewrite it.</p>
      <div className="mt-6 grid gap-3">
        <Field label="What year did you start?">
          <Input value={year} onChange={(e) => setYear(e.target.value)} />
        </Field>
        <Field label="What are you proudest of?">
          <Input value={proud} onChange={(e) => setProud(e.target.value)} />
        </Field>
        <Field label="Who is this gym for?">
          <Input value={who} onChange={(e) => setWho(e.target.value)} />
        </Field>
        <Button type="button" variant="secondary" onClick={() => setAbout(`${who} We opened in ${year}. ${proud}`)}>
          Draft about us
        </Button>
        <Field label="About us">
          <Textarea value={about} onChange={(e) => setAbout(e.target.value)} />
        </Field>
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={async () => {
            await persist({ about_text: about, established_year: Number(year) || null });
            onNext();
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

function Done({ slug, persist }: { slug: string; persist: (p: GymPatch) => Promise<void> }) {
  return (
    <div className="mt-8">
      <h1 className="font-display text-3xl">You’re live</h1>
      <p className="mt-2 text-text-muted">
        Identity, plans, facilities, and story are on your public page. Members can join from a link. The desk is at
        the admin home.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/g/$slug" params={{ slug }}>
            Open public page
          </Link>
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            await persist({ onboarding_completed: true });
            window.location.href = "/admin";
          }}
        >
          Go to the desk
        </Button>
      </div>
    </div>
  );
}
