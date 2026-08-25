import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { DEFAULT_MEMBERSHIP_PLANS } from "@/lib/constants";
import { nid, slugify } from "@/lib/utils";
import {
  AppError,
  asGym,
  audit,
  capMessage,
  countActiveMembers,
  loadActor,
  num,
  requireAdmin,
  requireOwner,
  str,
} from "./helpers";

export const getOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireAdmin(actor);
    const sql = await getSql();
    const [used, pending, renewals, today, enquiries, red] = await Promise.all([
      countActiveMembers(gymId),
      sql.query<{ c: number }>(
        `select count(*)::int as c from members where gym_id = $1 and status = 'pending'`,
        [gymId],
      ),
      sql.query<{ c: number }>(
        `select count(*)::int as c from member_subscriptions
          where gym_id = $1 and status = 'active' and ends_on <= current_date + 7`,
        [gymId],
      ),
      sql.query<{ c: number }>(
        `select count(*)::int as c from checkins
          where gym_id = $1 and checked_in_at::date = current_date`,
        [gymId],
      ),
      sql.query<{ c: number }>(
        `select count(*)::int as c from enquiries where gym_id = $1 and status = 'new'`,
        [gymId],
      ),
      sql.query<{ c: number }>(
        `select count(*)::int as c from members m
          where m.gym_id = $1 and m.status = 'active'
            and not exists (
              select 1 from checkins c
              where c.member_id = m.id and c.checked_in_at > now() - interval '15 days'
            )`,
        [gymId],
      ),
    ]);
    const gyms = await sql.query(`select * from gyms where id = $1`, [gymId]);
    return {
      gym: asGym(gyms[0] as Record<string, unknown>),
      used,
      cap: actor.gym?.member_cap ?? 50,
      pending: pending[0]?.c ?? 0,
      renewals: renewals[0]?.c ?? 0,
      checkinsToday: today[0]?.c ?? 0,
      enquiries: enquiries[0]?.c ?? 0,
      redList: red[0]?.c ?? 0,
    };
  });

export const listMembers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { status?: string; q?: string } = {}) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireAdmin(actor);
    const sql = await getSql();
    const rows = await sql.query(
      `select m.*,
         s.ends_on as sub_ends_on,
         s.status as sub_status,
         p.name as plan_name,
         (select max(c.checked_in_at) from checkins c where c.member_id = m.id) as last_checkin
       from members m
       left join lateral (
         select * from member_subscriptions ms
         where ms.member_id = m.id
         order by ms.ends_on desc limit 1
       ) s on true
       left join plans p on p.id = s.plan_id
       where m.gym_id = $1
         and ($2::text is null or m.status = $2)
         and ($3::text is null or m.full_name ilike '%' || $3 || '%' or coalesce(m.phone,'') ilike '%' || $3 || '%')
       order by m.created_at desc`,
      [gymId, data.status || null, data.q?.trim() || null],
    );
    return rows.map((r) => ({
      id: String(r.id),
      full_name: String(r.full_name),
      status: String(r.status),
      phone: str(r.phone),
      email: str(r.email),
      plan_name: str(r.plan_name),
      sub_ends_on: str(r.sub_ends_on),
      last_checkin: str(r.last_checkin),
    }));
  });

