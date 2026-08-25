import { o as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { t as Field } from "./label-Xiqkwoxn.mjs";
import { n as Textarea, t as Input } from "./input-B_pmcD0t.mjs";
import { n as PageHeader } from "./shell-Cs5SOKqP.mjs";
import { T as saveTrainer, _ as listTrainers } from "./admin-DgaUrkMa.mjs";
import { t as fileToDataUrl } from "./file-to-data-url-BrDw548Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trainers-CPiruAqX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Trainers() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["trainers"],
		queryFn: () => listTrainers()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const mut = useMutation({
		mutationFn: saveTrainer,
		onSuccess: () => {
			toast.success("Saved");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["trainers"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Trainers",
			hint: "Shown on the public page and in the member app.",
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
					const file = fd.get("photo") ?? null;
					const photo_url = file && file.size ? await fileToDataUrl(file) : void 0;
					mut.mutate({ data: {
						name: String(fd.get("name") || ""),
						speciality: String(fd.get("speciality") || ""),
						bio: String(fd.get("bio") || ""),
						photo_url
					} });
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "name",
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Speciality",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { name: "speciality" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Bio",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, { name: "bio" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Photo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "photo",
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
				className: "flex gap-4 p-4",
				children: [t.photo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: String(t.photo_url),
					alt: "",
					className: "h-20 w-16 rounded-md object-cover"
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: String(t.name)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-primary",
						children: String(t.speciality ?? "")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-text-muted",
						children: String(t.bio ?? "")
					})
				] })]
			}, String(t.id)))
		})
	] });
}
//#endregion
export { Trainers as component };
