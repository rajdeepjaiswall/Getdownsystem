import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useSessionContext, n as Skeleton, t as RoleGate } from "./role-gate-C11Bwj7U.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/go-Df2iOkU9.js
var import_jsx_runtime = require_jsx_runtime();
function Go() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGate, {
		allow: "any",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Redirector, {})
	});
}
function Redirector() {
	const { ctx, isPending } = useSessionContext();
	if (isPending || !ctx) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-40" })
	});
	if (ctx.isSuperAdmin && !ctx.gymId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/god" });
	if (ctx.isOwner || ctx.isStaff) {
		if (ctx.gym && !ctx.gym.onboarding_completed && ctx.isOwner) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/setup" });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/admin" });
	}
	if (ctx.isTrainer) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/trainer" });
	if (ctx.isMember) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/app" });
	if (ctx.isSuperAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/god" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/signup" });
}
//#endregion
export { Go as component };