export const upsertMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: {
    id?: string;
    full_name: string;
    phone?: string;
    email?: string;
    gender?: string;
    notes?: string;
    status?: string;
    plan_id?: string;
  }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireAdmin(actor);
    const sql = await getSql();
    const name = data.full_name.trim();
    if (!name) throw new AppError("Name is required");

    if (!data.id) {
      const gyms = await sql.query<{ member_cap: number }>(
        `select member_cap from gyms where id = $1`,
        [gymId],
      );
      const used = await countActiveMembers(gymId);
      const cap = num(gyms[0]?.member_cap, 50);
      const nextStatus = data.status ?? "active";
      if (nextStatus === "active" && used >= cap) throw new AppError(capMessage(cap));
      const id = nid("mem");
      try {
        await sql.query(
          `insert into members (id, gym_id, full_name, phone, email, gender, notes, status, joined_at)
           values ($1,$2,$3,$4,$5,$6,$7,$8, current_date)`,
          [id, gymId, name, data.phone || null, data.email || null, data.gender || null, data.notes || null, nextStatus],
        );
      } catch (e) {
        const msg = e instanceof Error ? e.message : "";
        if (msg.includes("MEMBER_CAP_EXCEEDED")) throw new AppError(capMessage(cap));
        throw e;
      }
      if (data.plan_id) {
        const plan = await sql.query<{ duration_days: number; price: number }>(
          `select duration_days, price from plans where id = $1 and gym_id = $2`,
          [data.plan_id, gymId],
        );
        if (plan[0]) {
          await sql.query(
            `insert into member_subscriptions (id, gym_id, member_id, plan_id, starts_on, ends_on, status, amount)
             values ($1,$2,$3,$4, current_date, current_date + ($5 || ' days')::interval, 'active', $6)`,
            [nid("sub"), gymId, id, data.plan_id, plan[0].duration_days, num(plan[0].price)],
          );
        }
      }
      return { id };
    }

    await sql.query(
      `update members set full_name=$3, phone=$4, email=$5, gender=$6, notes=$7, status=coalesce($8,status)
       where id = $1 and gym_id = $2`,
      [data.id, gymId, name, data.phone || null, data.email || null, data.gender || null, data.notes || null, data.status || null],
    );
    return { id: data.id };
  });

export const approveMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; plan_id?: string }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireAdmin(actor);
    const sql = await getSql();
    const used = await countActiveMembers(gymId);
    const gyms = await sql.query<{ member_cap: number }>(`select member_cap from gyms where id = $1`, [gymId]);
    const cap = num(gyms[0]?.member_cap, 50);
    if (used >= cap) throw new AppError(capMessage(cap));
    try {
      await sql.query(`update members set status = 'active' where id = $1 and gym_id = $2`, [data.id, gymId]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("MEMBER_CAP_EXCEEDED")) throw new AppError(capMessage(cap));
      throw e;
    }
    if (data.plan_id) {
      const plan = await sql.query<{ duration_days: number; price: number }>(
        `select duration_days, price from plans where id = $1 and gym_id = $2`,
        [data.plan_id, gymId],
      );
      if (plan[0]) {
        await sql.query(
          `insert into member_subscriptions (id, gym_id, member_id, plan_id, starts_on, ends_on, status, amount)
           values ($1,$2,$3,$4, current_date, current_date + ($5 || ' days')::interval, 'active', $6)`,
          [nid("sub"), gymId, data.id, data.plan_id, plan[0].duration_days, num(plan[0].price)],
        );
      }
    }
    return { ok: true };
  });

export const rejectMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireAdmin(actor);
    const sql = await getSql();
    await sql.query(`delete from members where id = $1 and gym_id = $2 and status = 'pending'`, [data.id, gymId]);
    return { ok: true };
  });

export const importMembers = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { rows: { full_name: string; phone?: string; email?: string }[] }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireAdmin(actor);
    const sql = await getSql();
    const gyms = await sql.query<{ member_cap: number }>(`select member_cap from gyms where id = $1`, [gymId]);
    const cap = num(gyms[0]?.member_cap, 50);
    let used = await countActiveMembers(gymId);
    let imported = 0;
    const skipped: string[] = [];
    for (const row of data.rows) {
      const name = row.full_name?.trim();
      if (!name) continue;
      if (used >= cap) {
        skipped.push(name);
        continue;
      }
      try {
        await sql.query(
          `insert into members (id, gym_id, full_name, phone, email, status, joined_at)
           values ($1,$2,$3,$4,$5,'active', current_date)`,
          [nid("mem"), gymId, name, row.phone || null, row.email || null],
        );
        used += 1;
        imported += 1;
      } catch {
        skipped.push(name);
      }
    }
    return { imported, skipped };
  });

export const listRenewals = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireAdmin(actor);
    const sql = await getSql();
    const rows = await sql.query(
      `select s.id, s.ends_on, s.amount, m.full_name, m.phone, p.name as plan_name
       from member_subscriptions s
       join members m on m.id = s.member_id
       left join plans p on p.id = s.plan_id
       where s.gym_id = $1 and s.status = 'active' and s.ends_on <= current_date + 14
       order by s.ends_on asc`,
      [gymId],
    );
    return rows.map((r) => ({
      id: String(r.id),
      full_name: String(r.full_name),
      phone: str(r.phone),
      plan_name: str(r.plan_name),
      ends_on: str(r.ends_on),
    }));
  });

