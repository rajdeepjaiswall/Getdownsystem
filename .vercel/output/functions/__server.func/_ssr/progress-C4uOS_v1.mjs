import { t as cn } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/progress-C4uOS_v1.js
var import_jsx_runtime = require_jsx_runtime();
function Progress({ value, className, barClassName }) {
	const v = Math.max(0, Math.min(100, value));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-2 w-full overflow-hidden rounded-full bg-border", className),
		role: "progressbar",
		"aria-valuenow": Math.round(v),
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("h-full rounded-full bg-primary transition-[width] duration-300", barClassName),
			style: { width: `${v}%` }
		})
	});
}
//#endregion
export { Progress as t };
