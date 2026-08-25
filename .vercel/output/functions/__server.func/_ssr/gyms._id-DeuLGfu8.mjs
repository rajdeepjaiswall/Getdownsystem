import { r as inr } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as Route$1 } from "./router-Bmb4eFiN.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { t as Field } from "./label-Xiqkwoxn.mjs";
import { t as Input } from "./input-B_pmcD0t.mjs";
import { n as startImpersonation } from "./session-BFsA8rgt.mjs";
import { t as Badge } from "./badge-EeB0puxv.mjs";
import { t as Switch } from "./switch-qq4yxMw1.mjs";
import { n as getGodGym, p as updateGodGym, t as confirmPayment } from "./god-C5mhhAiC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gyms._id-DeuLGfu8.js
var import_jsx_runtime = require_jsx_runtime();
function GymDetail() {
	const { id } = Route$1.useParams();
	const nav = useNavigate();
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["god-gym", id],
		queryFn: () => getGodGym({ data: { id } })
	});
	const save = useMutation({
		mutationFn: updateGodGym,
		onSuccess: () => {
			toast.success("Updated");
			qc.invalidateQueries({ queryKey: ["god-gym", id] });
		}
	});
	const pay = useMutation({
		mutationFn: confirmPayment,
		onSuccess: () => {
			toast.success("Marked received");
			qc.invalidateQueries({ queryKey: ["god-gym", id] });
		}
	});
	const gym = q.data?.gym;
	if (!gym) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-text-muted",
		children: "Loading…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1fr_20rem]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/god/gyms",
					className: "text-primary",
					children: "Gyms"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl",
				children: gym.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-text-muted",
				children: [
					gym.city,
					" · ",
					gym.slug,
					".getdownfitness.in"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 grid gap-3 sm:grid-cols-2",
				onSubmit: (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					save.mutate({ data: {
						id,
						plan: String(fd.get("plan") || gym.plan),
						member_cap: Number(fd.get("member_cap") || gym.member_cap),
						subscription_status: String(fd.get("subscription_status") || gym.subscription_status),
						current_period_end: String(fd.get("current_period_end") || "") || void 0,
						custom_domain: String(fd.get("custom_domain") || "") || null,
						domain_status: String(fd.get("domain_status") || gym.domain_status),
						brand_color: String(fd.get("brand_color") || gym.brand_color)
					} });
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Plan",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							name: "plan",
							defaultValue: gym.plan,
							className: "h-11 rounded-md border border-border bg-surface px-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "starter",
									children: "Starter"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "growth",
									children: "Growth"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "pro",
									children: "Pro"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "enterprise",
									children: "Enterprise"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Member cap",
						hint: "Override by hand for Enterprise deals",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "member_cap",
							type: "number",
							defaultValue: gym.member_cap
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							name: "subscription_status",
							defaultValue: gym.subscription_status,
							className: "h-11 rounded-md border border-border bg-surface px-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "trial",
									children: "trial"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "active",
									children: "active"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "past_due",
									children: "past_due"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "suspended",
									children: "suspended"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Current period end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "current_period_end",
							defaultValue: gym.current_period_end?.slice(0, 10) ?? "",
							placeholder: "YYYY-MM-DD"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Custom domain",
						hint: "Owner must add a CNAME to this host.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "custom_domain",
							defaultValue: gym.custom_domain ?? "",
							placeholder: "gym.example.in"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Domain status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							name: "domain_status",
							defaultValue: gym.domain_status,
							className: "h-11 rounded-md border border-border bg-surface px-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "none",
									children: "none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "pending",
									children: "pending"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "live",
									children: "live"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Brand colour",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "brand_color",
							type: "color",
							defaultValue: gym.brand_color,
							className: "h-11 w-20 p-1"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: gym.show_powered_by,
							onCheckedChange: (v) => save.mutate({ data: {
								id,
								show_powered_by: v
							} })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: "Show “Powered by Getdown Fitness”"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "sm:col-span-2",
						children: "Save"
					})
				]
			}),
			gym.custom_domain ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-4 p-4 text-sm text-text-muted",
				children: [
					"CNAME ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-text",
						children: gym.custom_domain
					}),
					" →",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-text",
						children: [gym.slug, ".getdownfitness.in"]
					})
				]
			}) : null
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-caps",
						children: "Usage"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-display text-3xl tabular-nums",
						children: [
							q.data?.used,
							" / ",
							gym.member_cap
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4 w-full",
						variant: "outline",
						onClick: async () => {
							await startImpersonation({ data: { gymId: id } });
							toast.message("Impersonation logged");
							nav({ to: "/admin" });
						},
						children: "Impersonate owner"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "Payments"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2 text-sm",
					children: (q.data?.payments ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							inr(Number(p.amount)),
							" · ",
							String(p.status)
						] }), p.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => pay.mutate({ data: { id: String(p.id) } }),
							children: "Received"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: String(p.provider) })]
					}, String(p.id)))
				})]
			})]
		})]
	});
}
//#endregion
export { GymDetail as component };
