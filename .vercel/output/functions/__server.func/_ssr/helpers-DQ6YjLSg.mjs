import { i as nid } from "./utils-BRSlrI9s.mjs";
import { i as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { r as getSql } from "./db-C8-e_nDy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/helpers-DQ6YjLSg.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var AppError = class extends Error {
	status;
	constructor(message, status = 400) {
		super(message);
		this.status = status;
		this.name = "AppError";
	}
};
function num(v, fallback = 0) {
	if (v == null || v === "") return fallback;
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : fallback;
}
function cell(v) {
	if (v == null) return null;
	if (typeof v === "boolean") return v;
	if (typeof v === "number" && Number.isFinite(v)) return v;
	if (typeof v === "bigint") return Number(v);
	if (v instanceof Date) return v.toISOString();
	return String(v);
}
function str(v) {
	const c = cell(v);
	return c == null ? null : String(c);
}
function asGym(row) {
	if (!row) return null;
	let hours = row.opening_hours;
	if (typeof hours === "string") try {
		hours = JSON.parse(hours);
	} catch {
		hours = null;
	}
	return {
		id: String(row.id),
		name: String(row.name),
		slug: String(row.slug),
		city: row.city ?? null,
		address: row.address ?? null,
		phone: row.phone ?? null,
		email: row.email ?? null,
		logo_url: row.logo_url ?? null,
		cover_image_url: row.cover_image_url ?? null,
		brand_color: String(row.brand_color ?? "#5B8C51"),
		about_text: row.about_text ?? null,
		established_year: row.established_year == null ? null : num(row.established_year),
		opening_hours: hours ?? null,
		plan: String(row.plan ?? "starter"),
		member_cap: num(row.member_cap, 50),
		subscription_status: row.subscription_status ?? "trial",
		trial_ends_at: row.trial_ends_at ? String(row.trial_ends_at) : null,
		current_period_end: row.current_period_end ? String(row.current_period_end) : null,
		custom_domain: row.custom_domain ?? null,
		domain_status: row.domain_status ?? "none",
		show_powered_by: Boolean(row.show_powered_by),
		onboarding_completed: Boolean(row.onboarding_completed),
		created_at: String(row.created_at),
		owner_user_id: row.owner_user_id ?? null
	};
}
function asMember(row) {
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
		trainer_id: str(row.trainer_id)
	};
}
function asSubscription(row) {
	return {
		id: String(row.id),
		gym_id: String(row.gym_id),
		member_id: String(row.member_id),
		plan_id: str(row.plan_id),
		plan_name: str(row.plan_name),
		starts_on: str(row.starts_on) ?? "",
		ends_on: str(row.ends_on) ?? "",
		status: String(row.status ?? "active"),
		amount: row.amount == null ? null : num(row.amount)
	};
}
function asProgram(row) {
	return {
		id: String(row.id),
		gym_id: String(row.gym_id),
		member_id: String(row.member_id),
		trainer_id: str(row.trainer_id),
		trainer_name: str(row.trainer_name),
		workout_text: str(row.workout_text),
		diet_text: str(row.diet_text)
	};
}
function asProgress(row) {
	return {
		id: String(row.id),
		logged_on: str(row.logged_on) ?? "",
		weight_kg: row.weight_kg == null ? null : num(row.weight_kg),
		photo_url: str(row.photo_url),
		notes: str(row.notes)
	};
}
function asPayment(row) {
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
		created_at: str(row.created_at) ?? ""
	};
}
function asLead(row) {
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
		created_at: str(row.created_at) ?? ""
	};
}
function asAudit(row) {
	return {
		id: String(row.id),
		action: String(row.action ?? ""),
		detail: str(row.detail),
		created_at: str(row.created_at) ?? ""
	};
}
async function loadActor(userId) {
	const sql = await getSql();
	const u = (await sql.query(`select id, email, name, image from "user" where id = $1`, [userId]))[0];
	await sql.query(`insert into profiles (user_id, full_name, avatar_url, last_login_at)
     values ($1, $2, $3, now())
     on conflict (user_id) do update set last_login_at = now()`, [
		userId,
		u?.name ?? null,
		u?.image ?? null
	]);
	if (((await sql.query(`select count(*)::int as c from user_roles where role = 'super_admin'`))[0]?.c ?? 0) === 0) {
		await sql.query(`insert into user_roles (id, user_id, role, gym_id) values ($1, $2, 'super_admin', null)`, [nid("role"), userId]);
		await sql.query(`insert into audit_log (id, actor_user_id, action, detail)
       values ($1, $2, 'bootstrap_super_admin', 'First signed-in user claimed the god panel')`, [nid("aud"), userId]);
	}
	if (u?.email) {
		const invites = await sql.query(`select id, gym_id, role from staff_invites
        where lower(email) = lower($1) and accepted = false`, [u.email]);
		for (const inv of invites) {
			await sql.query(`insert into user_roles (id, user_id, role, gym_id) values ($1, $2, $3, $4)
         on conflict do nothing`, [
				nid("role"),
				userId,
				inv.role,
				inv.gym_id
			]);
			await sql.query(`update staff_invites set accepted = true where id = $1`, [inv.id]);
			await sql.query(`update profiles set gym_id = $1 where user_id = $2`, [inv.gym_id, userId]);
		}
		const mems = await sql.query(`select id, gym_id from members where lower(email) = lower($1) limit 1`, [u.email]);
		if (mems[0]) {
			await sql.query(`insert into user_roles (id, user_id, role, gym_id) values ($1, $2, 'member', $3)
         on conflict do nothing`, [
				nid("role"),
				userId,
				mems[0].gym_id
			]);
			await sql.query(`update members set user_id = $1 where id = $2 and user_id is null`, [userId, mems[0].id]);
		}
	}
	const roles = await sql.query(`select role, gym_id from user_roles where user_id = $1`, [userId]);
	const roleList = [...new Set(roles.map((r) => r.role))];
	const isSuperAdmin = roleList.includes("super_admin");
	const imp = await sql.query(`select gym_id from impersonations where user_id = $1`, [userId]);
	let gymId = null;
	if (imp[0]) gymId = imp[0].gym_id;
	else gymId = roles.find((r) => r.role === "gym_owner")?.gym_id ?? roles.find((r) => r.role === "staff")?.gym_id ?? roles.find((r) => r.role === "trainer")?.gym_id ?? roles.find((r) => r.role === "member")?.gym_id ?? null;
	let gym = null;
	if (gymId) gym = asGym((await sql.query(`select * from gyms where id = $1`, [gymId]))[0]);
	const memberRow = await sql.query(`select id from members where user_id = $1 limit 1`, [userId]);
	const trainerRow = await sql.query(`select id from trainers where user_id = $1 limit 1`, [userId]);
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
		trainerId: trainerRow[0]?.id ?? null
	};
}
function requireGymId(actor) {
	if (!actor.gymId) throw new AppError("No gym on this account. Finish signup first.", 403);
	return actor.gymId;
}
function requireAdmin(actor) {
	if (actor.isSuperAdmin || actor.isOwner || actor.roles.includes("staff")) return requireGymId(actor);
	throw new AppError("Staff access required", 403);
}
function requireOwner(actor) {
	if (actor.isSuperAdmin || actor.isOwner) return requireGymId(actor);
	throw new AppError("Owner access required", 403);
}
function requireGod(actor) {
	if (!actor.isSuperAdmin) throw new AppError("Super admin only", 403);
}
function requireTrainer(actor) {
	if (actor.isSuperAdmin || actor.isOwner || actor.isTrainer) return requireGymId(actor);
	throw new AppError("Trainer access required", 403);
}
function capMessage(cap) {
	return `This gym has reached its ${cap} member limit. Upgrade the plan to add more people.`;
}
async function countActiveMembers(gymId) {
	return (await (await getSql()).query(`select count(*)::int as c from members where gym_id = $1 and status = 'active'`, [gymId]))[0]?.c ?? 0;
}
async function audit(actorId, action, detail, gymId) {
	await (await getSql()).query(`insert into audit_log (id, actor_user_id, gym_id, action, detail) values ($1,$2,$3,$4,$5)`, [
		nid("aud"),
		actorId,
		gymId ?? null,
		action,
		detail
	]);
}
function gymSlugFromHost(host) {
	const m = (host.split(":")[0]?.toLowerCase() ?? "").match(/^([a-z0-9-]+)\.getdownfitness\.in$/);
	if (m && m[1] && ![
		"www",
		"app",
		"api",
		"admin",
		"god"
	].includes(m[1])) return m[1];
	return null;
}
//#endregion
export { str as S, requireAdmin as _, asMember as a, requireOwner as b, asProgress as c, capMessage as d, countActiveMembers as f, num as g, loadActor as h, asLead as i, asSubscription as l, gymSlugFromHost as m, asAudit as n, asPayment as o, createServerRpc as p, asGym as r, asProgram as s, AppError as t, audit as u, requireGod as v, requireTrainer as x, requireGymId as y };
