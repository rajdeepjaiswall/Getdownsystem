import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { nid } from "@/lib/utils";
import { asAudit, asGym, asLead, asPayment, audit, loadActor, num, requireGod } from "./helpers";

export const getGodOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    requireGod(actor);
    const sql = await getSql();
    const [gyms, active, suspended, mrr, nearCap, signups, pendingPay] = await Promise.all([
      sql.query<{ c: number }>(`select count(*)::int as c from gyms`),
      sql.query<{ c: number }>(`select count(*)::int as c from gyms where subscription_status = 'active'`),
      sql.query<{ c: number }>(`select count(*)::int as c from gyms where subscription_status = 'suspended'`),
      sql.query<{ mrr: number }>(
        `select coalesce(sum(pc.price),0)::int as mrr
         from gyms g join plan_catalog pc on pc.id = g.plan
         where g.subscription_status in ('active','trial') and pc.price is not null`,
      ),
      sql.query<{ c: number }>(
        `select count(*)::int as c from gyms g
         where (
           select count(*) from members m where m.gym_id = g.id and m.status = 'active'
         ) >= g.member_cap * 0.8`,
      ),
      sql.query<{ c: number }>(
        `select count(*)::int as c from gyms where created_at >= date_trunc('month', now())`,
      ),
      sql.query<{ c: number }>(`select count(*)::int as c from payments where status = 'pending'`),
    ]);
    return {
      gyms: gyms[0]?.c ?? 0,
      active: active[0]?.c ?? 0,
      suspended: suspended[0]?.c ?? 0,
      mrr: mrr[0]?.mrr ?? 0,
      nearCap: nearCap[0]?.c ?? 0,
      signupsThisMonth: signups[0]?.c ?? 0,
      pendingPayments: pendingPay[0]?.c ?? 0,
    };
  });

export const listGodGyms = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { q?: string; plan?: string; status?: string } = {}) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    requireGod(actor);
    const sql = await getSql();
    const rows = await sql.query(
      `select g.*,
         (select count(*)::int from members m where m.gym_id = g.id and m.status = 'active') as members_used,
         (select p.last_login_at from profiles p where p.user_id = g.owner_user_id) as last_login,
         (select u.email from "user" u where u.id = g.owner_user_id) as owner_email
       from gyms g
       where ($1::text is null or g.name ilike '%' || $1 || '%' or g.city ilike '%' || $1 || '%' or g.slug ilike '%' || $1 || '%')
         and ($2::text is null or g.plan = $2)
         and ($3::text is null or g.subscription_status = $3)
       order by g.created_at desc`,
      [data.q?.trim() || null, data.plan || null, data.status || null],
    );
    return rows.map((r) => ({
      gym: asGym(r as Record<string, unknown>),
      members_used: num(r.members_used),
      last_login: r.last_login ? String(r.last_login) : null,
      owner_email: (r.owner_email as string) ?? null,
    }));
  });

export const getGodGym = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { id: string }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    requireGod(actor);
    const sql = await getSql();
    const rows = await sql.query(`select * from gyms where id = $1`, [data.id]);
    const gym = asGym(rows[0] as Record<string, unknown>);
    if (!gym) throw new Error("Gym not found");
    const used = await sql.query<{ c: number }>(
      `select count(*)::int as c from members where gym_id = $1 and status = 'active'`,
      [data.id],
    );
    const payments = await sql.query(
      `select * from payments where gym_id = $1 order by created_at desc limit 20`,
      [data.id],
    );
    const logs = await sql.query(
      `select * from audit_log where gym_id = $1 order by created_at desc limit 20`,
      [data.id],
    );
    return {
      gym,
      used: used[0]?.c ?? 0,
      payments: payments.map((r) => asPayment(r as Record<string, unknown>)),
      logs: logs.map((r) => asAudit(r as Record<string, unknown>)),
    };
  });