export const renewSubscription = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { subscriptionId: string }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireAdmin(actor);
    const sql = await getSql();
    const rows = await sql.query<{
      member_id: string;
      plan_id: string | null;
      ends_on: string;
      amount: number | null;
    }>(
      `select member_id, plan_id, ends_on, amount from member_subscriptions where id = $1 and gym_id = $2`,
      [data.subscriptionId, gymId],
    );
    const s = rows[0];
    if (!s) throw new AppError("Subscription not found");
    let days = 30;
    if (s.plan_id) {
      const p = await sql.query<{ duration_days: number }>(`select duration_days from plans where id = $1`, [s.plan_id]);
      days = p[0]?.duration_days ?? 30;
    }
    await sql.query(`update member_subscriptions set status = 'renewed' where id = $1`, [data.subscriptionId]);
    await sql.query(
      `insert into member_subscriptions (id, gym_id, member_id, plan_id, starts_on, ends_on, status, amount)
       values ($1,$2,$3,$4, greatest(current_date, $5::date), greatest(current_date, $5::date) + ($6 || ' days')::interval, 'active', $7)`,
      [nid("sub"), gymId, s.member_id, s.plan_id, s.ends_on, days, s.amount],
    );
    return { ok: true };
  });

export const listCheckins = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireAdmin(actor);
    const sql = await getSql();
    const rows = await sql.query(
      `select c.id, c.checked_in_at, c.source, m.full_name
       from checkins c join members m on m.id = c.member_id
       where c.gym_id = $1 order by c.checked_in_at desc limit 200`,
      [gymId],
    );
    return rows.map((r) => ({
      id: String(r.id),
      full_name: String(r.full_name),
      checked_in_at: String(r.checked_in_at),
      source: String(r.source),
    }));
  });

export const listEnquiries = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireAdmin(actor);
    const sql = await getSql();
    const rows = await sql.query(
      `select id, name, phone, message, status, created_at from enquiries where gym_id = $1 order by created_at desc`,
      [gymId],
    );
    return rows.map((r) => ({
      id: String(r.id),
      name: String(r.name),
      phone: str(r.phone),
      message: str(r.message),
      status: String(r.status),
      created_at: String(r.created_at),
    }));
  });

export const setEnquiryStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; status: string }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireAdmin(actor);
    const sql = await getSql();
    await sql.query(`update enquiries set status = $3 where id = $1 and gym_id = $2`, [data.id, gymId, data.status]);
    return { ok: true };
  });

export const listRedList = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireAdmin(actor);
    const sql = await getSql();
    const rows = await sql.query(
      `select m.id, m.full_name, m.phone,
         (select max(c.checked_in_at) from checkins c where c.member_id = m.id) as last_checkin
       from members m
       where m.gym_id = $1 and m.status = 'active'
         and not exists (
           select 1 from checkins c
           where c.member_id = m.id and c.checked_in_at > now() - interval '15 days'
         )
       order by last_checkin nulls first`,
      [gymId],
    );
    return rows.map((r) => ({
      id: String(r.id),
      full_name: String(r.full_name),
      phone: str(r.phone),
      last_checkin: str(r.last_checkin),
    }));
  });

export const listPlans = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireAdmin(actor);
    const sql = await getSql();
    const rows = await sql.query(`select * from plans where gym_id = $1 order by display_order`, [gymId]);
    return rows.map((r) => ({
      id: String(r.id),
      gym_id: String(r.gym_id),
      name: String(r.name),
      duration_days: num(r.duration_days),
      price: num(r.price),
      is_active: Boolean(r.is_active),
      display_order: num(r.display_order),
    }));
  });

export const savePlan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id?: string; name: string; duration_days: number; price: number; is_active?: boolean }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireOwner(actor);
    const sql = await getSql();
    if (data.id) {
      await sql.query(
        `update plans set name=$3, duration_days=$4, price=$5, is_active=coalesce($6,is_active)
         where id = $1 and gym_id = $2`,
        [data.id, gymId, data.name, data.duration_days, data.price, data.is_active ?? null],
      );
      return { id: data.id };
    }
    const id = nid("plan");
    await sql.query(
      `insert into plans (id, gym_id, name, duration_days, price, is_active, display_order)
       values ($1,$2,$3,$4,$5,true, (select coalesce(max(display_order),0)+1 from plans where gym_id = $2))`,
      [id, gymId, data.name, data.duration_days, data.price],
    );
    return { id };
  });

