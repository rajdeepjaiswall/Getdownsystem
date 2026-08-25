import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { loadActor, requireGod, audit } from "./helpers";

export const getMyContext = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => loadActor(context.userId));

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { full_name?: string; phone?: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql.query(
      `update profiles set full_name = coalesce($2, full_name), phone = coalesce($3, phone)
       where user_id = $1`,
      [context.userId, data.full_name ?? null, data.phone ?? null],
    );
    return loadActor(context.userId);
  });

export const startImpersonation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { gymId: string }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    requireGod(actor);
    const sql = await getSql();
    await sql.query(
      `insert into impersonations (user_id, gym_id, started_at) values ($1,$2,now())
       on conflict (user_id) do update set gym_id = $2, started_at = now()`,
      [context.userId, data.gymId],
    );
    await audit(context.userId, "impersonate", `Started impersonation of gym ${data.gymId}`, data.gymId);
    return loadActor(context.userId);
  });

export const stopImpersonation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql.query(`delete from impersonations where user_id = $1`, [context.userId]);
    await audit(context.userId, "impersonate_stop", "Stopped impersonation");
    return loadActor(context.userId);
  });
