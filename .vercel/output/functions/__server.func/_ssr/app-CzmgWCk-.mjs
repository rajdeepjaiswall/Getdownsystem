import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { n as getMemberHome } from "./member-htK_68s1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-CzmgWCk-.js
var import_jsx_runtime = require_jsx_runtime();
function daysLeft(ends) {
	if (!ends) return null;
	const end = new Date(ends);
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	return Math.round((end.getTime() - today.getTime()) / 864e5);
}
function Home() {
	const q = useQuery({
		queryKey: ["member-home"],
		queryFn: () => getMemberHome()
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-text-muted",
		children: "Loading…"
	});
	if (q.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-danger",
		children: q.error.message
	});
	const d = q.data;
	const left = daysLeft(d?.subscription ? String(d.subscription.ends_on) : null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: String(d?.member?.full_name ?? "Welcome")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-caps",
						children: "Membership"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-medium",
						children: String(d?.subscription?.plan_name ?? "No plan assigned")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-5xl tabular-nums",
						style: { color: d?.gym?.brand_color },
						children: left == null ? "—" : left
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-text-muted",
						children: "days remaining"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-caps",
							children: "Streak"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-3xl tabular-nums",
							children: d?.streak ?? 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-text-muted",
							children: "days"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-caps",
							children: "Check-ins"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-3xl tabular-nums",
							children: d?.checkinCount ?? 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-text-muted",
							children: "all time"
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { Home as component };