function mapNamed(r: Record<string, unknown>) {
  return {
    id: String(r.id),
    name: String(r.name ?? r.member_name ?? ""),
    photo_url: str(r.photo_url),
    speciality: str(r.speciality),
    bio: str(r.bio),
    quote: str(r.quote),
    member_name: str(r.member_name),
    story: str(r.story),
    after_url: str(r.after_url),
    description: str(r.description),
    image_url: str(r.image_url),
    is_visible: Boolean(r.is_visible),
    display_order: num(r.display_order),
    icon: str(r.icon),
  };
}

export const listTrainers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireAdmin(actor);
    const sql = await getSql();
    const rows = await sql.query(`select * from trainers where gym_id = $1 order by display_order`, [gymId]);
    return rows.map((r) => mapNamed(r as Record<string, unknown>));
  });

export const saveTrainer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: {
    id?: string;
    name: string;
    speciality?: string;
    bio?: string;
    photo_url?: string;
    phone?: string;
    is_visible?: boolean;
  }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireOwner(actor);
    const sql = await getSql();
    if (data.id) {
      await sql.query(
        `update trainers set name=$3, speciality=$4, bio=$5, photo_url=coalesce($6,photo_url), phone=$7,
           is_visible=coalesce($8,is_visible)
         where id = $1 and gym_id = $2`,
        [data.id, gymId, data.name, data.speciality || null, data.bio || null, data.photo_url || null, data.phone || null, data.is_visible ?? null],
      );
      return { id: data.id };
    }
    const id = nid("tr");
    await sql.query(
      `insert into trainers (id, gym_id, name, speciality, bio, photo_url, phone) values ($1,$2,$3,$4,$5,$6,$7)`,
      [id, gymId, data.name, data.speciality || null, data.bio || null, data.photo_url || null, data.phone || null],
    );
    return { id };
  });

async function listFacility(table: "amenities" | "equipment", gymId: string) {
  const sql = await getSql();
  const rows = await sql.query(`select * from ${table} where gym_id = $1 order by display_order`, [gymId]);
  return rows.map((r) => mapNamed(r as Record<string, unknown>));
}

export const listAmenities = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    return listFacility("amenities", requireAdmin(actor));
  });

export const listEquipment = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    return listFacility("equipment", requireAdmin(actor));
  });

export const saveFacility = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: {
    kind: "amenities" | "equipment";
    id?: string;
    name: string;
    icon?: string;
    description?: string;
    image_url?: string;
    is_visible?: boolean;
    display_order?: number;
  }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireOwner(actor);
    const sql = await getSql();
    const table = data.kind === "equipment" ? "equipment" : "amenities";
    if (data.id) {
      await sql.query(
        `update ${table} set name=$3, icon=$4, description=$5, image_url=coalesce($6,image_url),
           is_visible=coalesce($7,is_visible), display_order=coalesce($8,display_order)
         where id = $1 and gym_id = $2`,
        [data.id, gymId, data.name, data.icon || null, data.description || null, data.image_url || null, data.is_visible ?? null, data.display_order ?? null],
      );
      return { id: data.id };
    }
    const id = nid(data.kind === "equipment" ? "eq" : "am");
    await sql.query(
      `insert into ${table} (id, gym_id, name, icon, description, image_url, display_order)
       values ($1,$2,$3,$4,$5,$6,(select coalesce(max(display_order),0)+1 from ${table} where gym_id = $2))`,
      [id, gymId, data.name, data.icon || null, data.description || null, data.image_url || null],
    );
    return { id };
  });

export const reorderFacilities = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { kind: "amenities" | "equipment"; ids: string[] }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireOwner(actor);
    const sql = await getSql();
    const table = data.kind === "equipment" ? "equipment" : "amenities";
    for (let i = 0; i < data.ids.length; i++) {
      await sql.query(`update ${table} set display_order = $3 where id = $1 and gym_id = $2`, [
        data.ids[i],
        gymId,
        i + 1,
      ]);
    }
    return { ok: true };
  });

