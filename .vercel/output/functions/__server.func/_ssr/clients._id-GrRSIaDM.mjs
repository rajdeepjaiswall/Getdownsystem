import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route } from "./router-Bmb4eFiN.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Field } from "./label-Xiqkwoxn.mjs";
import { n as Textarea } from "./input-B_pmcD0t.mjs";
import { c as saveMemberProgram, i as getMemberProgramFor } from "./member-htK_68s1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clients._id-GrRSIaDM.js
var import_jsx_runtime = require_jsx_runtime();
function ClientPlan() {
	const { id } = Route.useParams();
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["program", id],
		queryFn: () => getMemberProgramFor({ data: { member_id: id } })
	});
	const mut = useMutation({
		mutationFn: saveMemberProgram,
		onSuccess: () => {
			toast.success("Plan saved");
			qc.invalidateQueries({ queryKey: ["program", id] });
		}
	});
	const m = q.data?.member;
	const p = q.data?.program;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/trainer",
				className: "text-primary",
				children: "Clients"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-display text-3xl",
			children: String(m?.full_name ?? "Client")
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-6 grid gap-4",
			onSubmit: (e) => {
				e.preventDefault();
				const fd = new FormData(e.currentTarget);
				mut.mutate({ data: {
					member_id: id,
					workout_text: String(fd.get("workout") || ""),
					diet_text: String(fd.get("diet") || "")
				} });
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Workout",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						name: "workout",
						className: "min-h-40",
						defaultValue: String(p?.workout_text ?? "")
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Diet",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						name: "diet",
						className: "min-h-40",
						defaultValue: String(p?.diet_text ?? "")
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Save plan"
				})
			]
		})
	] });
}
//#endregion
export { ClientPlan as component };
