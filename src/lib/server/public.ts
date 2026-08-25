import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { nid } from "@/lib/utils";
import type { Facility, Gym, MembershipPlan, PublicGym, Testimonial, Trainer, Transformation } from "@/lib/types";
import { asGym, gymSlugFromHost, num } from "./helpers";

function mapPlan(r: Record<string, unknown>): MembershipPlan {
  return {
    id: String(r.id),
    gym_id: String(r.gym_id),
    name: String(r.name),
    duration_days: num(r.duration_days),
    price: num(r.price),
    is_active: Boolean(r.is_active),
    display_order: num(r.display_order),
  };
}

function mapFacility(r: Record<string, unknown>): Facility {
  return {
    id: String(r.id),
    gym_id: String(r.gym_id),
    name: String(r.name),
    icon: (r.icon as string) ?? null,
    description: (r.description as string) ?? null,
    image_url: (r.image_url as string) ?? null,
    display_order: num(r.display_order),
    is_visible: Boolean(r.is_visible),
  };
}

export async function loadPublicGym(slug: string): Promise<PublicGym | null> {
  const sql = await getSql();
  const gyms = await sql.query(`select * from gyms where slug = $1`, [slug]);
  const gym = asGym(gyms[0] as Record<string, unknown>);
  if (!gym) return null;
  const [plans, amenities, equipment, trainers, testimonials, transformations] = await Promise.all([
    sql.query(`select * from plans where gym_id = $1 and is_active = true order by display_order`, [gym.id]),
    sql.query(`select * from amenities where gym_id = $1 and is_visible = true order by display_order`, [gym.id]),
    sql.query(`select * from equipment where gym_id = $1 and is_visible = true order by display_order`, [gym.id]),
    sql.query(`select * from trainers where gym_id = $1 and is_visible = true order by display_order`, [gym.id]),
    sql.query(`select * from testimonials where gym_id = $1 and is_visible = true`, [gym.id]),
    sql.query(`select * from transformations where gym_id = $1 and is_visible = true`, [gym.id]),
  ]);
  return {
    gym,
    plans: plans.map((r) => mapPlan(r as Record<string, unknown>)),
    amenities: amenities.map((r) => mapFacility(r as Record<string, unknown>)),
    equipment: equipment.map((r) => mapFacility(r as Record<string, unknown>)),
    trainers: trainers.map((r) => ({
      id: String(r.id),
      gym_id: String(r.gym_id),
      user_id: (r.user_id as string) ?? null,
      name: String(r.name),
      photo_url: (r.photo_url as string) ?? null,
      speciality: (r.speciality as string) ?? null,
      bio: (r.bio as string) ?? null,
      phone: (r.phone as string) ?? null,
      display_order: num(r.display_order),
      is_visible: Boolean(r.is_visible),
    })) as Trainer[],
    testimonials: testimonials as unknown as Testimonial[],
    transformations: transformations as unknown as Transformation[],
  };
}

export const getPublicGym = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => loadPublicGym(slug));

export const resolveHostGym = createServerFn({ method: "GET" }).handler(async () => {
  const { getRequest } = await import("@tanstack/react-start/server");
  const req = getRequest();
  const host = String(req?.headers.get("x-forwarded-host") ?? req?.headers.get("host") ?? "");
  const slug = gymSlugFromHost(host);
  if (!slug) return { slug: null as string | null };
  return { slug };
});

export const submitLead = createServerFn({ method: "POST" })
  .validator((d: {
    gym_name: string;
    owner_name: string;
    phone?: string;
    city?: string;
    member_count?: number;
    message?: string;
  }) => d)
  .handler(async ({ data }) => {
    if (!data.gym_name?.trim() || !data.owner_name?.trim()) {
      throw new Error("Gym name and owner name are required");
    }
    const sql = await getSql();
    await sql.query(
      `insert into leads (id, gym_name, owner_name, phone, city, member_count, message)
       values ($1,$2,$3,$4,$5,$6,$7)`,
      [
        nid("lead"),
        data.gym_name.trim(),
        data.owner_name.trim(),
        data.phone?.trim() || null,
        data.city?.trim() || null,
        data.member_count ?? null,
        data.message?.trim() || null,
      ],
    );
    return { ok: true };
  });

export const submitEnquiry = createServerFn({ method: "POST" })
  .validator((d: { slug: string; name: string; phone?: string; message?: string }) => d)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const gyms = await sql.query<{ id: string }>(`select id from gyms where slug = $1`, [data.slug]);
    if (!gyms[0]) throw new Error("Gym not found");
    await sql.query(
      `insert into enquiries (id, gym_id, name, phone, message) values ($1,$2,$3,$4,$5)`,
      [nid("enq"), gyms[0].id, data.name.trim(), data.phone?.trim() || null, data.message?.trim() || null],
    );
    return { ok: true };
  });

export const publicSignup = createServerFn({ method: "POST" })
  .validator((d: {
    slug: string;
    full_name: string;
    phone?: string;
    email?: string;
    gender?: string;
  }) => d)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const gyms = await sql.query(`select * from gyms where slug = $1`, [data.slug]);
    const gym = asGym(gyms[0] as Record<string, unknown>);
    if (!gym) throw new Error("Gym not found");
    await sql.query(
      `insert into members (id, gym_id, full_name, phone, email, gender, status, joined_at)
       values ($1,$2,$3,$4,$5,$6,'pending', current_date)`,
      [
        nid("mem"),
        gym.id,
        data.full_name.trim(),
        data.phone?.trim() || null,
        data.email?.trim() || null,
        data.gender || null,
      ],
    );
    return { ok: true };
  });

export const listShowcaseGyms = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql.query(
    `select id, name, slug, city, cover_image_url, brand_color, about_text
     from gyms where onboarding_completed = true order by created_at desc limit 6`,
  );
  return rows as Pick<Gym, "id" | "name" | "slug" | "city" | "cover_image_url" | "brand_color" | "about_text">[];
});
