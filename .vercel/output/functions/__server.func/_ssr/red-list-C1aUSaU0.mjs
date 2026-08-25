import { n as formatDate } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { n as PageHeader } from "./shell-Cs5SOKqP.mjs";
import { p as listRedList } from "./admin-DgaUrkMa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/red-list-C1aUSaU0.js
var import_jsx_runtime = require_jsx_runtime();
function RedList() {
	const q = useQuery({
		queryKey: ["red-list"],
		queryFn: () => listRedList()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Red list",
		hint: "Active members with no attendance in 15 days. Call them before they quietly expire."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [(q.data ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "flex items-center justify-between gap-3 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: String(m.full_name)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-text-muted",
				children: String(m.phone ?? "—")
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-accent-clay",
				children: ["Last in ", m.last_checkin ? formatDate(String(m.last_checkin)) : "never"]
			})]
		}, String(m.id))), q.data?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-text-muted",
			children: "Everyone has shown up. Good."
		}) : null]
	})] });
}
//#endregion
export { RedList as component };
