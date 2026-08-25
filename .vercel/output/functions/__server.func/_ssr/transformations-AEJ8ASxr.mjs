import { o as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { t as Field } from "./label-Xiqkwoxn.mjs";
import { n as Textarea, t as Input } from "./input-B_pmcD0t.mjs";
import { n as PageHeader } from "./shell-Cs5SOKqP.mjs";
import { E as saveTransformation, v as listTransformations } from "./admin-DgaUrkMa.mjs";
import { t as fileToDataUrl } from "./file-to-data-url-BrDw548Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/transformations-AEJ8ASxr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["transformations"],
		queryFn: () => listTransformations()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const mut = useMutation({
		mutationFn: saveTransformation,
		onSuccess: () => {
			toast.success("Saved");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["transformations"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Transformations",
			hint: "Before and after — the reason a walk-in becomes a member.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen((v) => !v),
				children: "Add"
			})
		}),
		open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-4 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3",
				onSubmit: async (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					const before = fd.get("before");
					const after = fd.get("after");
					mut.mutate({ data: {
						member_name: String(fd.get("member_name") || ""),
						story: String(fd.get("story") || ""),
						before_url: before && before.size ? await fileToDataUrl(before) : void 0,
						after_url: after && after.size ? await fileToDataUrl(after) : void 0
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
						label: "Story",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, { name: "story" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Photo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "after",
							type: "file",
							accept: "image/*"
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
			className: "grid gap-3 sm:grid-cols-2",
			children: (q.data ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "overflow-hidden",
				children: [t.after_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: String(t.after_url),
					alt: "",
					className: "h-48 w-full object-cover"
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: String(t.member_name)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-text-muted",
						children: String(t.story ?? "")
					})]
				})]
			}, String(t.id)))
		})
	] });
}
//#endregion
export { Page as component };
