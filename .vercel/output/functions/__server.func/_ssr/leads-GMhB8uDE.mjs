import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { t as Input } from "./input-B_pmcD0t.mjs";
import { t as Badge } from "./badge-EeB0puxv.mjs";
import { m as updateLead, s as listLeads } from "./god-C5mhhAiC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leads-GMhB8uDE.js
var import_jsx_runtime = require_jsx_runtime();
function Leads() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["leads"],
		queryFn: () => listLeads()
	});
	const mut = useMutation({
		mutationFn: updateLead,
		onSuccess: () => void qc.invalidateQueries({ queryKey: ["leads"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Leads"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-text-muted",
			children: "Marketing contact form."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-3",
			children: (q.data ?? []).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-medium",
							children: [
								String(l.gym_name),
								" · ",
								String(l.owner_name)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-text-muted",
							children: [
								String(l.phone ?? ""),
								" · ",
								String(l.city ?? ""),
								" · ",
								l.member_count ?? "?",
								" members"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm",
							children: String(l.message ?? "")
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: String(l.status) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 rounded-md border border-border bg-surface px-3 text-sm",
						defaultValue: String(l.status),
						onChange: (e) => mut.mutate({ data: {
							id: String(l.id),
							status: e.target.value
						} }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "new",
								children: "new"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "open",
								children: "open"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "won",
								children: "won"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "lost",
								children: "lost"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						defaultValue: String(l.notes ?? ""),
						placeholder: "Notes",
						onBlur: (e) => mut.mutate({ data: {
							id: String(l.id),
							notes: e.target.value
						} })
					})]
				})]
			}, String(l.id)))
		})
	] });
}
//#endregion
export { Leads as component };
