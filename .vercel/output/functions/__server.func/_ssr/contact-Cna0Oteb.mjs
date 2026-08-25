import { o as __toESM } from "../_runtime.mjs";
import { a as FOUNDATION, c as WHATSAPP_LINK, o as FOUNDATION_CITY } from "./constants-BVZriJ13.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as MessageCircle } from "../_libs/lucide-react.mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { t as Field } from "./label-Xiqkwoxn.mjs";
import { n as Textarea, t as Input } from "./input-B_pmcD0t.mjs";
import { i as submitLead } from "./public-w3IgwuSE.mjs";
import { t as Wordmark } from "./brand-CroCFBDV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-Cna0Oteb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContactPage() {
	const [sent, setSent] = (0, import_react.useState)(false);
	const mut = useMutation({
		mutationFn: (payload) => submitLead({ data: payload }),
		onSuccess: () => {
			setSent(true);
			toast.success("Received.");
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex h-16 max-w-3xl items-center px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl px-4 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-caps",
					children: "Enterprise and in-person setup"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-2 font-display text-4xl",
					children: ["Talk to ", FOUNDATION]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 max-w-xl text-text-muted",
					children: [FOUNDATION_CITY, ". For gyms over 150 members, more than one branch, or if you would rather we import the register with you."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: WHATSAPP_LINK,
					className: "mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), " WhatsApp"]
				}),
				sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "mt-10 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl",
							children: "We have it."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-text-muted",
							children: "Someone will call. No drip sequence."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-4",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								children: "Back home"
							})
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-10 grid gap-3",
					onSubmit: (e) => {
						e.preventDefault();
						const fd = new FormData(e.currentTarget);
						mut.mutate({
							gym_name: String(fd.get("gym_name") || ""),
							owner_name: String(fd.get("owner_name") || ""),
							phone: String(fd.get("phone") || ""),
							city: String(fd.get("city") || ""),
							member_count: Number(fd.get("member_count") || 0) || void 0,
							message: String(fd.get("message") || "")
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Gym name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "gym_name",
										required: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Owner name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "owner_name",
										required: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Phone",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "phone",
										type: "tel",
										required: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "City",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { name: "city" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Current member count",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "member_count",
								type: "number"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Message",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								name: "message",
								placeholder: "Branches, current software, what you need"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: mut.isPending,
							children: "Send"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { ContactPage as component };
