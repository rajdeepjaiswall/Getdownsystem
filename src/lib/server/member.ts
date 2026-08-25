import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { nid } from "@/lib/utils";
import {
  AppError,
  asGym,
  asMember,
  asProgram,
  asProgress,
  asSubscription,
  loadActor,
  num,
  requireGymId,
  requireTrainer,
} from "./helpers";

export const getMemberHome = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireGymId(actor);
    const sql = await getSql();
    let memberId = actor.memberId;
    if (!memberId && (actor.isOwner || actor.isSuperAdmin)) {
      const first = await sql.query<{ id: string }>(
        `select id from members where gym_id = $1 and status = 'active' order by created_at limit 1`,
        [gymId],
      );
      memberId = first[0]?.id ?? null;
    }
    if (!memberId) throw new AppError("No member profile on this account", 403);

    const member = await sql.query(`select * from members where id = $1 and gym_id = $2`, [
      memberId,
      gymId,
    ]);
    const sub = await sql.query(
      `select s.*, p.name as plan_name from member_subscriptions s
       left join plans p on p.id = s.plan_id
       where s.member_id = $1 order by s.ends_on desc limit 1`,
      [memberId],
    );
    const checkins = await sql.query<{ c: number; last: string | null }>(
      `select count(*)::int as c, max(checked_in_at) as last
       from checkins where member_id = $1`,
      [memberId],
    );
    const streakRows = await sql.query<{ d: string }>(
      `select distinct checked_in_at::date as d from checkins
        where member_id = $1 and checked_in_at > now() - interval '40 days'
        order by 1 desc`,
      [memberId],
    );
    let streak = 0;
    const days = streakRows.map((r) => String(r.d).slice(0, 10));
    const today = new Date();
    for (let i = 0; i < 40; i++) {
      const dt = new Date(today);
      dt.setDate(dt.getDate() - i);
      const key = dt.toISOString().slice(0, 10);
      if (days.includes(key)) streak += 1;
      else if (i > 0) break;
    }
    const gyms = await sql.query(`select * from gyms where id = $1`, [gymId]);
    return {
      preview: !actor.isMember,
      gym: asGym(gyms[0] as Record<string, unknown>),
      member: member[0] ? asMember(member[0] as Record<string, unknown>) : null,
      subscription: sub[0] ? asSubscription(sub[0] as Record<string, unknown>) : null,
      checkinCount: checkins[0]?.c ?? 0,
      lastCheckin: checkins[0]?.last ?? null,
      streak,
    };
  });

export const memberCheckin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireGymId(actor);
    const sql = await getSql();
    let memberId = actor.memberId;
    if (!memberId && (actor.isOwner || actor.isSuperAdmin)) {
      const first = await sql.query<{ id: string }>(
        `select id from members where gym_id = $1 and status = 'active' order by created_at limit 1`,
        [gymId],
      );
      memberId = first[0]?.id ?? null;
    }
    if (!memberId) throw new AppError("No member profile", 403);
    const today = await sql.query<{ c: number }>(
      `select count(*)::int as c from checkins
        where member_id = $1 and checked_in_at::date = current_date`,
      [memberId],
    );
    if ((today[0]?.c ?? 0) > 0) return { ok: true, already: true };
    await sql.query(
      `insert into checkins (id, gym_id, member_id, source) values ($1,$2,$3,'app')`,
      [nid("chk"), gymId, memberId],
    );
    return { ok: true, already: false };
  });

export const getMemberProgram = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireGymId(actor);
    const sql = await getSql();
    let memberId = actor.memberId;
    if (!memberId && (actor.isOwner || actor.isSuperAdmin)) {
      const first = await sql.query<{ id: string }>(
        `select id from members where gym_id = $1 and status = 'active' order by created_at limit 1`,
        [gymId],
      );
      memberId = first[0]?.id ?? null;
    }
    const rows = await sql.query(
      `select mp.*, t.name as trainer_name
       from member_programs mp
       left join trainers t on t.id = mp.trainer_id
       where mp.member_id = $1 and mp.gym_id = $2`,
      [memberId, gymId],
    );
    return rows[0] ? asProgram(rows[0] as Record<string, unknown>) : null;
  });

