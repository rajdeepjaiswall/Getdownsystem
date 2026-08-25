import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { r as getMemberProgram } from "./member-htK_68s1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plan-Dohth0nv.js
var import_jsx_runtime = require_jsx_runtime();
function Plan() {
	const p = useQuery({
		queryKey: ["member-program"],
		queryFn: () => getMemberProgram()
	}).data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "My plan"
		}), !p ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-text-muted",
			children: "Your trainer has not assigned a plan yet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-text-muted",
				children: ["Coach ", String(p.trainer_name ?? "")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-caps",
					children: "Workout"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "mt-2 whitespace-pre-wrap font-sans text-sm",
					children: String(p.workout_text ?? "")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-caps",
					children: "Diet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "mt-2 whitespace-pre-wrap font-sans text-sm",
					children: String(p.diet_text ?? "")
				})]
			})
		] })]
	});
}
//#endregion
export { Plan as component };
