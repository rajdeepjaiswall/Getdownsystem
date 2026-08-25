import { t as cn } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-EeB0puxv.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "default", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
			default: "bg-primary-tint text-primary",
			primary: "bg-primary text-white",
			clay: "bg-accent-clay/15 text-accent-clay",
			warn: "bg-warn-tint text-warn",
			danger: "bg-danger-tint text-danger",
			muted: "bg-border/80 text-text-muted"
		}[tone], className),
		...props
	});
}
//#endregion
export { Badge as t };
