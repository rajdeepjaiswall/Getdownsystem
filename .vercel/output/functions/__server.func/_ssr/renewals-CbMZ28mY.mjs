import { n as formatDate } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { n as PageHeader } from "./shell-Cs5SOKqP.mjs";
import { b as renewSubscription, m as listRenewals } from "./admin-DgaUrkMa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/renewals-CbMZ28mY.js
var import_jsx_runtime = require_jsx_runtime();
function Renewals() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["renewals"],
		queryFn: () => listRenewals()
	});
	const mut = useMutation({
		mutationFn: renewSubscription,
		onSuccess: () => {
			toast.success("Renewed");
			qc.invalidateQueries({ queryKey: ["renewals"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Renewals due",
		hint: "Active memberships ending in the next 14 days."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [(q.data ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "flex flex-wrap items-center justify-between gap-3 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: String(r.full_name)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-text-muted",
				children: [
					String(r.plan_name ?? "Plan"),
					" · ends ",
					formatDate(String(r.ends_on)),
					" · ",
					String(r.phone ?? "")
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				onClick: () => mut.mutate({ data: { subscriptionId: String(r.id) } }),
				children: "Mark renewed"
			})]
		}, String(r.id))), q.data?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-text-muted",
			children: "Nobody is due. Enjoy the quiet."
		}) : null]
	})] });
}
//#endregion
export { Renewals as component };
