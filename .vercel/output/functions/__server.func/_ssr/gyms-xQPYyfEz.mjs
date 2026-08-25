import { o as __toESM } from "../_runtime.mjs";
import { n as formatDate } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { t as Input } from "./input-B_pmcD0t.mjs";
import { t as Badge } from "./badge-EeB0puxv.mjs";
import { o as listGodGyms } from "./god-C5mhhAiC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gyms-xQPYyfEz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Gyms() {
	const [q, setQ] = (0, import_react.useState)("");
	const [plan, setPlan] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const list = useQuery({
		queryKey: [
			"god-gyms",
			q,
			plan,
			status
		],
		queryFn: () => listGodGyms({ data: {
			q,
			plan: plan || void 0,
			status: status || void 0
		} })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Gyms"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "max-w-xs",
					placeholder: "Search name, city, slug",
					value: q,
					onChange: (e) => setQ(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-11 rounded-md border border-border bg-surface px-3 text-sm",
					value: plan,
					onChange: (e) => setPlan(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All plans"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "starter",
							children: "Starter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "growth",
							children: "Growth"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "pro",
							children: "Pro"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "enterprise",
							children: "Enterprise"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-11 rounded-md border border-border bg-surface px-3 text-sm",
					value: status,
					onChange: (e) => setStatus(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All statuses"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "trial",
							children: "Trial"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "active",
							children: "Active"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "past_due",
							children: "Past due"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "suspended",
							children: "Suspended"
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mt-4 overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[48rem] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "border-b border-border text-text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Gym"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "City"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Plan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Members"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Last login"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (list.data ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/god/gyms/$id",
								params: { id: r.gym.id },
								className: "font-medium text-primary",
								children: r.gym?.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-text-muted",
								children: r.gym?.phone
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: r.gym?.city
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 capitalize",
							children: r.gym?.plan
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 tabular-nums",
							children: [
								r.members_used,
								" / ",
								r.gym?.member_cap
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: r.gym?.subscription_status === "active" ? "default" : r.gym?.subscription_status === "suspended" ? "danger" : "warn",
								children: r.gym?.subscription_status
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-text-muted",
							children: formatDate(r.last_login)
						})
					]
				}, r.gym?.id)) })]
			})
		})
	] });
}
//#endregion
export { Gyms as component };