export const updateGodGym = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: {
    id: string;
    plan?: string;
    member_cap?: number;
    subscription_status?: string;
    current_period_end?: string;
    show_powered_by?: boolean;
    custom_domain?: string | null;
    domain_status?: string;
    brand_color?: string;
    name?: string;
  }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    requireGod(actor);
    const sql = await getSql();
    if (data.plan) {
      const cat = await sql.query<{ member_cap: number }>(
        `select member_cap from plan_catalog where id = $1`,
        [data.plan],
      );
      await sql.query(`update gyms set plan = $2, member_cap = coalesce($3, member_cap) where id = $1`, [
        data.id,
        data.plan,
        data.member_cap ?? cat[0]?.member_cap ?? null,
      ]);
    }
    if (data.member_cap != null) {
      await sql.query(`update gyms set member_cap = $2 where id = $1`, [data.id, data.member_cap]);
    }
    if (data.subscription_status) {
      await sql.query(`update gyms set subscription_status = $2 where id = $1`, [
        data.id,
        data.subscription_status,
      ]);
    }
    if (data.current_period_end) {
      await sql.query(`update gyms set current_period_end = $2::timestamptz where id = $1`, [
        data.id,
        data.current_period_end,
      ]);
    }
    if (data.show_powered_by != null) {
      await sql.query(`update gyms set show_powered_by = $2 where id = $1`, [data.id, data.show_powered_by]);
    }
    if ("custom_domain" in data) {
      const status = data.custom_domain ? (data.domain_status ?? "pending") : "none";
      await sql.query(`update gyms set custom_domain = $2, domain_status = $3 where id = $1`, [
        data.id,
        data.custom_domain || null,
        status,
      ]);
    }
    if (data.brand_color) {
      await sql.query(`update gyms set brand_color = $2 where id = $1`, [data.id, data.brand_color]);
    }
    if (data.name) {
      await sql.query(`update gyms set name = $2 where id = $1`, [data.id, data.name]);
    }
    await audit(context.userId, "god_update_gym", JSON.stringify(data), data.id);
    return { ok: true };
  });

export const listPayments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { status?: string } = {}) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    requireGod(actor);
    const sql = await getSql();
    const rows = await sql.query(
      `select p.*, g.name as gym_name, g.city as gym_city
       from payments p left join gyms g on g.id = p.gym_id
       where ($1::text is null or p.status = $1)
       order by p.created_at desc`,
      [data.status || null],
    );
    return rows.map((r) => asPayment(r as Record<string, unknown>));
  });

export const confirmPayment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    requireGod(actor);
    const sql = await getSql();
    const rows = await sql.query<{ gym_id: string | null }>(
      `update payments set status = 'received' where id = $1 returning gym_id`,
      [data.id],
    );
    if (rows[0]?.gym_id) {
      await sql.query(
        `update gyms set subscription_status = 'active',
           current_period_end = coalesce(current_period_end, now()) + interval '30 days'
         where id = $1`,
        [rows[0].gym_id],
      );
    }
    await audit(context.userId, "payment_received", `Payment ${data.id}`, rows[0]?.gym_id);
    return { ok: true };
  });

export const listLeads = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    requireGod(actor);
    const sql = await getSql();
    const rows = await sql.query(`select * from leads order by created_at desc`);
    return rows.map((r) => asLead(r as Record<string, unknown>));
  });

export const updateLead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; status?: string; notes?: string }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    requireGod(actor);
    const sql = await getSql();
    await sql.query(
      `update leads set status = coalesce($2, status), notes = coalesce($3, notes) where id = $1`,
      [data.id, data.status ?? null, data.notes ?? null],
    );
    return { ok: true };
  });

export const getPaymentSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    requireGod(actor);
    const sql = await getSql();
    const rows = await sql.query(`select * from payment_settings where id = 'default'`);
    const r = rows[0] ?? {};
    return {
      active_provider: String(r.active_provider ?? "manual"),
      manual_upi_id: (r.manual_upi_id as string) ?? "",
      manual_account_name: (r.manual_account_name as string) ?? "",
      manual_instructions: (r.manual_instructions as string) ?? "",
      razorpay_key_id: (r.razorpay_key_id as string) ?? "",
      razorpay_key_secret: r.razorpay_key_secret ? "••••••••" : "",
      stub_label: (r.stub_label as string) ?? "Coming soon",
    };
  });

