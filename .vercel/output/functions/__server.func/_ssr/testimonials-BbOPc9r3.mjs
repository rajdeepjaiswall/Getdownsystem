import { o as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { t as Field } from "./label-Xiqkwoxn.mjs";
import { n as Textarea, t as Input } from "./input-B_pmcD0t.mjs";
import { n as PageHeader } from "./shell-Cs5SOKqP.mjs";
import { g as listTestimonials, w as saveTestimonial } from "./admin-DgaUrkMa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/testimonials-BbOPc9r3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["testimonials"],
		queryFn: () => listTestimonials()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const mut = useMutation({
		mutationFn: saveTestimonial,
		onSuccess: () => {
			toast.success("Saved");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["testimonials"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Testimonials",
			hint: "Quotes on the public page.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen((v) => !v),
				children: "Add"
			})
		}),
		open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-4 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3",
				onSubmit: (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					mut.mutate({ data: {
						member_name: String(fd.get("member_name") || ""),
						quote: String(fd.get("quote") || ""),
						rating: 5
					} });
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Member name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "member_name",
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Quote",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							name: "quote",
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Save"
					})
				]
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3",
			children: (q.data ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-text",
					children: [
						"“",
						String(t.quote),
						"”"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-text-muted",
					children: ["— ", String(t.member_name)]
				})]
			}, String(t.id)))
		})
	] });
}
//#endregion
export { Page as component };
