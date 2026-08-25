import { n as formatDate } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { t as Field } from "./label-Xiqkwoxn.mjs";
import { t as Input } from "./input-B_pmcD0t.mjs";
import { t as fileToDataUrl } from "./file-to-data-url-BrDw548Y.mjs";
import { a as listProgress, t as addProgress } from "./member-htK_68s1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/progress-BCMaDoe3.js
var import_jsx_runtime = require_jsx_runtime();
function Progress() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["progress"],
		queryFn: () => listProgress()
	});
	const mut = useMutation({
		mutationFn: addProgress,
		onSuccess: () => {
			toast.success("Logged");
			qc.invalidateQueries({ queryKey: ["progress"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Progress"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid gap-3",
					onSubmit: async (e) => {
						e.preventDefault();
						const fd = new FormData(e.currentTarget);
						const photo = fd.get("photo");
						mut.mutate({ data: {
							weight_kg: Number(fd.get("weight") || 0) || void 0,
							notes: String(fd.get("notes") || ""),
							photo_url: photo && photo.size ? await fileToDataUrl(photo) : void 0
						} });
						e.currentTarget.reset();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Weight (kg)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "weight",
								type: "number",
								step: "0.1"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Photo",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "photo",
								type: "file",
								accept: "image/*"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Notes",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { name: "notes" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Log"
						})
					]
				})
			}),
			(q.data ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-text-muted",
						children: formatDate(String(r.logged_on))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl tabular-nums",
						children: r.weight_kg ? `${r.weight_kg} kg` : "—"
					}),
					r.photo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: String(r.photo_url),
						alt: "",
						className: "mt-2 h-40 w-full rounded-md object-cover"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm",
						children: String(r.notes ?? "")
					})
				]
			}, String(r.id)))
		]
	});
}
//#endregion
export { Progress as component };
