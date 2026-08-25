import { i as nid } from "./utils-BRSlrI9s.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-C8-e_nDy.mjs";
import { a as asMember, c as asProgress, h as loadActor, l as asSubscription, p as createServerRpc, r as asGym, s as asProgram, t as AppError, x as requireTrainer, y as requireGymId } from "./helpers-DQ6YjLSg.mjs";
import { t as authMiddleware } from "./middleware-DaOqJC0Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/member-DU3uuJdI.js
var getMemberHome_createServerFn_handler = createServerRpc({
	id: "88b514ea38db5c9dbfb29261e9737a6eeb475ae3139d025a469a6639e9d4870d",
	name: "getMemberHome",
	filename: "src/lib/server/member.ts"
}, (opts) => getMemberHome.__executeServer(opts));
var getMemberHome = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMemberHome_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireGymId(actor);
	const sql = await getSql();
	let memberId = actor.memberId;
	if (!memberId && (actor.isOwner || actor.isSuperAdmin)) memberId = (await sql.query(`select id from members where gym_id = $1 and status = 'active' order by created_at limit 1`, [gymId]))[0]?.id ?? null;
	if (!memberId) throw new AppError("No member profile on this account", 403);
	const member = await sql.query(`select * from members where id = $1 and gym_id = $2`, [memberId, gymId]);
	const sub = await sql.query(`select s.*, p.name as plan_name from member_subscriptions s
       left join plans p on p.id = s.plan_id
       where s.member_id = $1 order by s.ends_on desc limit 1`, [memberId]);
	const checkins = await sql.query(`select count(*)::int as c, max(checked_in_at) as last
       from checkins where member_id = $1`, [memberId]);
	const streakRows = await sql.query(`select distinct checked_in_at::date as d from checkins
        where member_id = $1 and checked_in_at > now() - interval '40 days'
        order by 1 desc`, [memberId]);
	let streak = 0;
	const days = streakRows.map((r) => String(r.d).slice(0, 10));
	const today = /* @__PURE__ */ new Date();
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
		gym: asGym(gyms[0]),
		member: member[0] ? asMember(member[0]) : null,
		subscription: sub[0] ? asSubscription(sub[0]) : null,
		checkinCount: checkins[0]?.c ?? 0,
		lastCheckin: checkins[0]?.last ?? null,
		streak
	};
});
var memberCheckin_createServerFn_handler = createServerRpc({
	id: "55bb6692fbd4982fae682edfb176c37a243f950c43342c690f1ad3beac863396",
	name: "memberCheckin",
	filename: "src/lib/server/member.ts"
}, (opts) => memberCheckin.__executeServer(opts));
var memberCheckin = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(memberCheckin_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireGymId(actor);
	const sql = await getSql();
	let memberId = actor.memberId;
	if (!memberId && (actor.isOwner || actor.isSuperAdmin)) memberId = (await sql.query(`select id from members where gym_id = $1 and status = 'active' order by created_at limit 1`, [gymId]))[0]?.id ?? null;
	if (!memberId) throw new AppError("No member profile", 403);
	if (((await sql.query(`select count(*)::int as c from checkins
        where member_id = $1 and checked_in_at::date = current_date`, [memberId]))[0]?.c ?? 0) > 0) return {
		ok: true,
		already: true
	};
	await sql.query(`insert into checkins (id, gym_id, member_id, source) values ($1,$2,$3,'app')`, [
		nid("chk"),
		gymId,
		memberId
	]);
	return {
		ok: true,
		already: false
	};
});
var getMemberProgram_createServerFn_handler = createServerRpc({
	id: "71c1c835c4da84c7ecdbedd7b83bc6d23167435b9ce0df3c57d7d257281db17d",
	name: "getMemberProgram",
	filename: "src/lib/server/member.ts"
}, (opts) => getMemberProgram.__executeServer(opts));
var getMemberProgram = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMemberProgram_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireGymId(actor);
	const sql = await getSql();
	let memberId = actor.memberId;
	if (!memberId && (actor.isOwner || actor.isSuperAdmin)) memberId = (await sql.query(`select id from members where gym_id = $1 and status = 'active' order by created_at limit 1`, [gymId]))[0]?.id ?? null;
	const rows = await sql.query(`select mp.*, t.name as trainer_name
       from member_programs mp
       left join trainers t on t.id = mp.trainer_id
       where mp.member_id = $1 and mp.gym_id = $2`, [memberId, gymId]);
	return rows[0] ? asProgram(rows[0]) : null;
});
var listProgress_createServerFn_handler = createServerRpc({
	id: "2a08bb3f5d215a73c92e3e3b6c2d6937a558640d1b562cd3e92ab4f12305957a",
	name: "listProgress",
	filename: "src/lib/server/member.ts"
}, (opts) => listProgress.__executeServer(opts));
var listProgress = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listProgress_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireGymId(actor);
	const sql = await getSql();
	let memberId = actor.memberId;
	if (!memberId && (actor.isOwner || actor.isSuperAdmin)) memberId = (await sql.query(`select id from members where gym_id = $1 and status = 'active' order by created_at limit 1`, [gymId]))[0]?.id ?? null;
	return (await sql.query(`select * from progress_logs where member_id = $1 and gym_id = $2 order by logged_on desc`, [memberId, gymId])).map((r) => asProgress(r));
});
var addProgress_createServerFn_handler = createServerRpc({
	id: "756b46a3d509e5124192b7b9a5f192f2739642804d783d139dc111f565f65257",
	name: "addProgress",
	filename: "src/lib/server/member.ts"
}, (opts) => addProgress.__executeServer(opts));
var addProgress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(addProgress_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireGymId(actor);
	const memberId = actor.memberId;
	if (!memberId) throw new AppError("No member profile", 403);
	await (await getSql()).query(`insert into progress_logs (id, gym_id, member_id, weight_kg, photo_url, notes)
       values ($1,$2,$3,$4,$5,$6)`, [
		nid("pl"),
		gymId,
		memberId,
		data.weight_kg ?? null,
		data.photo_url || null,
		data.notes || null
	]);
	return { ok: true };
});
var listTrainerClients_createServerFn_handler = createServerRpc({
	id: "e8976ce0ab6591e3eee8a2cb84c5eb01859b67e5fdaac6fdd8f781795adfa90e",
	name: "listTrainerClients",
	filename: "src/lib/server/member.ts"
}, (opts) => listTrainerClients.__executeServer(opts));
var listTrainerClients = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listTrainerClients_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireTrainer(actor);
	const sql = await getSql();
	if (actor.trainerId) return (await sql.query(`select m.*, tc.trainer_id,
           (select max(c.checked_in_at) from checkins c where c.member_id = m.id) as last_checkin
         from trainer_clients tc
         join members m on m.id = tc.member_id
         where tc.trainer_id = $1`, [actor.trainerId])).map((r) => asMember(r));
	return (await sql.query(`select m.*,
         (select max(c.checked_in_at) from checkins c where c.member_id = m.id) as last_checkin
       from members m where m.gym_id = $1 and m.status = 'active' order by m.full_name`, [gymId])).map((r) => asMember(r));
});
var saveMemberProgram_createServerFn_handler = createServerRpc({
	id: "ed4fde08a596408ba4d26d0dd5ed487af14001db3401a5cc76495d68a685dffd",
	name: "saveMemberProgram",
	filename: "src/lib/server/member.ts"
}, (opts) => saveMemberProgram.__executeServer(opts));
var saveMemberProgram = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveMemberProgram_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireTrainer(actor);
	const sql = await getSql();
	const existing = await sql.query(`select id from member_programs where member_id = $1 and gym_id = $2`, [data.member_id, gymId]);
	if (existing[0]) await sql.query(`update member_programs set workout_text = $3, diet_text = $4, trainer_id = $5, updated_at = now()
         where id = $1`, [
		existing[0].id,
		gymId,
		data.workout_text || null,
		data.diet_text || null,
		actor.trainerId
	]);
	else await sql.query(`insert into member_programs (id, gym_id, member_id, trainer_id, workout_text, diet_text)
         values ($1,$2,$3,$4,$5,$6)`, [
		nid("prg"),
		gymId,
		data.member_id,
		actor.trainerId,
		data.workout_text || null,
		data.diet_text || null
	]);
	return { ok: true };
});
var trainerCheckin_createServerFn_handler = createServerRpc({
	id: "93211f303e44c590569580e72103856ed676dafb3d52c0ab4f30c8bda2ce8fe3",
	name: "trainerCheckin",
	filename: "src/lib/server/member.ts"
}, (opts) => trainerCheckin.__executeServer(opts));
var trainerCheckin = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(trainerCheckin_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireTrainer(actor);
	await (await getSql()).query(`insert into checkins (id, gym_id, member_id, source) values ($1,$2,$3,'trainer')`, [
		nid("chk"),
		gymId,
		data.member_id
	]);
	return { ok: true };
});
var getMemberProgramFor_createServerFn_handler = createServerRpc({
	id: "a17e9891f19e7b17da25c0d0007e0025f615bfcb6ed98b9d964821b5d5abca70",
	name: "getMemberProgramFor",
	filename: "src/lib/server/member.ts"
}, (opts) => getMemberProgramFor.__executeServer(opts));
var getMemberProgramFor = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(getMemberProgramFor_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireTrainer(actor);
	const sql = await getSql();
	const rows = await sql.query(`select * from member_programs where member_id = $1 and gym_id = $2`, [data.member_id, gymId]);
	const member = await sql.query(`select * from members where id = $1 and gym_id = $2`, [data.member_id, gymId]);
	return {
		program: rows[0] ? asProgram(rows[0]) : null,
		member: member[0] ? asMember(member[0]) : null
	};
});
//#endregion
export { addProgress_createServerFn_handler, getMemberHome_createServerFn_handler, getMemberProgramFor_createServerFn_handler, getMemberProgram_createServerFn_handler, listProgress_createServerFn_handler, listTrainerClients_createServerFn_handler, memberCheckin_createServerFn_handler, saveMemberProgram_createServerFn_handler, trainerCheckin_createServerFn_handler };
