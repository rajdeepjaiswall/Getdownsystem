import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { n as Skeleton } from "./role-gate-C11Bwj7U.mjs";
import { n as PageHeader } from "./shell-Cs5SOKqP.mjs";
import { i as getOverview } from "./admin-DgaUrkMa.mjs";
import { t as Progress } from "./progress-C4uOS_v1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-T-qWdSc6.js
var import_jsx_runtime = require_jsx_runtime();
function Overview() {
	const q = useQuery({
		queryKey: ["overview"],
		queryFn: () => getOverview()
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40" });
	const d = q.data;
	if (!d?.gym) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No gym loaded." });
	const pct = d.cap ? Math.round(d.used / d.cap * 100) : 0;
	const hot = pct >= 80;
	const kpis = [
		{
			label: "Members",
			value: d.used,
			to: "/admin/members"
		},
		{
			label: "Pending signups",
			value: d.pending,
			to: "/admin/signups"
		},
		{
			label: "Renewals (7d)",
			value: d.renewals,
			to: "/admin/renewals"
		},
		{
			label: "Checked in today",
			value: d.checkinsToday,
			to: "/admin/checkins"
		},
		{
			label: "New enquiries",
			value: d.enquiries,
			to: "/admin/enquiries"
		},
		{
			label: "Red list",
			value: d.redList,
			to: "/admin/red-list"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Overview",
			hint: `${d.gym.name} · ${d.gym.plan} plan`,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/g/$slug",
					params: { slug: d.gym.slug },
					children: "Public page"
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: d.used
							}),
							" / ",
							d.cap,
							" members used"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "label-caps",
						children: [pct, "%"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: pct,
					className: "mt-3",
					barClassName: hot ? "bg-accent-clay" : void 0
				}),
				hot ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-accent-clay",
					children: [
						"You are over 80% of capacity.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/settings",
							className: "font-medium underline",
							children: "Upgrade"
						}),
						" ",
						"before the next walk-in is turned away."
					]
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: kpis.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: k.to,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 hover:border-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-caps",
						children: k.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-4xl tabular-nums",
						children: k.value
					})]
				})
			}, k.label))
		})
	] });
}
//#endregion
export { Overview as component };
