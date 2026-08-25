import { o as __toESM } from "../_runtime.mjs";
import { s as PLANS } from "./constants-BVZriJ13.mjs";
import { r as inr } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GROK_PROVIDERS } from "./server-BjOVmHFq.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { o as Route$33 } from "./router-Bmb4eFiN.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Field } from "./label-Xiqkwoxn.mjs";
import { t as Input } from "./input-B_pmcD0t.mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { n as createGymForOwner } from "./admin-DgaUrkMa.mjs";
import { t as AuthShell } from "./auth-shell-D2lQyuwN.mjs";
import { a as getPublicCheckout, u as markManualPaid } from "./god-C5mhhAiC.mjs";
import { t as Separator } from "./separator-BnFfEbj0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signup-JO9yO9Yg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Signup() {
	const { plan: planParam } = Route$33.useSearch();
	const plan = PLANS.find((p) => p.id === planParam && !p.enterprise)?.id ?? "starter";
	const chosen = PLANS.find((p) => p.id === plan);
	const { user, isPending } = useCurrentUserState();
	const nav = useNavigate();
	const checkout = useQuery({
		queryKey: ["checkout"],
		queryFn: () => getPublicCheckout()
	});
	const [step, setStep] = (0, import_react.useState)("form");
	const [payId, setPayId] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		gym: "",
		owner: "",
		email: "",
		password: "",
		phone: "",
		city: ""
	});
	if (planParam === "enterprise") nav({ to: "/contact" });
	function set(k, v) {
		setForm((f) => ({
			...f,
			[k]: v
		}));
	}
	async function afterAuth() {
		const created = await createGymForOwner({ data: {
			name: form.gym,
			city: form.city,
			phone: form.phone,
			plan,
			owner_name: form.owner
		} });
		setPayId(created.paymentId);
		setStep("pay");
	}
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			if (!user) {
				const { error: err } = await authClient.signUp.email({
					email: form.email,
					password: form.password,
					name: form.owner
				});
				if (err) throw new Error(err.message ?? "Could not create account");
			}
			await afterAuth();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setBusy(false);
		}
	}
	async function paid() {
		if (payId) try {
			await markManualPaid({ data: { paymentId: payId } });
		} catch {}
		window.location.href = "/setup";
	}
	if (step === "pay") {
		const c = checkout.data;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthShell, {
			title: "Pay the first month",
			subtitle: "Manual UPI is the default. We switch the gym on when the payment lands.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "label-caps",
							children: [chosen.name, " plan"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-4xl tabular-nums",
							children: inr(chosen.price ?? 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-text-muted",
							children: "Pay to"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: c?.account
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-sm tabular-nums",
							children: c?.upi
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-text-muted",
							children: c?.instructions
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6 w-full",
					onClick: () => void paid(),
					children: "I have paid"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-3 w-full text-sm text-text-muted",
					onClick: () => window.location.href = "/setup",
					children: "Skip for now — 14-day trial"
				})
			]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthShell, {
		title: "Open your gym on Getdown",
		subtitle: `${chosen.name} · ${chosen.price ? inr(chosen.price) + "/month" : "custom"} · up to ${chosen.memberCap} members`,
		children: [
			isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-lg bg-border" }) : null,
			!isPending && !user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => signIn(p.providerId, { callbackURL: `/signup?plan=${plan}` }),
					children: ["Continue with ", p.label]
				}, p.providerId))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "my-6 flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "flex-1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-caps",
						children: "or email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "flex-1" })
				]
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3",
				onSubmit: (e) => void onSubmit(e),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Gym name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: form.gym,
							onChange: (e) => set("gym", e.target.value),
							placeholder: "Shakti Fitness"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Your name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: form.owner,
							onChange: (e) => set("owner", e.target.value)
						})
					}),
					!user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							required: true,
							value: form.email,
							onChange: (e) => set("email", e.target.value)
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Password",
						hint: "At least 8 characters",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							required: true,
							minLength: 8,
							value: form.password,
							onChange: (e) => set("password", e.target.value)
						})
					})] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "tel",
								required: true,
								value: form.phone,
								onChange: (e) => set("phone", e.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "City",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								value: form.city,
								onChange: (e) => set("city", e.target.value),
								placeholder: "Prayagraj"
							})
						})]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						children: busy ? "Creating…" : "Create gym"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-text-muted",
				children: [
					"Already have an account?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "text-primary",
						children: "Log in"
					})
				]
			})
		]
	});
}
//#endregion
export { Signup as component };
