import { i as DEFAULT_MEMBERSHIP_PLANS } from "./constants-BVZriJ13.mjs";
import { a as slugify, i as nid } from "./utils-BRSlrI9s.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-C8-e_nDy.mjs";
import { S as str, _ as requireAdmin, b as requireOwner, d as capMessage, f as countActiveMembers, g as num, h as loadActor, p as createServerRpc, r as asGym, t as AppError, u as audit } from "./helpers-DQ6YjLSg.mjs";
import { t as authMiddleware } from "./middleware-DaOqJC0Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Dam-ZhyK.js
var getOverview_createServerFn_handler = createServerRpc({
	id: "1cdda05c017f50bdd6729843c75cd9065aaa161a118d6718b92108f2d37cb0f6",
	name: "getOverview",
	filename: "src/lib/server/admin.ts"
}, (opts) => getOverview.__executeServer(opts));
var getOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getOverview_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireAdmin(actor);
	const sql = await getSql();
	const [used, pending, renewals, today, enquiries, red] = await Promise.all([
		countActiveMembers(gymId),
		sql.query(`select count(*)::int as c from members where gym_id = $1 and status = 'pending'`, [gymId]),
		sql.query(`select count(*)::int as c from member_subscriptions
          where gym_id = $1 and status = 'active' and ends_on <= current_date + 7`, [gymId]),
		sql.query(`select count(*)::int as c from checkins
          where gym_id = $1 and checked_in_at::date = current_date`, [gymId]),
		sql.query(`select count(*)::int as c from enquiries where gym_id = $1 and status = 'new'`, [gymId]),
		sql.query(`select count(*)::int as c from members m
          where m.gym_id = $1 and m.status = 'active'
            and not exists (
              select 1 from checkins c
              where c.member_id = m.id and c.checked_in_at > now() - interval '15 days'
            )`, [gymId])
	]);
	const gyms = await sql.query(`select * from gyms where id = $1`, [gymId]);
	return {
		gym: asGym(gyms[0]),
		used,
		cap: actor.gym?.member_cap ?? 50,
		pending: pending[0]?.c ?? 0,
		renewals: renewals[0]?.c ?? 0,
		checkinsToday: today[0]?.c ?? 0,
		enquiries: enquiries[0]?.c ?? 0,
		redList: red[0]?.c ?? 0
	};
});
var listMembers_createServerFn_handler = createServerRpc({
	id: "e00ebf6c8bec020fcc78320bcf48c647793926ebaa2b1eb8716e1d67784a27bd",
	name: "listMembers",
	filename: "src/lib/server/admin.ts"
}, (opts) => listMembers.__executeServer(opts));
var listMembers = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d = {}) => d).handler(listMembers_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireAdmin(actor);
	return (await (await getSql()).query(`select m.*,
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
       order by m.created_at desc`, [
		gymId,
		data.status || null,
		data.q?.trim() || null
	])).map((r) => ({
		id: String(r.id),
		full_name: String(r.full_name),
		status: String(r.status),
		phone: str(r.phone),
		email: str(r.email),
		plan_name: str(r.plan_name),
		sub_ends_on: str(r.sub_ends_on),
		last_checkin: str(r.last_checkin)
	}));
});
var upsertMember_createServerFn_handler = createServerRpc({
	id: "6d829f4cf811e261f46b55e989a488d1d72a1c9e62e6b627f2732fa56b2e8bb0",
	name: "upsertMember",
	filename: "src/lib/server/admin.ts"
}, (opts) => upsertMember.__executeServer(opts));
var upsertMember = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(upsertMember_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireAdmin(actor);
	const sql = await getSql();
	const name = data.full_name.trim();
	if (!name) throw new AppError("Name is required");
	if (!data.id) {
		const gyms = await sql.query(`select member_cap from gyms where id = $1`, [gymId]);
		const used = await countActiveMembers(gymId);
		const cap = num(gyms[0]?.member_cap, 50);
		const nextStatus = data.status ?? "active";
		if (nextStatus === "active" && used >= cap) throw new AppError(capMessage(cap));
		const id = nid("mem");
		try {
			await sql.query(`insert into members (id, gym_id, full_name, phone, email, gender, notes, status, joined_at)
           values ($1,$2,$3,$4,$5,$6,$7,$8, current_date)`, [
				id,
				gymId,
				name,
				data.phone || null,
				data.email || null,
				data.gender || null,
				data.notes || null,
				nextStatus
			]);
		} catch (e) {
			if ((e instanceof Error ? e.message : "").includes("MEMBER_CAP_EXCEEDED")) throw new AppError(capMessage(cap));
			throw e;
		}
		if (data.plan_id) {
			const plan = await sql.query(`select duration_days, price from plans where id = $1 and gym_id = $2`, [data.plan_id, gymId]);
			if (plan[0]) await sql.query(`insert into member_subscriptions (id, gym_id, member_id, plan_id, starts_on, ends_on, status, amount)
             values ($1,$2,$3,$4, current_date, current_date + ($5 || ' days')::interval, 'active', $6)`, [
				nid("sub"),
				gymId,
				id,
				data.plan_id,
				plan[0].duration_days,
				num(plan[0].price)
			]);
		}
		return { id };
	}
	await sql.query(`update members set full_name=$3, phone=$4, email=$5, gender=$6, notes=$7, status=coalesce($8,status)
       where id = $1 and gym_id = $2`, [
		data.id,
		gymId,
		name,
		data.phone || null,
		data.email || null,
		data.gender || null,
		data.notes || null,
		data.status || null
	]);
	return { id: data.id };
});
var approveMember_createServerFn_handler = createServerRpc({
	id: "0e60cb9fb733c7f1a33f9f7b0d229085a764695579cf423d11655c878d4e7599",
	name: "approveMember",
	filename: "src/lib/server/admin.ts"
}, (opts) => approveMember.__executeServer(opts));
var approveMember = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(approveMember_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireAdmin(actor);
	const sql = await getSql();
	const used = await countActiveMembers(gymId);
	const gyms = await sql.query(`select member_cap from gyms where id = $1`, [gymId]);
	const cap = num(gyms[0]?.member_cap, 50);
	if (used >= cap) throw new AppError(capMessage(cap));
	try {
		await sql.query(`update members set status = 'active' where id = $1 and gym_id = $2`, [data.id, gymId]);
	} catch (e) {
		if ((e instanceof Error ? e.message : "").includes("MEMBER_CAP_EXCEEDED")) throw new AppError(capMessage(cap));
		throw e;
	}
	if (data.plan_id) {
		const plan = await sql.query(`select duration_days, price from plans where id = $1 and gym_id = $2`, [data.plan_id, gymId]);
		if (plan[0]) await sql.query(`insert into member_subscriptions (id, gym_id, member_id, plan_id, starts_on, ends_on, status, amount)
           values ($1,$2,$3,$4, current_date, current_date + ($5 || ' days')::interval, 'active', $6)`, [
			nid("sub"),
			gymId,
			data.id,
			data.plan_id,
			plan[0].duration_days,
			num(plan[0].price)
		]);
	}
	return { ok: true };
});
var rejectMember_createServerFn_handler = createServerRpc({
	id: "0179a2f1eea486d0d81c9cb9a87b96ada96142b285775d5b3ca006be4d605a9a",
	name: "rejectMember",
	filename: "src/lib/server/admin.ts"
}, (opts) => rejectMember.__executeServer(opts));
var rejectMember = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(rejectMember_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireAdmin(actor);
	await (await getSql()).query(`delete from members where id = $1 and gym_id = $2 and status = 'pending'`, [data.id, gymId]);
	return { ok: true };
});
var importMembers_createServerFn_handler = createServerRpc({
	id: "b38672ad9864496ec6b227b952df8a484baea4dc40df5a0dc7e87697b4023e1f",
	name: "importMembers",
	filename: "src/lib/server/admin.ts"
}, (opts) => importMembers.__executeServer(opts));
var importMembers = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(importMembers_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireAdmin(actor);
	const sql = await getSql();
	const gyms = await sql.query(`select member_cap from gyms where id = $1`, [gymId]);
	const cap = num(gyms[0]?.member_cap, 50);
	let used = await countActiveMembers(gymId);
	let imported = 0;
	const skipped = [];
	for (const row of data.rows) {
		const name = row.full_name?.trim();
		if (!name) continue;
		if (used >= cap) {
			skipped.push(name);
			continue;
		}
		try {
			await sql.query(`insert into members (id, gym_id, full_name, phone, email, status, joined_at)
           values ($1,$2,$3,$4,$5,'active', current_date)`, [
				nid("mem"),
				gymId,
				name,
				row.phone || null,
				row.email || null
			]);
			used += 1;
			imported += 1;
		} catch {
			skipped.push(name);
		}
	}
	return {
		imported,
		skipped
	};
});
var listRenewals_createServerFn_handler = createServerRpc({
	id: "ab87aaafb5c887cc3d03f4829fe88dd0e4a4002d875b9e7ac622b7c284614ce5",
	name: "listRenewals",
	filename: "src/lib/server/admin.ts"
}, (opts) => listRenewals.__executeServer(opts));
var listRenewals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listRenewals_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireAdmin(actor);
	return (await (await getSql()).query(`select s.id, s.ends_on, s.amount, m.full_name, m.phone, p.name as plan_name
       from member_subscriptions s
       join members m on m.id = s.member_id
       left join plans p on p.id = s.plan_id
       where s.gym_id = $1 and s.status = 'active' and s.ends_on <= current_date + 14
       order by s.ends_on asc`, [gymId])).map((r) => ({
		id: String(r.id),
		full_name: String(r.full_name),
		phone: str(r.phone),
		plan_name: str(r.plan_name),
		ends_on: str(r.ends_on)
	}));
});
var renewSubscription_createServerFn_handler = createServerRpc({
	id: "5391dfdf5d42bf49b07619477a8d7a9e421ac34229011f7c07421df54ee83a82",
	name: "renewSubscription",
	filename: "src/lib/server/admin.ts"
}, (opts) => renewSubscription.__executeServer(opts));
var renewSubscription = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(renewSubscription_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireAdmin(actor);
	const sql = await getSql();
	const s = (await sql.query(`select member_id, plan_id, ends_on, amount from member_subscriptions where id = $1 and gym_id = $2`, [data.subscriptionId, gymId]))[0];
	if (!s) throw new AppError("Subscription not found");
	let days = 30;
	if (s.plan_id) days = (await sql.query(`select duration_days from plans where id = $1`, [s.plan_id]))[0]?.duration_days ?? 30;
	await sql.query(`update member_subscriptions set status = 'renewed' where id = $1`, [data.subscriptionId]);
	await sql.query(`insert into member_subscriptions (id, gym_id, member_id, plan_id, starts_on, ends_on, status, amount)
       values ($1,$2,$3,$4, greatest(current_date, $5::date), greatest(current_date, $5::date) + ($6 || ' days')::interval, 'active', $7)`, [
		nid("sub"),
		gymId,
		s.member_id,
		s.plan_id,
		s.ends_on,
		days,
		s.amount
	]);
	return { ok: true };
});
var listCheckins_createServerFn_handler = createServerRpc({
	id: "109199ec09636ec25b8c2722e1c8c236cb05ce300427b53058fcf2743515adeb",
	name: "listCheckins",
	filename: "src/lib/server/admin.ts"
}, (opts) => listCheckins.__executeServer(opts));
var listCheckins = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listCheckins_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireAdmin(actor);
	return (await (await getSql()).query(`select c.id, c.checked_in_at, c.source, m.full_name
       from checkins c join members m on m.id = c.member_id
       where c.gym_id = $1 order by c.checked_in_at desc limit 200`, [gymId])).map((r) => ({
		id: String(r.id),
		full_name: String(r.full_name),
		checked_in_at: String(r.checked_in_at),
		source: String(r.source)
	}));
});
var listEnquiries_createServerFn_handler = createServerRpc({
	id: "94603f7e3a4f63b3d4915a78c36ef3cbb6b2a26be5d3b3af241b6773761f7f94",
	name: "listEnquiries",
	filename: "src/lib/server/admin.ts"
}, (opts) => listEnquiries.__executeServer(opts));
var listEnquiries = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listEnquiries_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireAdmin(actor);
	return (await (await getSql()).query(`select id, name, phone, message, status, created_at from enquiries where gym_id = $1 order by created_at desc`, [gymId])).map((r) => ({
		id: String(r.id),
		name: String(r.name),
		phone: str(r.phone),
		message: str(r.message),
		status: String(r.status),
		created_at: String(r.created_at)
	}));
});
var setEnquiryStatus_createServerFn_handler = createServerRpc({
	id: "a7d2f01ad0add52039345ff561561a34555bb5e172d1a7c799299670c4ab7f7e",
	name: "setEnquiryStatus",
	filename: "src/lib/server/admin.ts"
}, (opts) => setEnquiryStatus.__executeServer(opts));
var setEnquiryStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(setEnquiryStatus_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireAdmin(actor);
	await (await getSql()).query(`update enquiries set status = $3 where id = $1 and gym_id = $2`, [
		data.id,
		gymId,
		data.status
	]);
	return { ok: true };
});
var listRedList_createServerFn_handler = createServerRpc({
	id: "106ae36947e7d478dae76afd99d286b5d7645542d754a64746ba3711695c02d8",
	name: "listRedList",
	filename: "src/lib/server/admin.ts"
}, (opts) => listRedList.__executeServer(opts));
var listRedList = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listRedList_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireAdmin(actor);
	return (await (await getSql()).query(`select m.id, m.full_name, m.phone,
         (select max(c.checked_in_at) from checkins c where c.member_id = m.id) as last_checkin
       from members m
       where m.gym_id = $1 and m.status = 'active'
         and not exists (
           select 1 from checkins c
           where c.member_id = m.id and c.checked_in_at > now() - interval '15 days'
         )
       order by last_checkin nulls first`, [gymId])).map((r) => ({
		id: String(r.id),
		full_name: String(r.full_name),
		phone: str(r.phone),
		last_checkin: str(r.last_checkin)
	}));
});
var listPlans_createServerFn_handler = createServerRpc({
	id: "b8bdefebd5d0d220de3fd6ed148e6c937c117d7aba658a4e81a235c9951b01f2",
	name: "listPlans",
	filename: "src/lib/server/admin.ts"
}, (opts) => listPlans.__executeServer(opts));
var listPlans = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listPlans_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireAdmin(actor);
	return (await (await getSql()).query(`select * from plans where gym_id = $1 order by display_order`, [gymId])).map((r) => ({
		id: String(r.id),
		gym_id: String(r.gym_id),
		name: String(r.name),
		duration_days: num(r.duration_days),
		price: num(r.price),
		is_active: Boolean(r.is_active),
		display_order: num(r.display_order)
	}));
});
var savePlan_createServerFn_handler = createServerRpc({
	id: "9a130a6d46562ba55fb1cd538080a8f5092f0441146d20f5409a34a447f8dfbc",
	name: "savePlan",
	filename: "src/lib/server/admin.ts"
}, (opts) => savePlan.__executeServer(opts));
var savePlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(savePlan_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireOwner(actor);
	const sql = await getSql();
	if (data.id) {
		await sql.query(`update plans set name=$3, duration_days=$4, price=$5, is_active=coalesce($6,is_active)
         where id = $1 and gym_id = $2`, [
			data.id,
			gymId,
			data.name,
			data.duration_days,
			data.price,
			data.is_active ?? null
		]);
		return { id: data.id };
	}
	const id = nid("plan");
	await sql.query(`insert into plans (id, gym_id, name, duration_days, price, is_active, display_order)
       values ($1,$2,$3,$4,$5,true, (select coalesce(max(display_order),0)+1 from plans where gym_id = $2))`, [
		id,
		gymId,
		data.name,
		data.duration_days,
		data.price
	]);
	return { id };
});
function mapNamed(r) {
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
		icon: str(r.icon)
	};
}
var listTrainers_createServerFn_handler = createServerRpc({
	id: "00eb4e54b513daef97c67626faf2b06458c2a6c43739133b467779262df91b83",
	name: "listTrainers",
	filename: "src/lib/server/admin.ts"
}, (opts) => listTrainers.__executeServer(opts));
var listTrainers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listTrainers_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireAdmin(actor);
	return (await (await getSql()).query(`select * from trainers where gym_id = $1 order by display_order`, [gymId])).map((r) => mapNamed(r));
});
var saveTrainer_createServerFn_handler = createServerRpc({
	id: "62d878597c8bb04b688c11b2ebbf478157e08119585055f2399feb0e947adf76",
	name: "saveTrainer",
	filename: "src/lib/server/admin.ts"
}, (opts) => saveTrainer.__executeServer(opts));
var saveTrainer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveTrainer_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireOwner(actor);
	const sql = await getSql();
	if (data.id) {
		await sql.query(`update trainers set name=$3, speciality=$4, bio=$5, photo_url=coalesce($6,photo_url), phone=$7,
           is_visible=coalesce($8,is_visible)
         where id = $1 and gym_id = $2`, [
			data.id,
			gymId,
			data.name,
			data.speciality || null,
			data.bio || null,
			data.photo_url || null,
			data.phone || null,
			data.is_visible ?? null
		]);
		return { id: data.id };
	}
	const id = nid("tr");
	await sql.query(`insert into trainers (id, gym_id, name, speciality, bio, photo_url, phone) values ($1,$2,$3,$4,$5,$6,$7)`, [
		id,
		gymId,
		data.name,
		data.speciality || null,
		data.bio || null,
		data.photo_url || null,
		data.phone || null
	]);
	return { id };
});
async function listFacility(table, gymId) {
	return (await (await getSql()).query(`select * from ${table} where gym_id = $1 order by display_order`, [gymId])).map((r) => mapNamed(r));
}
var listAmenities_createServerFn_handler = createServerRpc({
	id: "3e3d3514bdc5bc32a0df6d6e1626535f9d17b8cafeedad3c7819996972cc133d",
	name: "listAmenities",
	filename: "src/lib/server/admin.ts"
}, (opts) => listAmenities.__executeServer(opts));
var listAmenities = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAmenities_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	return listFacility("amenities", requireAdmin(actor));
});
var listEquipment_createServerFn_handler = createServerRpc({
	id: "b89a6041e7e7846a910c6f94b88ebd838668a277c1101b87dcf704585c2999a1",
	name: "listEquipment",
	filename: "src/lib/server/admin.ts"
}, (opts) => listEquipment.__executeServer(opts));
var listEquipment = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listEquipment_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	return listFacility("equipment", requireAdmin(actor));
});
var saveFacility_createServerFn_handler = createServerRpc({
	id: "16fbf7a16c542f48c177e204b3dbe663dfcd74cb7d94df1eb9aaa8e5de579bec",
	name: "saveFacility",
	filename: "src/lib/server/admin.ts"
}, (opts) => saveFacility.__executeServer(opts));
var saveFacility = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveFacility_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireOwner(actor);
	const sql = await getSql();
	const table = data.kind === "equipment" ? "equipment" : "amenities";
	if (data.id) {
		await sql.query(`update ${table} set name=$3, icon=$4, description=$5, image_url=coalesce($6,image_url),
           is_visible=coalesce($7,is_visible), display_order=coalesce($8,display_order)
         where id = $1 and gym_id = $2`, [
			data.id,
			gymId,
			data.name,
			data.icon || null,
			data.description || null,
			data.image_url || null,
			data.is_visible ?? null,
			data.display_order ?? null
		]);
		return { id: data.id };
	}
	const id = nid(data.kind === "equipment" ? "eq" : "am");
	await sql.query(`insert into ${table} (id, gym_id, name, icon, description, image_url, display_order)
       values ($1,$2,$3,$4,$5,$6,(select coalesce(max(display_order),0)+1 from ${table} where gym_id = $2))`, [
		id,
		gymId,
		data.name,
		data.icon || null,
		data.description || null,
		data.image_url || null
	]);
	return { id };
});
var reorderFacilities_createServerFn_handler = createServerRpc({
	id: "ca49428868fed86d3246396c094e3adff259a5129fc989cd29ba4b0837365cda",
	name: "reorderFacilities",
	filename: "src/lib/server/admin.ts"
}, (opts) => reorderFacilities.__executeServer(opts));
var reorderFacilities = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(reorderFacilities_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireOwner(actor);
	const sql = await getSql();
	const table = data.kind === "equipment" ? "equipment" : "amenities";
	for (let i = 0; i < data.ids.length; i++) await sql.query(`update ${table} set display_order = $3 where id = $1 and gym_id = $2`, [
		data.ids[i],
		gymId,
		i + 1
	]);
	return { ok: true };
});
var deleteFacility_createServerFn_handler = createServerRpc({
	id: "382ee802fd98e51e1c8bf1e38c9954d33369bc563d606420a951245921f4114e",
	name: "deleteFacility",
	filename: "src/lib/server/admin.ts"
}, (opts) => deleteFacility.__executeServer(opts));
var deleteFacility = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(deleteFacility_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireOwner(actor);
	const sql = await getSql();
	const table = data.kind === "equipment" ? "equipment" : "amenities";
	await sql.query(`delete from ${table} where id = $1 and gym_id = $2`, [data.id, gymId]);
	return { ok: true };
});
var listTestimonials_createServerFn_handler = createServerRpc({
	id: "6b0a3fa1762d4cb5b67ac9500f81a3d0e067c87e075064c91cbb5f52e0a8475f",
	name: "listTestimonials",
	filename: "src/lib/server/admin.ts"
}, (opts) => listTestimonials.__executeServer(opts));
var listTestimonials = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listTestimonials_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	return (await (await getSql()).query(`select * from testimonials where gym_id = $1`, [requireAdmin(actor)])).map((r) => mapNamed(r));
});
var saveTestimonial_createServerFn_handler = createServerRpc({
	id: "e3dff8c5a0e85b347ce83ad844e80ec6cc22f642c9d4f839bd54541e0663fcf6",
	name: "saveTestimonial",
	filename: "src/lib/server/admin.ts"
}, (opts) => saveTestimonial.__executeServer(opts));
var saveTestimonial = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveTestimonial_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireOwner(actor);
	const sql = await getSql();
	if (data.id) {
		await sql.query(`update testimonials set member_name=$3, quote=$4, rating=$5, is_visible=coalesce($6,is_visible)
         where id=$1 and gym_id=$2`, [
			data.id,
			gymId,
			data.member_name,
			data.quote,
			data.rating ?? 5,
			data.is_visible ?? null
		]);
		return { id: data.id };
	}
	const id = nid("ts");
	await sql.query(`insert into testimonials (id, gym_id, member_name, quote, rating) values ($1,$2,$3,$4,$5)`, [
		id,
		gymId,
		data.member_name,
		data.quote,
		data.rating ?? 5
	]);
	return { id };
});
var listTransformations_createServerFn_handler = createServerRpc({
	id: "3d072e0e6aaeb56c4f15bae8e31bb036cdfe11b0ea65a0c34afd4764e0e060fa",
	name: "listTransformations",
	filename: "src/lib/server/admin.ts"
}, (opts) => listTransformations.__executeServer(opts));
var listTransformations = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listTransformations_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	return (await (await getSql()).query(`select * from transformations where gym_id = $1`, [requireAdmin(actor)])).map((r) => mapNamed(r));
});
var saveTransformation_createServerFn_handler = createServerRpc({
	id: "190d3f1290f4cb2c883d45366672d2fbfd3a5f3bda35e923e9e10da8ffa94aa6",
	name: "saveTransformation",
	filename: "src/lib/server/admin.ts"
}, (opts) => saveTransformation.__executeServer(opts));
var saveTransformation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveTransformation_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireOwner(actor);
	const sql = await getSql();
	if (data.id) {
		await sql.query(`update transformations set member_name=$3, story=$4,
           before_url=coalesce($5,before_url), after_url=coalesce($6,after_url),
           is_visible=coalesce($7,is_visible)
         where id=$1 and gym_id=$2`, [
			data.id,
			gymId,
			data.member_name,
			data.story || null,
			data.before_url || null,
			data.after_url || null,
			data.is_visible ?? null
		]);
		return { id: data.id };
	}
	const id = nid("tf");
	await sql.query(`insert into transformations (id, gym_id, member_name, story, before_url, after_url)
       values ($1,$2,$3,$4,$5,$6)`, [
		id,
		gymId,
		data.member_name,
		data.story || null,
		data.before_url || null,
		data.after_url || null
	]);
	return { id };
});
var updateGym_createServerFn_handler = createServerRpc({
	id: "b9891825cdac267256cb8ae820aaf9f5e20ad58c7f52fa829aa50561b90704ba",
	name: "updateGym",
	filename: "src/lib/server/admin.ts"
}, (opts) => updateGym.__executeServer(opts));
var updateGym = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(updateGym_createServerFn_handler, async ({ context, data }) => {
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
		"onboarding_completed"
	];
	const sets = [];
	const params = [];
	let i = 1;
	for (const f of fields) if (f in data) {
		params.push(f === "opening_hours" ? JSON.stringify(data[f]) : data[f]);
		sets.push(`${f} = $${i++}`);
	}
	if (!sets.length) return { ok: true };
	params.push(gymId);
	await sql.query(`update gyms set ${sets.join(", ")} where id = $${i}`, params);
	return { ok: true };
});
var inviteStaff_createServerFn_handler = createServerRpc({
	id: "a3362d96775288d6f12ad1989dc413c90a5284fc1ee9b91868535ec839452e2d",
	name: "inviteStaff",
	filename: "src/lib/server/admin.ts"
}, (opts) => inviteStaff.__executeServer(opts));
var inviteStaff = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(inviteStaff_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireOwner(actor);
	const sql = await getSql();
	const email = data.email.trim().toLowerCase();
	await sql.query(`insert into staff_invites (id, gym_id, email, role, invited_by) values ($1,$2,$3,$4,$5)`, [
		nid("inv"),
		gymId,
		email,
		data.role,
		context.userId
	]);
	const users = await sql.query(`select id from "user" where lower(email) = $1`, [email]);
	if (users[0]) {
		await sql.query(`insert into user_roles (id, user_id, role, gym_id) values ($1,$2,$3,$4) on conflict do nothing`, [
			nid("role"),
			users[0].id,
			data.role,
			gymId
		]);
		await sql.query(`update staff_invites set accepted = true where gym_id = $1 and email = $2`, [gymId, email]);
	}
	return {
		ok: true,
		attached: Boolean(users[0])
	};
});
var listStaffInvites_createServerFn_handler = createServerRpc({
	id: "cae468a26a61e65b5fd410a01847c5795c8302c42bacd319c8fe2fb68a3c0271",
	name: "listStaffInvites",
	filename: "src/lib/server/admin.ts"
}, (opts) => listStaffInvites.__executeServer(opts));
var listStaffInvites = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listStaffInvites_createServerFn_handler, async ({ context }) => {
	const actor = await loadActor(context.userId);
	return (await (await getSql()).query(`select id, email, role, accepted, created_at from staff_invites where gym_id = $1 order by created_at desc`, [requireOwner(actor)])).map((r) => ({
		id: String(r.id),
		email: String(r.email),
		role: String(r.role),
		accepted: Boolean(r.accepted),
		created_at: String(r.created_at)
	}));
});
var seedDefaultPlans_createServerFn_handler = createServerRpc({
	id: "631feae75775b5ef1da60fa0ada8a8215a1d9aa871538af9e6a9f9e0eb9b2f23",
	name: "seedDefaultPlans",
	filename: "src/lib/server/admin.ts"
}, (opts) => seedDefaultPlans.__executeServer(opts));
var seedDefaultPlans = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d = {}) => d).handler(seedDefaultPlans_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	const gymId = requireOwner(actor);
	const sql = await getSql();
	if (((await sql.query(`select count(*)::int as c from plans where gym_id = $1`, [gymId]))[0]?.c ?? 0) > 0 && !data.plans) return { ok: true };
	const list = data.plans?.length ? data.plans : DEFAULT_MEMBERSHIP_PLANS.map((p) => ({
		name: p.name,
		duration_days: p.durationDays,
		price: p.price
	}));
	let order = 1;
	for (const p of list) await sql.query(`insert into plans (id, gym_id, name, duration_days, price, display_order) values ($1,$2,$3,$4,$5,$6)`, [
		nid("plan"),
		gymId,
		p.name,
		p.duration_days,
		p.price,
		order++
	]);
	return { ok: true };
});
async function uniqueSlug(base) {
	const sql = await getSql();
	const slug = slugify(base) || "gym";
	for (let i = 0; i < 20; i++) {
		const trySlug = i === 0 ? slug : `${slug}-${i + 1}`;
		if (!(await sql.query(`select 1 from gyms where slug = $1`, [trySlug])).length) return trySlug;
	}
	return `${slug}-${Date.now().toString(36)}`;
}
var createGymForOwner_createServerFn_handler = createServerRpc({
	id: "1d00432b57d602013f48d1cfe913aabaa95237275e048c3979615847c5d8621d",
	name: "createGymForOwner",
	filename: "src/lib/server/admin.ts"
}, (opts) => createGymForOwner.__executeServer(opts));
var createGymForOwner = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createGymForOwner_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	if (actor.roles.includes("gym_owner") && actor.gymId && !actor.isSuperAdmin) throw new AppError("This account already owns a gym");
	const sql = await getSql();
	const planId = data.plan && data.plan !== "enterprise" ? data.plan : "starter";
	const catalog = await sql.query(`select id, member_cap, price from plan_catalog where id = $1`, [planId]);
	const cap = num(catalog[0]?.member_cap, 50);
	const gymId = nid("gym");
	const slug = await uniqueSlug(data.name);
	await sql.query(`insert into gyms (
         id, name, slug, city, phone, plan, member_cap, subscription_status,
         trial_ends_at, current_period_end, owner_user_id, onboarding_completed
       ) values ($1,$2,$3,$4,$5,$6,$7,'trial', now() + interval '14 days', now() + interval '14 days', $8, false)`, [
		gymId,
		data.name.trim(),
		slug,
		data.city || null,
		data.phone || null,
		planId,
		cap,
		context.userId
	]);
	await sql.query(`insert into user_roles (id, user_id, role, gym_id) values ($1,$2,'gym_owner',$3)`, [
		nid("role"),
		context.userId,
		gymId
	]);
	await sql.query(`update profiles set gym_id = $1, full_name = coalesce($2, full_name), phone = coalesce($3, phone) where user_id = $4`, [
		gymId,
		data.owner_name || null,
		data.phone || null,
		context.userId
	]);
	let order = 1;
	for (const p of DEFAULT_MEMBERSHIP_PLANS) await sql.query(`insert into plans (id, gym_id, name, duration_days, price, display_order) values ($1,$2,$3,$4,$5,$6)`, [
		nid("plan"),
		gymId,
		p.name,
		p.durationDays,
		p.price,
		order++
	]);
	const provider = (await sql.query(`select active_provider from payment_settings where id = 'default'`))[0]?.active_provider ?? "manual";
	const amount = num(catalog[0]?.price, 2500);
	const paymentId = nid("pay");
	await sql.query(`insert into payments (id, gym_id, amount, method, provider, status, notes)
       values ($1,$2,$3,$4,$5,'pending','Signup — first month')`, [
		paymentId,
		gymId,
		amount,
		provider === "manual" ? "upi" : "card",
		provider
	]);
	await audit(context.userId, "gym_created", `Created gym ${data.name} on ${planId}`, gymId);
	return {
		gymId,
		slug,
		paymentId,
		provider,
		amount,
		plan: planId
	};
});
//#endregion
export { approveMember_createServerFn_handler, createGymForOwner_createServerFn_handler, deleteFacility_createServerFn_handler, getOverview_createServerFn_handler, importMembers_createServerFn_handler, inviteStaff_createServerFn_handler, listAmenities_createServerFn_handler, listCheckins_createServerFn_handler, listEnquiries_createServerFn_handler, listEquipment_createServerFn_handler, listMembers_createServerFn_handler, listPlans_createServerFn_handler, listRedList_createServerFn_handler, listRenewals_createServerFn_handler, listStaffInvites_createServerFn_handler, listTestimonials_createServerFn_handler, listTrainers_createServerFn_handler, listTransformations_createServerFn_handler, rejectMember_createServerFn_handler, renewSubscription_createServerFn_handler, reorderFacilities_createServerFn_handler, saveFacility_createServerFn_handler, savePlan_createServerFn_handler, saveTestimonial_createServerFn_handler, saveTrainer_createServerFn_handler, saveTransformation_createServerFn_handler, seedDefaultPlans_createServerFn_handler, setEnquiryStatus_createServerFn_handler, updateGym_createServerFn_handler, upsertMember_createServerFn_handler };
