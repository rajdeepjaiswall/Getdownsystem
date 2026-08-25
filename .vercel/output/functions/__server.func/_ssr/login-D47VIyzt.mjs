import { o as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GROK_PROVIDERS } from "./server-BjOVmHFq.mjs";
import { s as Route$34 } from "./router-Bmb4eFiN.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Field } from "./label-Xiqkwoxn.mjs";
import { t as Input } from "./input-B_pmcD0t.mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { t as AuthShell } from "./auth-shell-D2lQyuwN.mjs";
import { t as Separator } from "./separator-BnFfEbj0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-D47VIyzt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { next } = Route$34.useSearch();
	const dest = next || "/go";
	const nav = useNavigate();
	const { user, isPending } = useCurrentUserState();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!isPending && user) nav({ to: dest });
	async function onEmail(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		const { error: err } = await authClient.signIn.email({
			email,
			password
		});
		setBusy(false);
		if (err) {
			setError(err.message ?? "Could not sign in");
			return;
		}
		window.location.href = dest;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Log in",
		subtitle: "Owners, staff, trainers and members use the same door. Where you land depends on your role.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => signIn(p.providerId, { callbackURL: dest }),
					children: ["Continue with ", p.label]
				}, p.providerId))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "my-6 flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "flex-1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-caps",
						children: "or email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "flex-1" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3",
				onSubmit: onEmail,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value),
							autoComplete: "email"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Password",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							required: true,
							value: password,
							onChange: (e) => setPassword(e.target.value),
							autoComplete: "current-password"
						})
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						children: busy ? "Signing in…" : "Log in"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/forgot-password",
						className: "text-primary",
						children: "Forgot password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-2",
						children: "·"
					}),
					"New gym?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/signup",
						className: "text-primary",
						children: "Start free"
					})
				]
			})
		] })
	});
}
//#endregion
export { Login as component };
