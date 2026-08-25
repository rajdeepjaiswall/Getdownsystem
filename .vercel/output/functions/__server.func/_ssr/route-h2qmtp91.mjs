import { t as cn } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Dumbbell, O as ChartLine, S as House, a as UserRound, m as QrCode } from "../_libs/lucide-react.mjs";
import { i as useSessionContext, t as RoleGate } from "./role-gate-C11Bwj7U.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-h2qmtp91.js
var import_jsx_runtime = require_jsx_runtime();
function MemberShell() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGate, {
		allow: [
			"member",
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
	const tabs = [
		{
			to: "/app",
			label: "Home",
			icon: House
		},
		{
			to: "/app/checkin",
			label: "Check in",
			icon: QrCode
		},
		{
			to: "/app/plan",
			label: "My plan",
			icon: Dumbbell
		},
		{
			to: "/app/progress",
			label: "Progress",
			icon: ChartLine
		},
		{
			to: "/app/profile",
			label: "Profile",
			icon: UserRound
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh max-w-md flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-3 border-b border-border px-4 py-3",
				children: [ctx?.gym?.logo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: ctx.gym.logo_url,
					alt: "",
					className: "h-8 w-8 rounded-md object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-8 w-8 place-items-center rounded-md text-xs text-white",
					style: { background: color },
					children: ctx?.gym?.name?.[0]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-semibold",
						children: ctx?.gym?.name
					}), ctx && !ctx.isMember ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-accent-clay",
						children: "Owner preview"
					}) : null]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 px-4 py-5 pb-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed bottom-0 left-0 right-0 mx-auto flex max-w-md border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]",
				children: tabs.map((t) => {
					const active = path === t.to;
					const Icon = t.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: t.to,
						className: cn("flex h-16 flex-1 flex-col items-center justify-center gap-1 text-xs", active ? "font-medium" : "text-text-muted"),
						style: active ? { color } : void 0,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), t.label]
					}, t.to);
				})
			})
		]
	});
}
//#endregion
export { MemberShell as component };
