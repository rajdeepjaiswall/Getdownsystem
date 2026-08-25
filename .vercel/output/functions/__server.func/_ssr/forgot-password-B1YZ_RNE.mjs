import { o as __toESM } from "../_runtime.mjs";
import { c as WHATSAPP_LINK } from "./constants-BVZriJ13.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Field } from "./label-Xiqkwoxn.mjs";
import { t as Input } from "./input-B_pmcD0t.mjs";
import { t as AuthShell } from "./auth-shell-D2lQyuwN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-password-B1YZ_RNE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Forgot() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [done, setDone] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthShell, {
		title: "Reset password",
		subtitle: "We do not send reset mail yet. For gyms we onboard in person, WhatsApp is faster.",
		children: [done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 text-sm text-text",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Noted ",
				email,
				". Message us on WhatsApp and we will reset it the same day."
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: WHATSAPP_LINK,
				target: "_blank",
				rel: "noreferrer",
				className: "font-medium text-primary",
				children: "WhatsApp Get Down Foundation"
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-3",
			onSubmit: (e) => {
				e.preventDefault();
				setDone(true);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Email",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "email",
					required: true,
					value: email,
					onChange: (ev) => setEmail(ev.target.value)
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				children: "Request reset"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				className: "text-primary",
				children: "Back to log in"
			})
		})]
	});
}
//#endregion
export { Forgot as component };
