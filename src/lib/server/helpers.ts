import { getSql } from "@/lib/db";
import type { Gym, Role, SessionContext } from "@/lib/types";
import { nid } from "@/lib/utils";

export class AppError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
    this.name = "AppError";
  }
}

export function num(v: unknown, fallback = 0) {
  if (v == null || v === "") return fallback;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function cell(v: unknown): string | number | boolean | null {
  if (v == null) return null;
  if (typeof v === "boolean") return v;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "bigint") return Number(v);
  if (v instanceof Date) return v.toISOString();
  return String(v);
}

export function str(v: unknown) {
  const c = cell(v);
  return c == null ? null : String(c);
}

export function asGym(row: Record<string, unknown> | undefined | null): Gym | null {
  if (!row) return null;
  let hours = row.opening_hours as Gym["opening_hours"];
  if (typeof hours === "string") {
    try {
      hours = JSON.parse(hours) as Gym["opening_hours"];
    } catch {
      hours = null;
    }
  }
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    city: (row.city as string) ?? null,
    address: (row.address as string) ?? null,
    phone: (row.phone as string) ?? null,
    email: (row.email as string) ?? null,
    logo_url: (row.logo_url as string) ?? null,
    cover_image_url: (row.cover_image_url as string) ?? null,
    brand_color: String(row.brand_color ?? "#5B8C51"),
    about_text: (row.about_text as string) ?? null,
    established_year: row.established_year == null ? null : num(row.established_year),
    opening_hours: hours ?? null,
    plan: String(row.plan ?? "starter"),
    member_cap: num(row.member_cap, 50),
    subscription_status: (row.subscription_status as Gym["subscription_status"]) ?? "trial",
    trial_ends_at: row.trial_ends_at ? String(row.trial_ends_at) : null,
    current_period_end: row.current_period_end ? String(row.current_period_end) : null,
    custom_domain: (row.custom_domain as string) ?? null,
    domain_status: (row.domain_status as Gym["domain_status"]) ?? "none",
    show_powered_by: Boolean(row.show_powered_by),
    onboarding_completed: Boolean(row.onboarding_completed),
    created_at: String(row.created_at),
    owner_user_id: (row.owner_user_id as string) ?? null,
  };
}

export function asMember(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    gym_id: String(row.gym_id),
    user_id: str(row.user_id),
    full_name: String(row.full_name ?? ""),
    phone: str(row.phone),
    email: str(row.email),
    gender: str(row.gender),
    date_of_birth: str(row.date_of_birth),
    photo_url: str(row.photo_url),
    status: String(row.status ?? "active"),
    joined_at: str(row.joined_at),
    notes: str(row.notes),
    emergency_contact: str(row.emergency_contact),
    created_at: str(row.created_at) ?? "",
    last_checkin: str(row.last_checkin),
    trainer_id: str(row.trainer_id),
  };
}

export function asSubscription(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    gym_id: String(row.gym_id),
    member_id: String(row.member_id),
    plan_id: str(row.plan_id),
    plan_name: str(row.plan_name),
    starts_on: str(row.starts_on) ?? "",
    ends_on: str(row.ends_on) ?? "",
    status: String(row.status ?? "active"),
    amount: row.amount == null ? null : num(row.amount),
  };
}

export function asProgram(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    gym_id: String(row.gym_id),
    member_id: String(row.member_id),
    trainer_id: str(row.trainer_id),
    trainer_name: str(row.trainer_name),
    workout_text: str(row.workout_text),
    diet_text: str(row.diet_text),
  };
}

export function asProgress(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    logged_on: str(row.logged_on) ?? "",
    weight_kg: row.weight_kg == null ? null : num(row.weight_kg),
    photo_url: str(row.photo_url),
    notes: str(row.notes),
  };
}

export function asPayment(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    gym_id: str(row.gym_id),
    gym_name: str(row.gym_name),
    gym_city: str(row.gym_city),
    amount: num(row.amount),
    method: String(row.method ?? ""),
    provider: String(row.provider ?? "manual"),
    status: String(row.status ?? "pending"),
    reference: str(row.reference),
    notes: str(row.notes),
    created_at: str(row.created_at) ?? "",
  };
}

export function asLead(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    gym_name: String(row.gym_name ?? ""),
    owner_name: String(row.owner_name ?? ""),
    phone: str(row.phone),
    city: str(row.city),
    member_count: row.member_count == null ? null : num(row.member_count),
    message: str(row.message),
    status: String(row.status ?? "new"),
    notes: str(row.notes),
    created_at: str(row.created_at) ?? "",
  };
}

export function asAudit(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    action: String(row.action ?? ""),
    detail: str(row.detail),
    created_at: str(row.created_at) ?? "",
  };
}

