import { t as cn } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as UserButton, t as RoleGate } from "./role-gate-C11Bwj7U.mjs";
import { t as Wordmark } from "./brand-CroCFBDV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-Cua9wJMo.js
var import_jsx_runtime = require_jsx_runtime();
function GodShell() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGate, {
		allow: ["super_admin"],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Frame, {})
	});
}
function Frame() {
	const path = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "border-b border-border bg-surface",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-14 max-w-6xl items-center justify-between px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { to: "/god" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-caps hidden sm:inline",
						children: "God panel"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						className: "text-sm text-text-muted",
						children: "Desk"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 pb-2",
				children: [
					{
						to: "/god",
						label: "Overview"
					},
					{
						to: "/god/gyms",
						label: "Gyms"
					},
					{
						to: "/god/payments",
						label: "Payments"
					},
					{
						to: "/god/leads",
						label: "Leads"
					},
					{
						to: "/god/settings",
						label: "Settings"
					}
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: i.to,
					className: cn("whitespace-nowrap rounded-md px-3 py-2 text-sm", path === i.to ? "bg-primary-tint text-primary font-medium" : "text-text-muted hover:text-text"),
					children: i.label
				}, i.to))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-6xl px-4 py-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})]
	});
}
//#endregion
export { GodShell as component };
