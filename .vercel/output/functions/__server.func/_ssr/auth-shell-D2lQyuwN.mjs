import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Wordmark } from "./brand-CroCFBDV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-shell-D2lQyuwN.js
var import_jsx_runtime = require_jsx_runtime();
function AuthShell({ title, subtitle, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-10 font-display text-3xl",
					children: title
				}),
				subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-text-muted",
					children: subtitle
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children
				})
			]
		})
	});
}
//#endregion
export { AuthShell as t };
