import { t as cn } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-CroCFBDV.js
var import_jsx_runtime = require_jsx_runtime();
function Wordmark({ className, to = "/" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: cn("flex items-center gap-2.5 min-w-0", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/getdown-logo.jpg",
			alt: "",
			className: "h-9 w-9 rounded-md object-cover shrink-0"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex min-w-0 flex-col leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-lg font-semibold tracking-tight text-text",
				children: "Getdown Fitness"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-caps",
				children: "Get Down Foundation"
			})]
		})]
	});
}
//#endregion
export { Wordmark as t };
