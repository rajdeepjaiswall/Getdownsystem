import { i as nid } from "./utils-BRSlrI9s.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-C8-e_nDy.mjs";
import { g as num, m as gymSlugFromHost, p as createServerRpc, r as asGym } from "./helpers-DQ6YjLSg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/public-Dm5by4Ec.js
function mapPlan(r) {
	return {
		id: String(r.id),
		gym_id: String(r.gym_id),
		name: String(r.name),
		duration_days: num(r.duration_days),
		price: num(r.price),
		is_active: Boolean(r.is_active),
		display_order: num(r.display_order)
	};
}
function mapFacility(r) {
	return {
		id: String(r.id),
		gym_id: String(r.gym_id),
		name: String(r.name),
		icon: r.icon ?? null,
		description: r.description ?? null,
		image_url: r.image_url ?? null,
		display_order: num(r.display_order),
		is_visible: Boolean(r.is_visible)
	};
}
async function loadPublicGym(slug) {
	const sql = await getSql();
	const gyms = await sql.query(`select * from gyms where slug = $1`, [slug]);
	const gym = asGym(gyms[0]);
	if (!gym) return null;
	const [plans, amenities, equipment, trainers, testimonials, transformations] = await Promise.all([
		sql.query(`select * from plans where gym_id = $1 and is_active = true order by display_order`, [gym.id]),
		sql.query(`select * from amenities where gym_id = $1 and is_visible = true order by display_order`, [gym.id]),
		sql.query(`select * from equipment where gym_id = $1 and is_visible = true order by display_order`, [gym.id]),
		sql.query(`select * from trainers where gym_id = $1 and is_visible = true order by display_order`, [gym.id]),
		sql.query(`select * from testimonials where gym_id = $1 and is_visible = true`, [gym.id]),
		sql.query(`select * from transformations where gym_id = $1 and is_visible = true`, [gym.id])
	]);
	return {
		gym,
		plans: plans.map((r) => mapPlan(r)),
		amenities: amenities.map((r) => mapFacility(r)),
		equipment: equipment.map((r) => mapFacility(r)),
		trainers: trainers.map((r) => ({
			id: String(r.id),
			gym_id: String(r.gym_id),
			user_id: r.user_id ?? null,
			name: String(r.name),
			photo_url: r.photo_url ?? null,
			speciality: r.speciality ?? null,
			bio: r.bio ?? null,
			phone: r.phone ?? null,
			display_order: num(r.display_order),
			is_visible: Boolean(r.is_visible)
		})),
		testimonials,
		transformations
	};
}
var getPublicGym_createServerFn_handler = createServerRpc({
	id: "2984658dc320cf1ca1771c5ebc340e02a79209082291c25957953426c133bf84",
	name: "getPublicGym",
	filename: "src/lib/server/public.ts"
}, (opts) => getPublicGym.__executeServer(opts));
var getPublicGym = createServerFn({ method: "GET" }).validator((slug) => slug).handler(getPublicGym_createServerFn_handler, async ({ data: slug }) => loadPublicGym(slug));
var resolveHostGym_createServerFn_handler = createServerRpc({
	id: "c60e2438adcb68e9079badefb50d7ff5387456ab7c3131a6db42f3dfd1bf543d",
	name: "resolveHostGym",
	filename: "src/lib/server/public.ts"
}, (opts) => resolveHostGym.__executeServer(opts));
var resolveHostGym = createServerFn({ method: "GET" }).handler(resolveHostGym_createServerFn_handler, async () => {
	const { getRequest } = await import("./ssr.mjs").then((n) => n.c).then((n) => n.t);
	const req = getRequest();
	const host = String(req?.headers.get("x-forwarded-host") ?? req?.headers.get("host") ?? "");
	const slug = gymSlugFromHost(host);
	if (!slug) return { slug: null };
	return { slug };
});
var submitLead_createServerFn_handler = createServerRpc({
	id: "c44a0549a2139305c4e533b47aba86a9c4fd96bc89481be5241f0a3f4adc1074",
	name: "submitLead",
	filename: "src/lib/server/public.ts"
}, (opts) => submitLead.__executeServer(opts));
var submitLead = createServerFn({ method: "POST" }).validator((d) => d).handler(submitLead_createServerFn_handler, async ({ data }) => {
	if (!data.gym_name?.trim() || !data.owner_name?.trim()) throw new Error("Gym name and owner name are required");
	await (await getSql()).query(`insert into leads (id, gym_name, owner_name, phone, city, member_count, message)
       values ($1,$2,$3,$4,$5,$6,$7)`, [
		nid("lead"),
		data.gym_name.trim(),
		data.owner_name.trim(),
		data.phone?.trim() || null,
		data.city?.trim() || null,
		data.member_count ?? null,
		data.message?.trim() || null
	]);
	return { ok: true };
});
var submitEnquiry_createServerFn_handler = createServerRpc({
	id: "dd08098ebce7517d13f7a5629b6afd4317776f12f9c13f72bf4edae559e11273",
	name: "submitEnquiry",
	filename: "src/lib/server/public.ts"
}, (opts) => submitEnquiry.__executeServer(opts));
var submitEnquiry = createServerFn({ method: "POST" }).validator((d) => d).handler(submitEnquiry_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const gyms = await sql.query(`select id from gyms where slug = $1`, [data.slug]);
	if (!gyms[0]) throw new Error("Gym not found");
	await sql.query(`insert into enquiries (id, gym_id, name, phone, message) values ($1,$2,$3,$4,$5)`, [
		nid("enq"),
		gyms[0].id,
		data.name.trim(),
		data.phone?.trim() || null,
		data.message?.trim() || null
	]);
	return { ok: true };
});
var publicSignup_createServerFn_handler = createServerRpc({
	id: "9d6e20201cd1900acc0a01997829a2910401b2259f2ca1340bd5b1f56fdfa9ca",
	name: "publicSignup",
	filename: "src/lib/server/public.ts"
}, (opts) => publicSignup.__executeServer(opts));
var publicSignup = createServerFn({ method: "POST" }).validator((d) => d).handler(publicSignup_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const gyms = await sql.query(`select * from gyms where slug = $1`, [data.slug]);
	const gym = asGym(gyms[0]);
	if (!gym) throw new Error("Gym not found");
	await sql.query(`insert into members (id, gym_id, full_name, phone, email, gender, status, joined_at)
       values ($1,$2,$3,$4,$5,$6,'pending', current_date)`, [
		nid("mem"),
		gym.id,
		data.full_name.trim(),
		data.phone?.trim() || null,
		data.email?.trim() || null,
		data.gender || null
	]);
	return { ok: true };
});
var listShowcaseGyms_createServerFn_handler = createServerRpc({
	id: "3d51328a1aadf4d1d4f6ca3b1f80a55f33313eb94e7c96fd8c620c433f62e551",
	name: "listShowcaseGyms",
	filename: "src/lib/server/public.ts"
}, (opts) => listShowcaseGyms.__executeServer(opts));
var listShowcaseGyms = createServerFn({ method: "GET" }).handler(listShowcaseGyms_createServerFn_handler, async () => {
	return await (await getSql()).query(`select id, name, slug, city, cover_image_url, brand_color, about_text
     from gyms where onboarding_completed = true order by created_at desc limit 6`);
});
//#endregion
export { getPublicGym_createServerFn_handler, listShowcaseGyms_createServerFn_handler, publicSignup_createServerFn_handler, resolveHostGym_createServerFn_handler, submitEnquiry_createServerFn_handler, submitLead_createServerFn_handler };