export const deleteFacility = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { kind: "amenities" | "equipment"; id: string }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireOwner(actor);
    const sql = await getSql();
    const table = data.kind === "equipment" ? "equipment" : "amenities";
    await sql.query(`delete from ${table} where id = $1 and gym_id = $2`, [data.id, gymId]);
    return { ok: true };
  });

export const listTestimonials = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    const sql = await getSql();
    const rows = await sql.query(`select * from testimonials where gym_id = $1`, [requireAdmin(actor)]);
    return rows.map((r) => mapNamed(r as Record<string, unknown>));
  });

export const saveTestimonial = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id?: string; member_name: string; quote: string; rating?: number; is_visible?: boolean }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireOwner(actor);
    const sql = await getSql();
    if (data.id) {
      await sql.query(
        `update testimonials set member_name=$3, quote=$4, rating=$5, is_visible=coalesce($6,is_visible)
         where id=$1 and gym_id=$2`,
        [data.id, gymId, data.member_name, data.quote, data.rating ?? 5, data.is_visible ?? null],
      );
      return { id: data.id };
    }
    const id = nid("ts");
    await sql.query(
      `insert into testimonials (id, gym_id, member_name, quote, rating) values ($1,$2,$3,$4,$5)`,
      [id, gymId, data.member_name, data.quote, data.rating ?? 5],
    );
    return { id };
  });

export const listTransformations = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    const sql = await getSql();
    const rows = await sql.query(`select * from transformations where gym_id = $1`, [requireAdmin(actor)]);
    return rows.map((r) => mapNamed(r as Record<string, unknown>));
  });

export const saveTransformation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: {
    id?: string;
    member_name: string;
    story?: string;
    before_url?: string;
    after_url?: string;
    is_visible?: boolean;
  }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireOwner(actor);
    const sql = await getSql();
    if (data.id) {
      await sql.query(
        `update transformations set member_name=$3, story=$4,
           before_url=coalesce($5,before_url), after_url=coalesce($6,after_url),
           is_visible=coalesce($7,is_visible)
         where id=$1 and gym_id=$2`,
        [data.id, gymId, data.member_name, data.story || null, data.before_url || null, data.after_url || null, data.is_visible ?? null],
      );
      return { id: data.id };
    }
    const id = nid("tf");
    await sql.query(
      `insert into transformations (id, gym_id, member_name, story, before_url, after_url)
       values ($1,$2,$3,$4,$5,$6)`,
      [id, gymId, data.member_name, data.story || null, data.before_url || null, data.after_url || null],
    );
    return { id };
  });

export const updateGym = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: Record<string, string | number | boolean | null | undefined | Record<string, string>>) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireOwner(actor);
    const sql = await getSql();
    const fields = [
      "name",
      "city",
      "address",
      "phone",
      "email",
      "logo_url",
      "cover_image_url",
      "brand_color",
      "about_text",
      "established_year",
      "opening_hours",
      "onboarding_completed",
    ] as const;
    const sets: string[] = [];
    const params: unknown[] = [];
    let i = 1;
    for (const f of fields) {
      if (f in data) {
        params.push(f === "opening_hours" ? JSON.stringify(data[f]) : data[f]);
        sets.push(`${f} = $${i++}`);
      }
    }
    if (!sets.length) return { ok: true };
    params.push(gymId);
    await sql.query(`update gyms set ${sets.join(", ")} where id = $${i}`, params);
    return { ok: true };
  });

export const inviteStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { email: string; role: "staff" | "trainer" }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireOwner(actor);
    const sql = await getSql();
    const email = data.email.trim().toLowerCase();
    await sql.query(
      `insert into staff_invites (id, gym_id, email, role, invited_by) values ($1,$2,$3,$4,$5)`,
      [nid("inv"), gymId, email, data.role, context.userId],
    );
    const users = await sql.query<{ id: string }>(`select id from "user" where lower(email) = $1`, [email]);
    if (users[0]) {
      await sql.query(
        `insert into user_roles (id, user_id, role, gym_id) values ($1,$2,$3,$4) on conflict do nothing`,
        [nid("role"), users[0].id, data.role, gymId],
      );
      await sql.query(`update staff_invites set accepted = true where gym_id = $1 and email = $2`, [gymId, email]);
    }
    return { ok: true, attached: Boolean(users[0]) };
  });

