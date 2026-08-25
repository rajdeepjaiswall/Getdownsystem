import { t as cn } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useSessionContext, r as UserButton, t as RoleGate } from "./role-gate-C11Bwj7U.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-_WGALd7I.js
var import_jsx_runtime = require_jsx_runtime();
function Shell() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGate, {
		allow: [
			"trainer",
			"gym_owner",
			"super_admin"
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Frame, {})
	});
}
function Frame() {
	const { ctx } = useSessionContext();
	const path = useRouterState({ select: (s) => s.location.pathname });
	const color = ctx?.gym?.brand_color || "#5B8C51";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "border-b border-border bg-surface",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-14 max-w-3xl items-center justify-between px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [ctx?.gym?.logo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: ctx.gym.logo_url,
						alt: "",
						className: "h-8 w-8 rounded-md object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-8 w-8 place-items-center rounded-md text-white text-xs",
						style: { background: color },
						children: ctx?.gym?.name?.[0]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm font-semibold",
						children: ["Trainer · ", ctx?.gym?.name]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mx-auto flex max-w-3xl gap-1 px-2 pb-2",
				children: [{
					to: "/trainer",
					label: "Clients"
				}].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: t.to,
					className: cn("rounded-md px-3 py-2 text-sm", path === t.to ? "bg-primary-tint text-primary font-medium" : "text-text-muted"),
					children: t.label
				}, t.to))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-3xl px-4 py-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})]
	});
}
//#endregion
export { Shell as component };
