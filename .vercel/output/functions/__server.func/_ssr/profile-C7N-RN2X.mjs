import { t as APP_NAME } from "./constants-BVZriJ13.mjs";
import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { i as useSessionContext } from "./role-gate-C11Bwj7U.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-C7N-RN2X.js
var import_jsx_runtime = require_jsx_runtime();
function Profile() {
	const { ctx } = useSessionContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Profile"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: ctx?.name ?? ctx?.email
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-text-muted",
				children: ctx?.gym?.name
			}),
			ctx?.isOwner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					children: "Back to desk"
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				onClick: () => void signOut("/"),
				children: "Sign out"
			}),
			ctx?.gym?.show_powered_by ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "pt-8 text-center text-xs text-text-muted",
				children: ["Powered by ", APP_NAME]
			}) : null
		]
	});
}
//#endregion
export { Profile as component };