export async function loadActor(userId: string): Promise<SessionContext> {
  const sql = await getSql();

  const users = await sql.query<{
    id: string;
    email: string | null;
    name: string | null;
    image: string | null;
  }>(`select id, email, name, image from "user" where id = $1`, [userId]);
  const u = users[0];

  await sql.query(
    `insert into profiles (user_id, full_name, avatar_url, last_login_at)
     values ($1, $2, $3, now())
     on conflict (user_id) do update set last_login_at = now()`,
    [userId, u?.name ?? null, u?.image ?? null],
  );

  const sa = await sql.query<{ c: number }>(
    `select count(*)::int as c from user_roles where role = 'super_admin'`,
  );
  if ((sa[0]?.c ?? 0) === 0) {
    await sql.query(
      `insert into user_roles (id, user_id, role, gym_id) values ($1, $2, 'super_admin', null)`,
      [nid("role"), userId],
    );
    await sql.query(
      `insert into audit_log (id, actor_user_id, action, detail)
       values ($1, $2, 'bootstrap_super_admin', 'First signed-in user claimed the god panel')`,
      [nid("aud"), userId],
    );
  }

  if (u?.email) {
    const invites = await sql.query<{ id: string; gym_id: string; role: Role }>(
      `select id, gym_id, role from staff_invites
        where lower(email) = lower($1) and accepted = false`,
      [u.email],
    );
    for (const inv of invites) {
      await sql.query(
        `insert into user_roles (id, user_id, role, gym_id) values ($1, $2, $3, $4)
         on conflict do nothing`,
        [nid("role"), userId, inv.role, inv.gym_id],
      );
      await sql.query(`update staff_invites set accepted = true where id = $1`, [inv.id]);
      await sql.query(`update profiles set gym_id = $1 where user_id = $2`, [inv.gym_id, userId]);
    }
    const mems = await sql.query<{ id: string; gym_id: string }>(
      `select id, gym_id from members where lower(email) = lower($1) limit 1`,
      [u.email],
    );
    if (mems[0]) {
      await sql.query(
        `insert into user_roles (id, user_id, role, gym_id) values ($1, $2, 'member', $3)
         on conflict do nothing`,
        [nid("role"), userId, mems[0].gym_id],
      );
      await sql.query(`update members set user_id = $1 where id = $2 and user_id is null`, [
        userId,
        mems[0].id,
      ]);
    }
  }

  const roles = await sql.query<{ role: Role; gym_id: string | null }>(
    `select role, gym_id from user_roles where user_id = $1`,
    [userId],
  );
  const roleList = [...new Set(roles.map((r) => r.role))];
  const isSuperAdmin = roleList.includes("super_admin");

  const imp = await sql.query<{ gym_id: string }>(
    `select gym_id from impersonations where user_id = $1`,
    [userId],
  );

  let gymId: string | null = null;
  if (imp[0]) gymId = imp[0].gym_id;
  else {
    gymId =
      roles.find((r) => r.role === "gym_owner")?.gym_id ??
      roles.find((r) => r.role === "staff")?.gym_id ??
      roles.find((r) => r.role === "trainer")?.gym_id ??
      roles.find((r) => r.role === "member")?.gym_id ??
      null;
  }

  let gym: Gym | null = null;
  if (gymId) {
    const rows = await sql.query(`select * from gyms where id = $1`, [gymId]);
    gym = asGym(rows[0] as Record<string, unknown>);
  }

  const memberRow = await sql.query<{ id: string }>(
    `select id from members where user_id = $1 limit 1`,
    [userId],
  );
  const trainerRow = await sql.query<{ id: string }>(
    `select id from trainers where user_id = $1 limit 1`,
    [userId],
  );

  return {
    userId,
    email: u?.email ?? null,
    name: u?.name ?? null,
    image: u?.image ?? null,
    roles: roleList,
    gymId,
    gym,
    impersonating: Boolean(imp[0]),
    isSuperAdmin,
    isOwner: roleList.includes("gym_owner") || Boolean(imp[0] && isSuperAdmin),
    isStaff: roleList.includes("staff") || roleList.includes("gym_owner") || Boolean(imp[0]),
    isTrainer: roleList.includes("trainer"),
    isMember: roleList.includes("member"),
    memberId: memberRow[0]?.id ?? null,
    trainerId: trainerRow[0]?.id ?? null,
  };
}

export function requireGymId(actor: SessionContext) {
  if (!actor.gymId) throw new AppError("No gym on this account. Finish signup first.", 403);
  return actor.gymId;
}

export function requireAdmin(actor: SessionContext) {
  if (actor.isSuperAdmin || actor.isOwner || actor.roles.includes("staff")) {
    return requireGymId(actor);
  }
  throw new AppError("Staff access required", 403);
}

export function requireOwner(actor: SessionContext) {
  if (actor.isSuperAdmin || actor.isOwner) return requireGymId(actor);
  throw new AppError("Owner access required", 403);
}

export function requireGod(actor: SessionContext) {
  if (!actor.isSuperAdmin) throw new AppError("Super admin only", 403);
}

export function requireTrainer(actor: SessionContext) {
  if (actor.isSuperAdmin || actor.isOwner || actor.isTrainer) return requireGymId(actor);
  throw new AppError("Trainer access required", 403);
}

export function capMessage(cap: number) {
  return `This gym has reached its ${cap} member limit. Upgrade the plan to add more people.`;
}

export async function countActiveMembers(gymId: string) {
  const sql = await getSql();
  const rows = await sql.query<{ c: number }>(
    `select count(*)::int as c from members where gym_id = $1 and status = 'active'`,
    [gymId],
  );
  return rows[0]?.c ?? 0;
}

export async function audit(actorId: string, action: string, detail: string, gymId?: string | null) {
  const sql = await getSql();
  await sql.query(
    `insert into audit_log (id, actor_user_id, gym_id, action, detail) values ($1,$2,$3,$4,$5)`,
    [nid("aud"), actorId, gymId ?? null, action, detail],
  );
}

export function gymSlugFromHost(host: string) {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  const m = h.match(/^([a-z0-9-]+)\.getdownfitness\.in$/);
  if (m && m[1] && !["www", "app", "api", "admin", "god"].includes(m[1])) return m[1];
  return null;
}