export const listProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireGymId(actor);
    const sql = await getSql();
    let memberId = actor.memberId;
    if (!memberId && (actor.isOwner || actor.isSuperAdmin)) {
      const first = await sql.query<{ id: string }>(
        `select id from members where gym_id = $1 and status = 'active' order by created_at limit 1`,
        [gymId],
      );
      memberId = first[0]?.id ?? null;
    }
    const rows = await sql.query(
      `select * from progress_logs where member_id = $1 and gym_id = $2 order by logged_on desc`,
      [memberId, gymId],
    );
    return rows.map((r) => asProgress(r as Record<string, unknown>));
  });

export const addProgress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { weight_kg?: number; photo_url?: string; notes?: string }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireGymId(actor);
    const memberId = actor.memberId;
    if (!memberId) throw new AppError("No member profile", 403);
    const sql = await getSql();
    await sql.query(
      `insert into progress_logs (id, gym_id, member_id, weight_kg, photo_url, notes)
       values ($1,$2,$3,$4,$5,$6)`,
      [nid("pl"), gymId, memberId, data.weight_kg ?? null, data.photo_url || null, data.notes || null],
    );
    return { ok: true };
  });

export const listTrainerClients = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireTrainer(actor);
    const sql = await getSql();
    if (actor.trainerId) {
      const assigned = await sql.query(
        `select m.*, tc.trainer_id,
           (select max(c.checked_in_at) from checkins c where c.member_id = m.id) as last_checkin
         from trainer_clients tc
         join members m on m.id = tc.member_id
         where tc.trainer_id = $1`,
        [actor.trainerId],
      );
      return assigned.map((r) => asMember(r as Record<string, unknown>));
    }
    const all = await sql.query(
      `select m.*,
         (select max(c.checked_in_at) from checkins c where c.member_id = m.id) as last_checkin
       from members m where m.gym_id = $1 and m.status = 'active' order by m.full_name`,
      [gymId],
    );
    return all.map((r) => asMember(r as Record<string, unknown>));
  });

export const saveMemberProgram = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { member_id: string; workout_text?: string; diet_text?: string }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireTrainer(actor);
    const sql = await getSql();
    const existing = await sql.query<{ id: string }>(
      `select id from member_programs where member_id = $1 and gym_id = $2`,
      [data.member_id, gymId],
    );
    if (existing[0]) {
      await sql.query(
        `update member_programs set workout_text = $3, diet_text = $4, trainer_id = $5, updated_at = now()
         where id = $1`,
        [existing[0].id, gymId, data.workout_text || null, data.diet_text || null, actor.trainerId],
      );
    } else {
      await sql.query(
        `insert into member_programs (id, gym_id, member_id, trainer_id, workout_text, diet_text)
         values ($1,$2,$3,$4,$5,$6)`,
        [nid("prg"), gymId, data.member_id, actor.trainerId, data.workout_text || null, data.diet_text || null],
      );
    }
    return { ok: true };
  });

export const trainerCheckin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { member_id: string }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireTrainer(actor);
    const sql = await getSql();
    await sql.query(
      `insert into checkins (id, gym_id, member_id, source) values ($1,$2,$3,'trainer')`,
      [nid("chk"), gymId, data.member_id],
    );
    return { ok: true };
  });

export const getMemberProgramFor = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { member_id: string }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const gymId = requireTrainer(actor);
    const sql = await getSql();
    const rows = await sql.query(
      `select * from member_programs where member_id = $1 and gym_id = $2`,
      [data.member_id, gymId],
    );
    const member = await sql.query(`select * from members where id = $1 and gym_id = $2`, [
      data.member_id,
      gymId,
    ]);
    return {
      program: rows[0] ? asProgram(rows[0] as Record<string, unknown>) : null,
      member: member[0] ? asMember(member[0] as Record<string, unknown>) : null,
    };
  });

export function daysRemaining(endsOn: string | null | undefined) {
  if (!endsOn) return null;
  const end = new Date(endsOn);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((end.getTime() - today.getTime()) / 86_400_000);
}

export { num };
