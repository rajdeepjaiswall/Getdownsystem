import { o as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { M as ArrowUp, P as ArrowDown, c as Trash2 } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { t as Field } from "./label-Xiqkwoxn.mjs";
import { n as Textarea, t as Input } from "./input-B_pmcD0t.mjs";
import { n as PageHeader } from "./shell-Cs5SOKqP.mjs";
import { S as saveFacility, r as deleteFacility, s as listAmenities, u as listEquipment, x as reorderFacilities } from "./admin-DgaUrkMa.mjs";
import { t as Switch } from "./switch-qq4yxMw1.mjs";
import { t as fileToDataUrl } from "./file-to-data-url-BrDw548Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/facility-page-Cbt88bKe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FacilityPage({ kind, title, hint }) {
	const qc = useQueryClient();
	const key = kind;
	const q = useQuery({
		queryKey: [key],
		queryFn: () => kind === "amenities" ? listAmenities() : listEquipment()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const save = useMutation({
		mutationFn: saveFacility,
		onSuccess: () => {
			toast.success("Saved");
			setOpen(false);
			qc.invalidateQueries({ queryKey: [key] });
		}
	});
	const del = useMutation({
		mutationFn: deleteFacility,
		onSuccess: () => void qc.invalidateQueries({ queryKey: [key] })
	});
	const rows = q.data ?? [];
	async function move(id, dir) {
		const ids = rows.map((r) => String(r.id));
		const i = ids.indexOf(id);
		const j = i + dir;
		if (j < 0 || j >= ids.length) return;
		const next = [...ids];
		const [x] = next.splice(i, 1);
		next.splice(j, 0, x);
		await reorderFacilities({ data: {
			kind,
			ids: next
		} });
		qc.invalidateQueries({ queryKey: [key] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title,
			hint,
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
					const file = fd.get("image") ?? null;
					const image_url = file && file.size ? await fileToDataUrl(file) : void 0;
					save.mutate({ data: {
						kind,
						name: String(fd.get("name") || ""),
						description: String(fd.get("description") || ""),
						image_url
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
						label: "Description",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, { name: "description" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Photo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "image",
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
			className: "grid gap-3",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex items-center gap-3 p-3",
				children: [
					r.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: String(r.image_url),
						alt: "",
						className: "h-16 w-20 rounded-md object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 w-20 rounded-md bg-primary-tint" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: String(r.name)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm text-text-muted",
							children: String(r.description ?? "")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: Boolean(r.is_visible),
						onCheckedChange: (v) => save.mutate({ data: {
							kind,
							id: String(r.id),
							name: String(r.name),
							is_visible: v
						} }),
						"aria-label": "Visible on public page"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-md p-2 hover:bg-primary-tint",
						onClick: () => void move(String(r.id), -1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-md p-2 hover:bg-primary-tint",
						onClick: () => void move(String(r.id), 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-md p-2 text-danger hover:bg-danger-tint",
						onClick: () => del.mutate({ data: {
							kind,
							id: String(r.id)
						} }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})
				]
			}, String(r.id)))
		})
	] });
}
//#endregion
export { FacilityPage as t };