export const listStaffInvites = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    const sql = await getSql();
    const rows = await sql.query(
      `select id, email, role, accepted, created_at from staff_invites where gym_id = $1 order by created_at desc`,
      [requireOwner(actor)],
    );
    return rows.map((r) => ({
      id: String(r.id),
      email: String(r.email),
      role: String(r.role),
      accepted: Boolean(r.accepted),
      created_at: String(r.created_at),
    }));
  });

export const seedDefaultPlans = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { plans?: { name: string; duration_days: number; price: number }[] } = {}) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireOwner(actor);
    const sql = await getSql();
    const existing = await sql.query<{ c: number }>(`select count(*)::int as c from plans where gym_id = $1`, [gymId]);
    if ((existing[0]?.c ?? 0) > 0 && !data.plans) return { ok: true };
    const list = data.plans?.length
      ? data.plans
      : DEFAULT_MEMBERSHIP_PLANS.map((p) => ({
          name: p.name,
          duration_days: p.durationDays,
          price: p.price,
        }));
    let order = 1;
    for (const p of list) {
      await sql.query(
        `insert into plans (id, gym_id, name, duration_days, price, display_order) values ($1,$2,$3,$4,$5,$6)`,
        [nid("plan"), gymId, p.name, p.duration_days, p.price, order++],
      );
    }
    return { ok: true };
  });

export async function uniqueSlug(base: string) {
  const sql = await getSql();
  const slug = slugify(base) || "gym";
  for (let i = 0; i < 20; i++) {
    const trySlug = i === 0 ? slug : `${slug}-${i + 1}`;
    const rows = await sql.query(`select 1 from gyms where slug = $1`, [trySlug]);
    if (!rows.length) return trySlug;
  }
  return `${slug}-${Date.now().toString(36)}`;
}

export const createGymForOwner = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { name: string; city?: string; phone?: string; plan?: string; owner_name?: string }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    if (actor.roles.includes("gym_owner") && actor.gymId && !actor.isSuperAdmin) {
      throw new AppError("This account already owns a gym");
    }
    const sql = await getSql();
    const planId = data.plan && data.plan !== "enterprise" ? data.plan : "starter";
    const catalog = await sql.query<{ id: string; member_cap: number; price: number | null }>(
      `select id, member_cap, price from plan_catalog where id = $1`,
      [planId],
    );
    const cap = num(catalog[0]?.member_cap, 50);
    const gymId = nid("gym");
    const slug = await uniqueSlug(data.name);
    await sql.query(
      `insert into gyms (
         id, name, slug, city, phone, plan, member_cap, subscription_status,
         trial_ends_at, current_period_end, owner_user_id, onboarding_completed
       ) values ($1,$2,$3,$4,$5,$6,$7,'trial', now() + interval '14 days', now() + interval '14 days', $8, false)`,
      [gymId, data.name.trim(), slug, data.city || null, data.phone || null, planId, cap, context.userId],
    );
    await sql.query(
      `insert into user_roles (id, user_id, role, gym_id) values ($1,$2,'gym_owner',$3)`,
      [nid("role"), context.userId, gymId],
    );
    await sql.query(
      `update profiles set gym_id = $1, full_name = coalesce($2, full_name), phone = coalesce($3, phone) where user_id = $4`,
      [gymId, data.owner_name || null, data.phone || null, context.userId],
    );
    let order = 1;
    for (const p of DEFAULT_MEMBERSHIP_PLANS) {
      await sql.query(
        `insert into plans (id, gym_id, name, duration_days, price, display_order) values ($1,$2,$3,$4,$5,$6)`,
        [nid("plan"), gymId, p.name, p.durationDays, p.price, order++],
      );
    }
    const pay = await sql.query<{ active_provider: string }>(
      `select active_provider from payment_settings where id = 'default'`,
    );
    const provider = pay[0]?.active_provider ?? "manual";
    const amount = num(catalog[0]?.price, 2500);
    const paymentId = nid("pay");
    await sql.query(
      `insert into payments (id, gym_id, amount, method, provider, status, notes)
       values ($1,$2,$3,$4,$5,'pending','Signup — first month')`,
      [paymentId, gymId, amount, provider === "manual" ? "upi" : "card", provider],
    );
    await audit(context.userId, "gym_created", `Created gym ${data.name} on ${planId}`, gymId);
    return { gymId, slug, paymentId, provider, amount, plan: planId };
  });
