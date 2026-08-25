import { o as __toESM } from "../_runtime.mjs";
import { n as formatDate, r as inr } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { t as Badge } from "./badge-EeB0puxv.mjs";
import { c as listPayments, t as confirmPayment } from "./god-C5mhhAiC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments-gTIq7T-y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Payments() {
	const [status, setStatus] = (0, import_react.useState)("");
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["payments", status],
		queryFn: () => listPayments({ data: { status: status || void 0 } })
	});
	const mut = useMutation({
		mutationFn: confirmPayment,
		onSuccess: () => {
			toast.success("Marked received — gym activated");
			qc.invalidateQueries({ queryKey: ["payments"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Payments"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			className: "mt-4 h-11 rounded-md border border-border bg-surface px-3 text-sm",
			value: status,
			onChange: (e) => setStatus(e.target.value),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "All"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "pending",
					children: "pending"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "received",
					children: "received"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-3",
			children: (q.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex flex-wrap items-center justify-between gap-3 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-medium",
					children: [
						String(p.gym_name ?? "—"),
						" · ",
						inr(Number(p.amount))
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-text-muted",
					children: [
						String(p.provider),
						" / ",
						String(p.method),
						" · ",
						formatDate(String(p.created_at)),
						" · ",
						String(p.reference ?? "")
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: p.status === "pending" ? "warn" : "default",
						children: String(p.status)
					}), p.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => mut.mutate({ data: { id: String(p.id) } }),
						children: "Mark received"
					}) : null]
				})]
			}, String(p.id)))
		})
	] });
}
//#endregion
export { Payments as component };
