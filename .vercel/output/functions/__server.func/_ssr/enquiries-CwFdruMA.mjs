import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { t as Badge } from "./badge-EeB0puxv.mjs";
import { n as PageHeader } from "./shell-Cs5SOKqP.mjs";
import { O as setEnquiryStatus, l as listEnquiries } from "./admin-DgaUrkMa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/enquiries-CwFdruMA.js
var import_jsx_runtime = require_jsx_runtime();
function Enquiries() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["enquiries"],
		queryFn: () => listEnquiries()
	});
	const mut = useMutation({
		mutationFn: setEnquiryStatus,
		onSuccess: () => void qc.invalidateQueries({ queryKey: ["enquiries"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Enquiries",
		hint: "From your public gym page."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [(q.data ?? []).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: String(e.name)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-text-muted",
						children: String(e.phone ?? "")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: String(e.message ?? "")
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: e.status === "new" ? "warn" : "muted",
						children: String(e.status)
					}), e.status === "new" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => mut.mutate({ data: {
							id: String(e.id),
							status: "closed"
						} }),
						children: "Close"
					}) : null]
				})]
			})
		}, String(e.id))), q.data?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-text-muted",
			children: "No enquiries yet."
		}) : null]
	})] });
}
//#endregion
export { Enquiries as component };
