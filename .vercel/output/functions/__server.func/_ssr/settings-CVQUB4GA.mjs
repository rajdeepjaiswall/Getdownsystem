import { r as inr } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { t as Field } from "./label-Xiqkwoxn.mjs";
import { n as Textarea, t as Input } from "./input-B_pmcD0t.mjs";
import { d as savePaymentSettings, f as savePlanCatalog, i as getPaymentSettings, l as listPlanCatalog } from "./god-C5mhhAiC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CVQUB4GA.js
var import_jsx_runtime = require_jsx_runtime();
function Settings() {
	const qc = useQueryClient();
	const pay = useQuery({
		queryKey: ["pay-settings"],
		queryFn: () => getPaymentSettings()
	});
	const catalog = useQuery({
		queryKey: ["plan-catalog"],
		queryFn: () => listPlanCatalog()
	});
	const savePay = useMutation({
		mutationFn: savePaymentSettings,
		onSuccess: () => {
			toast.success("Provider saved — checkout updates for every gym");
			qc.invalidateQueries({ queryKey: ["pay-settings"] });
		}
	});
	const savePlan = useMutation({
		mutationFn: savePlanCatalog,
		onSuccess: () => {
			toast.success("Prices updated");
			qc.invalidateQueries({ queryKey: ["plan-catalog"] });
		}
	});
	const s = pay.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid max-w-2xl gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-text-muted",
				children: "Payment provider and plan prices live here so a change does not need a redeploy."
			})] }),
			s ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "Payment provider"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 grid gap-3",
					onSubmit: (e) => {
						e.preventDefault();
						const fd = new FormData(e.currentTarget);
						savePay.mutate({ data: {
							active_provider: String(fd.get("active_provider") || "manual"),
							manual_upi_id: String(fd.get("manual_upi_id") || ""),
							manual_account_name: String(fd.get("manual_account_name") || ""),
							manual_instructions: String(fd.get("manual_instructions") || ""),
							razorpay_key_id: String(fd.get("razorpay_key_id") || ""),
							razorpay_key_secret: String(fd.get("razorpay_key_secret") || "")
						} });
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Active provider",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								name: "active_provider",
								defaultValue: s.active_provider,
								className: "h-11 rounded-md border border-border bg-surface px-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "manual",
										children: "manual (UPI)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "razorpay",
										children: "razorpay"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "coming_soon",
										children: "coming_soon stub"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "UPI ID",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "manual_upi_id",
								defaultValue: s.manual_upi_id
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Account name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "manual_account_name",
								defaultValue: s.manual_account_name
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Instructions",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								name: "manual_instructions",
								defaultValue: s.manual_instructions
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Razorpay key id",
							hint: "Public. Secret is verified only on the server.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "razorpay_key_id",
								defaultValue: s.razorpay_key_id
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Razorpay key secret",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "razorpay_key_secret",
								type: "password",
								defaultValue: s.razorpay_key_secret
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Save provider"
						})
					]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "Plan catalogue"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-3",
					children: (catalog.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "grid gap-2 sm:grid-cols-[1fr_8rem_8rem_auto] sm:items-end",
						onSubmit: (e) => {
							e.preventDefault();
							const fd = new FormData(e.currentTarget);
							savePlan.mutate({ data: {
								id: p.id,
								price: fd.get("price") === "" ? null : Number(fd.get("price")),
								member_cap: Number(fd.get("member_cap") || p.member_cap)
							} });
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-medium",
								children: [p.name, p.price != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-sm text-text-muted",
									children: inr(p.price)
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "₹ / month",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									name: "price",
									type: "number",
									defaultValue: p.price ?? ""
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Cap",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									name: "member_cap",
									type: "number",
									defaultValue: p.member_cap
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "sm",
								variant: "outline",
								children: "Save"
							})
						]
					}, p.id))
				})]
			})
		]
	});
}
//#endregion
export { Settings as component };
