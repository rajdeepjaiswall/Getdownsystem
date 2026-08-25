import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-C8-e_nDy.mjs";
import { h as loadActor, p as createServerRpc, u as audit, v as requireGod } from "./helpers-DQ6YjLSg.mjs";
import { t as authMiddleware } from "./middleware-DaOqJC0Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session-CW6QFBuo.js
var getMyContext_createServerFn_handler = createServerRpc({
	id: "f281262ab680a9470daf98472375bf3ae48d177b4aa5423552422029ee557b2e",
	name: "getMyContext",
	filename: "src/lib/server/session.ts"
}, (opts) => getMyContext.__executeServer(opts));
var getMyContext = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyContext_createServerFn_handler, async ({ context }) => loadActor(context.userId));
var updateMyProfile_createServerFn_handler = createServerRpc({
	id: "02e090d156a08e55d9ea1d35040aa84c208e09d70bcd04b404e2e031c93a0e51",
	name: "updateMyProfile",
	filename: "src/lib/server/session.ts"
}, (opts) => updateMyProfile.__executeServer(opts));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(updateMyProfile_createServerFn_handler, async ({ context, data }) => {
	await (await getSql()).query(`update profiles set full_name = coalesce($2, full_name), phone = coalesce($3, phone)
       where user_id = $1`, [
		context.userId,
		data.full_name ?? null,
		data.phone ?? null
	]);
	return loadActor(context.userId);
});
var startImpersonation_createServerFn_handler = createServerRpc({
	id: "b9129db2e2f6b92e92f82d684d3366f42c4402ffa2865531634c0cde74912dc9",
	name: "startImpersonation",
	filename: "src/lib/server/session.ts"
}, (opts) => startImpersonation.__executeServer(opts));
var startImpersonation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(startImpersonation_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	requireGod(actor);
	await (await getSql()).query(`insert into impersonations (user_id, gym_id, started_at) values ($1,$2,now())
       on conflict (user_id) do update set gym_id = $2, started_at = now()`, [context.userId, data.gymId]);
	await audit(context.userId, "impersonate", `Started impersonation of gym ${data.gymId}`, data.gymId);
	return loadActor(context.userId);
});
var stopImpersonation_createServerFn_handler = createServerRpc({
	id: "f73486b967c4d7ccaebcfcba3cbf2844d27a3aca062a539c28d3ebc845127a31",
	name: "stopImpersonation",
	filename: "src/lib/server/session.ts"
}, (opts) => stopImpersonation.__executeServer(opts));
var stopImpersonation = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(stopImpersonation_createServerFn_handler, async ({ context }) => {
	await (await getSql()).query(`delete from impersonations where user_id = $1`, [context.userId]);
	await audit(context.userId, "impersonate_stop", "Stopped impersonation");
	return loadActor(context.userId);
});
//#endregion
export { getMyContext_createServerFn_handler, startImpersonation_createServerFn_handler, stopImpersonation_createServerFn_handler, updateMyProfile_createServerFn_handler };
