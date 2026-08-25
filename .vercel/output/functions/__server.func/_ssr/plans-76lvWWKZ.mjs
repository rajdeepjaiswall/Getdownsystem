import { o as __toESM } from "../_runtime.mjs";
import { r as inr } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { t as Field } from "./label-Xiqkwoxn.mjs";
import { t as Input } from "./input-B_pmcD0t.mjs";
import { n as PageHeader } from "./shell-Cs5SOKqP.mjs";
import { C as savePlan, f as listPlans } from "./admin-DgaUrkMa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plans-76lvWWKZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Plans() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["plans"],
		queryFn: () => listPlans()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const mut = useMutation({
		mutationFn: savePlan,
		onSuccess: () => {
			toast.success("Saved");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["plans"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Plans",
			hint: "These are what you sell to your members — not the Getdown Fitness subscription.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen((v) => !v),
				children: "Add plan"
			})
		}),
		open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-4 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3 sm:grid-cols-3",
				onSubmit: (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					mut.mutate({ data: {
						name: String(fd.get("name") || ""),
						duration_days: Number(fd.get("duration_days") || 30),
						price: Number(fd.get("price") || 0)
					} });
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "name",
							required: true,
							placeholder: "Monthly"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Days",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "duration_days",
							type: "number",
							defaultValue: 30
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Price (₹)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "price",
							type: "number",
							defaultValue: 1500
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "sm:col-span-3",
						children: "Save"
					})
				]
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: (q.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: p.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-3xl tabular-nums",
						children: inr(p.price)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-text-muted",
						children: [p.duration_days, " days"]
					})
				]
			}, p.id))
		})
	] });
}
//#endregion
export { Plans as component };
