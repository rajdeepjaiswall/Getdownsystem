import { n as formatDate } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { l as trainerCheckin, o as listTrainerClients } from "./member-htK_68s1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trainer-DDItjUu8.js
var import_jsx_runtime = require_jsx_runtime();
function Clients() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["trainer-clients"],
		queryFn: () => listTrainerClients()
	});
	const mut = useMutation({
		mutationFn: trainerCheckin,
		onSuccess: () => {
			toast.success("Marked present");
			qc.invalidateQueries({ queryKey: ["trainer-clients"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Clients"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-text-muted",
			children: "Attendance and plans for people assigned to you."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-3",
			children: [(q.data ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex flex-wrap items-center justify-between gap-3 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: String(m.full_name)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-text-muted",
					children: ["Last in ", m.last_checkin ? formatDate(String(m.last_checkin)) : "—"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => mut.mutate({ data: { member_id: String(m.id) } }),
						children: "Mark present"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/trainer/clients/$id",
							params: { id: String(m.id) },
							children: "Plan"
						})
					})]
				})]
			}, String(m.id))), q.data?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-text-muted",
				children: "No clients assigned yet."
			}) : null]
		})
	] });
}
//#endregion
export { Clients as component };
