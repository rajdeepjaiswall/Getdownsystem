import { r as inr } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { r as getGodOverview } from "./god-C5mhhAiC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/god-C6NEkI1q.js
var import_jsx_runtime = require_jsx_runtime();
function Overview() {
	const d = useQuery({
		queryKey: ["god-overview"],
		queryFn: () => getGodOverview()
	}).data;
	const tiles = [
		{
			label: "Gyms",
			value: d?.gyms ?? 0,
			to: "/god/gyms"
		},
		{
			label: "Active",
			value: d?.active ?? 0,
			to: "/god/gyms"
		},
		{
			label: "Suspended",
			value: d?.suspended ?? 0,
			to: "/god/gyms"
		},
		{
			label: "Monthly recurring",
			value: inr(d?.mrr ?? 0),
			to: "/god/settings"
		},
		{
			label: "Near member cap",
			value: d?.nearCap ?? 0,
			to: "/god/gyms"
		},
		{
			label: "Signups this month",
			value: d?.signupsThisMonth ?? 0,
			to: "/god/gyms"
		},
		{
			label: "Payments awaiting",
			value: d?.pendingPayments ?? 0,
			to: "/god/payments"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Overview"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-text-muted",
			children: "The business, not a single gym."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: tiles.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: t.to,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 hover:border-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-caps",
						children: t.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-3xl tabular-nums",
						children: t.value
					})]
				})
			}, t.label))
		})
	] });
}
//#endregion
export { Overview as component };