export const savePaymentSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: {
    active_provider: string;
    manual_upi_id?: string;
    manual_account_name?: string;
    manual_instructions?: string;
    razorpay_key_id?: string;
    razorpay_key_secret?: string;
  }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    requireGod(actor);
    const sql = await getSql();
    const secret =
      data.razorpay_key_secret && !data.razorpay_key_secret.includes("•")
        ? data.razorpay_key_secret
        : null;
    await sql.query(
      `update payment_settings set
         active_provider = $2,
         manual_upi_id = $3,
         manual_account_name = $4,
         manual_instructions = $5,
         razorpay_key_id = $6,
         razorpay_key_secret = coalesce($7, razorpay_key_secret)
       where id = 'default'`,
      [
        "default",
        data.active_provider,
        data.manual_upi_id || null,
        data.manual_account_name || null,
        data.manual_instructions || null,
        data.razorpay_key_id || null,
        secret,
      ],
    );
    await audit(context.userId, "payment_settings", `Provider → ${data.active_provider}`);
    return { ok: true };
  });

export const listPlanCatalog = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    requireGod(actor);
    const sql = await getSql();
    const rows = await sql.query(`select * from plan_catalog order by display_order`);
    return rows.map((r) => ({
      id: String(r.id),
      name: String(r.name),
      price: r.price == null ? null : num(r.price),
      member_cap: num(r.member_cap),
      is_enterprise: Boolean(r.is_enterprise),
    }));
  });

export const savePlanCatalog = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; price: number | null; member_cap: number }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    requireGod(actor);
    const sql = await getSql();
    await sql.query(`update plan_catalog set price = $2, member_cap = $3 where id = $1`, [
      data.id,
      data.price,
      data.member_cap,
    ]);
    await audit(context.userId, "plan_catalog", `Updated ${data.id}`);
    return { ok: true };
  });

export const getPublicCheckout = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql.query(
    `select active_provider, manual_upi_id, manual_account_name, manual_instructions, razorpay_key_id
     from payment_settings where id = 'default'`,
  );
  const r = rows[0] ?? {};
  return {
    provider: String(r.active_provider ?? "manual"),
    upi: (r.manual_upi_id as string) ?? "getdownfitness@upi",
    account: (r.manual_account_name as string) ?? "Get Down Foundation",
    instructions:
      (r.manual_instructions as string) ??
      "Pay on UPI and tap I have paid. We activate the gym the same day.",
    razorpayKey: r.active_provider === "razorpay" ? (r.razorpay_key_id as string) : null,
  };
});

export const markManualPaid = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { paymentId: string; reference?: string }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const sql = await getSql();
    const rows = await sql.query<{ gym_id: string | null }>(
      `select gym_id from payments where id = $1`,
      [data.paymentId],
    );
    if (!rows[0]) throw new Error("Payment not found");
    if (rows[0].gym_id !== actor.gymId && !actor.isSuperAdmin) {
      throw new Error("Forbidden");
    }
    await sql.query(
      `update payments set reference = coalesce($2, reference), notes = coalesce(notes,'') || ' Owner marked paid.'
       where id = $1 and status = 'pending'`,
      [data.paymentId, data.reference || null],
    );
    return { ok: true };
  });

export const recordRazorpayOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { paymentId: string; razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => d)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    const sql = await getSql();
    const settings = await sql.query<{ razorpay_key_secret: string | null }>(
      `select razorpay_key_secret from payment_settings where id = 'default'`,
    );
    const secret = settings[0]?.razorpay_key_secret;
    if (!secret) throw new Error("Razorpay is not configured");
    const { createHmac } = await import("node:crypto");
    const body = `${data.razorpay_order_id}|${data.razorpay_payment_id}`;
    const expected = createHmac("sha256", secret).update(body).digest("hex");
    if (expected !== data.razorpay_signature) throw new Error("Invalid payment signature");
    const rows = await sql.query<{ gym_id: string | null }>(
      `update payments set status = 'received', reference = $2, provider = 'razorpay'
       where id = $1 returning gym_id`,
      [data.paymentId, data.razorpay_payment_id],
    );
    if (rows[0]?.gym_id) {
      await sql.query(
        `update gyms set subscription_status = 'active', current_period_end = now() + interval '30 days' where id = $1`,
        [rows[0].gym_id],
      );
    }
    await audit(context.userId, "razorpay_verified", data.razorpay_payment_id, rows[0]?.gym_id);
    return { ok: true };
  });
