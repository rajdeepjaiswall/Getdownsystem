import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { i as useSessionContext } from "./role-gate-C11Bwj7U.mjs";
import { n as PageHeader } from "./shell-Cs5SOKqP.mjs";
import { c as listCheckins } from "./admin-DgaUrkMa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkins-Bd_CzBZx.js
var import_jsx_runtime = require_jsx_runtime();
function Checkins() {
	const q = useQuery({
		queryKey: ["checkins"],
		queryFn: () => listCheckins()
	});
	const { ctx } = useSessionContext();
	const url = typeof window !== "undefined" && ctx?.gym ? `${window.location.origin}/g/${ctx.gym.slug}` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Check-ins",
			hint: "Gate scans and trainer marks. Put the QR on the door."
		}),
		url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-4 flex items-center gap-4 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				alt: "Gate QR",
				className: "h-28 w-28",
				src: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}`
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-text-muted",
				children: "Members open the app and tap Check in. This QR can also sit on the public page."
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "border-b border-border text-text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Member"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "When"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Source"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (q.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: String(c.full_name)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 tabular-nums text-text-muted",
							children: new Date(String(c.checked_in_at)).toLocaleString("en-IN")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-text-muted",
							children: String(c.source)
						})
					]
				}, String(c.id))) })]
			})
		})
	] });
}
//#endregion
export { Checkins as component };
