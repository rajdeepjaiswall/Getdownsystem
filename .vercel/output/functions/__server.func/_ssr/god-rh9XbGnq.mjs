import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-C8-e_nDy.mjs";
import { g as num, h as loadActor, i as asLead, n as asAudit, o as asPayment, p as createServerRpc, r as asGym, u as audit, v as requireGod } from "./helpers-DQ6YjLSg.mjs";
import { t as authMiddleware } from "./middleware-DaOqJC0Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/god-rh9XbGnq.js
var getGodOverview_createServerFn_handler = createServerRpc({
	id: "4b6213d66146c4830453c0ef57356e9deb2845d5a6acd0d4bfaa57ba27dcccac",
	name: "getGodOverview",
	filename: "src/lib/server/god.ts"
}, (opts) => getGodOverview.__executeServer(opts));
var getGodOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getGodOverview_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	requireGod(actor);
	const sql = await getSql();
	const [gyms, active, suspended, mrr, nearCap, signups, pendingPay] = await Promise.all([
		sql.query(`select count(*)::int as c from gyms`),
		sql.query(`select count(*)::int as c from gyms where subscription_status = 'active'`),
		sql.query(`select count(*)::int as c from gyms where subscription_status = 'suspended'`),
		sql.query(`select coalesce(sum(pc.price),0)::int as mrr
         from gyms g join plan_catalog pc on pc.id = g.plan
         where g.subscription_status in ('active','trial') and pc.price is not null`),
		sql.query(`select count(*)::int as c from gyms g
         where (
           select count(*) from members m where m.gym_id = g.id and m.status = 'active'
         ) >= g.member_cap * 0.8`),
		sql.query(`select count(*)::int as c from gyms where created_at >= date_trunc('month', now())`),
		sql.query(`select count(*)::int as c from payments where status = 'pending'`)
	]);
	return {
		gyms: gyms[0]?.c ?? 0,
		active: active[0]?.c ?? 0,
		suspended: suspended[0]?.c ?? 0,
		mrr: mrr[0]?.mrr ?? 0,
		nearCap: nearCap[0]?.c ?? 0,
		signupsThisMonth: signups[0]?.c ?? 0,
		pendingPayments: pendingPay[0]?.c ?? 0
	};
});
var listGodGyms_createServerFn_handler = createServerRpc({
	id: "36ea4b41fe79ed6f3f9e90dfe2caaf76cdf6c3d2e0564c3fa0f5446aff8dbf69",
	name: "listGodGyms",
	filename: "src/lib/server/god.ts"
}, (opts) => listGodGyms.__executeServer(opts));
var listGodGyms = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d = {}) => d).handler(listGodGyms_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	requireGod(actor);
	return (await (await getSql()).query(`select g.*,
         (select count(*)::int from members m where m.gym_id = g.id and m.status = 'active') as members_used,
         (select p.last_login_at from profiles p where p.user_id = g.owner_user_id) as last_login,
         (select u.email from "user" u where u.id = g.owner_user_id) as owner_email
       from gyms g
       where ($1::text is null or g.name ilike '%' || $1 || '%' or g.city ilike '%' || $1 || '%' or g.slug ilike '%' || $1 || '%')
         and ($2::text is null or g.plan = $2)
         and ($3::text is null or g.subscription_status = $3)
       order by g.created_at desc`, [
		data.q?.trim() || null,
		data.plan || null,
		data.status || null
	])).map((r) => ({
		gym: asGym(r),
		members_used: num(r.members_used),
		last_login: r.last_login ? String(r.last_login) : null,
		owner_email: r.owner_email ?? null
	}));
});
var getGodGym_createServerFn_handler = createServerRpc({
	id: "0eb59207f3adc54d053c1d72853aaa2ff830da7f01168c3636358d2308d3a956",
	name: "getGodGym",
	filename: "src/lib/server/god.ts"
}, (opts) => getGodGym.__executeServer(opts));
var getGodGym = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(getGodGym_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	requireGod(actor);
	const sql = await getSql();
	const rows = await sql.query(`select * from gyms where id = $1`, [data.id]);
	const gym = asGym(rows[0]);
	if (!gym) throw new Error("Gym not found");
	const used = await sql.query(`select count(*)::int as c from members where gym_id = $1 and status = 'active'`, [data.id]);
	const payments = await sql.query(`select * from payments where gym_id = $1 order by created_at desc limit 20`, [data.id]);
	const logs = await sql.query(`select * from audit_log where gym_id = $1 order by created_at desc limit 20`, [data.id]);
	return {
		gym,
		used: used[0]?.c ?? 0,
		payments: payments.map((r) => asPayment(r)),
		logs: logs.map((r) => asAudit(r))
	};
});
var updateGodGym_createServerFn_handler = createServerRpc({
	id: "8d82cfc3217c8cfc55cdb2ae014704552218e7ce7e8e040580b0c112c1b8c684",
	name: "updateGodGym",
	filename: "src/lib/server/god.ts"
}, (opts) => updateGodGym.__executeServer(opts));
var updateGodGym = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(updateGodGym_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	requireGod(actor);
	const sql = await getSql();
	if (data.plan) {
		const cat = await sql.query(`select member_cap from plan_catalog where id = $1`, [data.plan]);
		await sql.query(`update gyms set plan = $2, member_cap = coalesce($3, member_cap) where id = $1`, [
			data.id,
			data.plan,
			data.member_cap ?? cat[0]?.member_cap ?? null
		]);
	}
	if (data.member_cap != null) await sql.query(`update gyms set member_cap = $2 where id = $1`, [data.id, data.member_cap]);
	if (data.subscription_status) await sql.query(`update gyms set subscription_status = $2 where id = $1`, [data.id, data.subscription_status]);
	if (data.current_period_end) await sql.query(`update gyms set current_period_end = $2::timestamptz where id = $1`, [data.id, data.current_period_end]);
	if (data.show_powered_by != null) await sql.query(`update gyms set show_powered_by = $2 where id = $1`, [data.id, data.show_powered_by]);
	if ("custom_domain" in data) {
		const status = data.custom_domain ? data.domain_status ?? "pending" : "none";
		await sql.query(`update gyms set custom_domain = $2, domain_status = $3 where id = $1`, [
			data.id,
			data.custom_domain || null,
			status
		]);
	}
	if (data.brand_color) await sql.query(`update gyms set brand_color = $2 where id = $1`, [data.id, data.brand_color]);
	if (data.name) await sql.query(`update gyms set name = $2 where id = $1`, [data.id, data.name]);
	await audit(context.userId, "god_update_gym", JSON.stringify(data), data.id);
	return { ok: true };
});
var listPayments_createServerFn_handler = createServerRpc({
	id: "7a38ba6f7bae5f39da81b5912240b51ea3dcc3109206d2cb2a6135d4580a0278",
	name: "listPayments",
	filename: "src/lib/server/god.ts"
}, (opts) => listPayments.__executeServer(opts));
var listPayments = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d = {}) => d).handler(listPayments_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	requireGod(actor);
	return (await (await getSql()).query(`select p.*, g.name as gym_name, g.city as gym_city
       from payments p left join gyms g on g.id = p.gym_id
       where ($1::text is null or p.status = $1)
       order by p.created_at desc`, [data.status || null])).map((r) => asPayment(r));
});
var confirmPayment_createServerFn_handler = createServerRpc({
	id: "5d7c8a292bc6360c44c1d473e912699fd9421ba3abb28c17c32c9dbaf17926f2",
	name: "confirmPayment",
	filename: "src/lib/server/god.ts"
}, (opts) => confirmPayment.__executeServer(opts));
var confirmPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(confirmPayment_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	requireGod(actor);
	const sql = await getSql();
	const rows = await sql.query(`update payments set status = 'received' where id = $1 returning gym_id`, [data.id]);
	if (rows[0]?.gym_id) await sql.query(`update gyms set subscription_status = 'active',
           current_period_end = coalesce(current_period_end, now()) + interval '30 days'
         where id = $1`, [rows[0].gym_id]);
	await audit(context.userId, "payment_received", `Payment ${data.id}`, rows[0]?.gym_id);
	return { ok: true };
});
var listLeads_createServerFn_handler = createServerRpc({
	id: "9967e55a9550de7a4682719830e117bf72e06b16986f04fd5d0965415668238f",
	name: "listLeads",
	filename: "src/lib/server/god.ts"
}, (opts) => listLeads.__executeServer(opts));
var listLeads = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listLeads_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	requireGod(actor);
	return (await (await getSql()).query(`select * from leads order by created_at desc`)).map((r) => asLead(r));
});
var updateLead_createServerFn_handler = createServerRpc({
	id: "52d7ead357a7c4f32cbbc7b288c1a11e23b779eb5909f76b5f42bc6ae50a4042",
	name: "updateLead",
	filename: "src/lib/server/god.ts"
}, (opts) => updateLead.__executeServer(opts));
var updateLead = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(updateLead_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	requireGod(actor);
	await (await getSql()).query(`update leads set status = coalesce($2, status), notes = coalesce($3, notes) where id = $1`, [
		data.id,
		data.status ?? null,
		data.notes ?? null
	]);
	return { ok: true };
});
var getPaymentSettings_createServerFn_handler = createServerRpc({
	id: "db0900396c923e1617ad39828cc0790d623bdce2583b90cce21a54389813af9c",
	name: "getPaymentSettings",
	filename: "src/lib/server/god.ts"
}, (opts) => getPaymentSettings.__executeServer(opts));
var getPaymentSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getPaymentSettings_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	requireGod(actor);
	const r = (await (await getSql()).query(`select * from payment_settings where id = 'default'`))[0] ?? {};
	return {
		active_provider: String(r.active_provider ?? "manual"),
		manual_upi_id: r.manual_upi_id ?? "",
		manual_account_name: r.manual_account_name ?? "",
		manual_instructions: r.manual_instructions ?? "",
		razorpay_key_id: r.razorpay_key_id ?? "",
		razorpay_key_secret: r.razorpay_key_secret ? "••••••••" : "",
		stub_label: r.stub_label ?? "Coming soon"
	};
});
var savePaymentSettings_createServerFn_handler = createServerRpc({
	id: "fee314b4bc51382aab12a4e8ded2a1a2cbc3399762c641a77b9d13ed39a31dd0",
	name: "savePaymentSettings",
	filename: "src/lib/server/god.ts"
}, (opts) => savePaymentSettings.__executeServer(opts));
var savePaymentSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(savePaymentSettings_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	requireGod(actor);
	const sql = await getSql();
	const secret = data.razorpay_key_secret && !data.razorpay_key_secret.includes("•") ? data.razorpay_key_secret : null;
	await sql.query(`update payment_settings set
         active_provider = $2,
         manual_upi_id = $3,
         manual_account_name = $4,
         manual_instructions = $5,
         razorpay_key_id = $6,
         razorpay_key_secret = coalesce($7, razorpay_key_secret)
       where id = 'default'`, [
		"default",
		data.active_provider,
		data.manual_upi_id || null,
		data.manual_account_name || null,
		data.manual_instructions || null,
		data.razorpay_key_id || null,
		secret
	]);
	await audit(context.userId, "payment_settings", `Provider → ${data.active_provider}`);
	return { ok: true };
});
var listPlanCatalog_createServerFn_handler = createServerRpc({
	id: "eaca32a2a80744da8aa6a855150612a345180e4f30d535c9f19a022809f37541",
	name: "listPlanCatalog",
	filename: "src/lib/server/god.ts"
}, (opts) => listPlanCatalog.__executeServer(opts));
var listPlanCatalog = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listPlanCatalog_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	requireGod(actor);
	return (await (await getSql()).query(`select * from plan_catalog order by display_order`)).map((r) => ({
		id: String(r.id),
		name: String(r.name),
		price: r.price == null ? null : num(r.price),
		member_cap: num(r.member_cap),
		is_enterprise: Boolean(r.is_enterprise)
	}));
});
var savePlanCatalog_createServerFn_handler = createServerRpc({
	id: "94ab98dfdb691368b6044e211b79e0ad0357f86b44498c4526ad2bec776c99ef",
	name: "savePlanCatalog",
	filename: "src/lib/server/god.ts"
}, (opts) => savePlanCatalog.__executeServer(opts));
var savePlanCatalog = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(savePlanCatalog_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	requireGod(actor);
	await (await getSql()).query(`update plan_catalog set price = $2, member_cap = $3 where id = $1`, [
		data.id,
		data.price,
		data.member_cap
	]);
	await audit(context.userId, "plan_catalog", `Updated ${data.id}`);
	return { ok: true };
});
var getPublicCheckout_createServerFn_handler = createServerRpc({
	id: "adb13cf41037ea4693764b2309011e7edd7125e8be9c9eda9cc8f29c1347923d",
	name: "getPublicCheckout",
	filename: "src/lib/server/god.ts"
}, (opts) => getPublicCheckout.__executeServer(opts));
var getPublicCheckout = createServerFn({ method: "GET" }).handler(getPublicCheckout_createServerFn_handler, async () => {
	const r = (await (await getSql()).query(`select active_provider, manual_upi_id, manual_account_name, manual_instructions, razorpay_key_id
     from payment_settings where id = 'default'`))[0] ?? {};
	return {
		provider: String(r.active_provider ?? "manual"),
		upi: r.manual_upi_id ?? "getdownfitness@upi",
		account: r.manual_account_name ?? "Get Down Foundation",
		instructions: r.manual_instructions ?? "Pay on UPI and tap I have paid. We activate the gym the same day.",
		razorpayKey: r.active_provider === "razorpay" ? r.razorpay_key_id : null
	};
});
var markManualPaid_createServerFn_handler = createServerRpc({
	id: "e7d3666a8a4a9a11bf0d478ab88f64922f550a8f776d4fb4956b92f83a3819aa",
	name: "markManualPaid",
	filename: "src/lib/server/god.ts"
}, (opts) => markManualPaid.__executeServer(opts));
var markManualPaid = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(markManualPaid_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const sql = await getSql();
	const rows = await sql.query(`select gym_id from payments where id = $1`, [data.paymentId]);
	if (!rows[0]) throw new Error("Payment not found");
	if (rows[0].gym_id !== actor.gymId && !actor.isSuperAdmin) throw new Error("Forbidden");
	await sql.query(`update payments set reference = coalesce($2, reference), notes = coalesce(notes,'') || ' Owner marked paid.'
       where id = $1 and status = 'pending'`, [data.paymentId, data.reference || null]);
	return { ok: true };
});
var recordRazorpayOrder_createServerFn_handler = createServerRpc({
	id: "e3fc831e8ee46fc0d2b0b6c2b0f89b417ee60eefdcc2ad423de64fc4c88df88a",
	name: "recordRazorpayOrder",
	filename: "src/lib/server/god.ts"
}, (opts) => recordRazorpayOrder.__executeServer(opts));
var recordRazorpayOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(recordRazorpayOrder_createServerFn_handler, async ({ context, data }) => {
	await loadActor(context.userId);
	const sql = await getSql();
	const secret = (await sql.query(`select razorpay_key_secret from payment_settings where id = 'default'`))[0]?.razorpay_key_secret;
	if (!secret) throw new Error("Razorpay is not configured");
	const { createHmac } = await import("node:crypto");
	const body = `${data.razorpay_order_id}|${data.razorpay_payment_id}`;
	if (createHmac("sha256", secret).update(body).digest("hex") !== data.razorpay_signature) throw new Error("Invalid payment signature");
	const rows = await sql.query(`update payments set status = 'received', reference = $2, provider = 'razorpay'
       where id = $1 returning gym_id`, [data.paymentId, data.razorpay_payment_id]);
	if (rows[0]?.gym_id) await sql.query(`update gyms set subscription_status = 'active', current_period_end = now() + interval '30 days' where id = $1`, [rows[0].gym_id]);
	await audit(context.userId, "razorpay_verified", data.razorpay_payment_id, rows[0]?.gym_id);
	return { ok: true };
});
//#endregion
export { confirmPayment_createServerFn_handler, getGodGym_createServerFn_handler, getGodOverview_createServerFn_handler, getPaymentSettings_createServerFn_handler, getPublicCheckout_createServerFn_handler, listGodGyms_createServerFn_handler, listLeads_createServerFn_handler, listPayments_createServerFn_handler, listPlanCatalog_createServerFn_handler, markManualPaid_createServerFn_handler, recordRazorpayOrder_createServerFn_handler, savePaymentSettings_createServerFn_handler, savePlanCatalog_createServerFn_handler, updateGodGym_createServerFn_handler, updateLead_createServerFn_handler };
