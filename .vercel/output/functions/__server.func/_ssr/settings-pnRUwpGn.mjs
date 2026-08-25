import { o as __toESM } from "../_runtime.mjs";
import { s as PLANS } from "./constants-BVZriJ13.mjs";
import { r as inr } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { t as Field } from "./label-Xiqkwoxn.mjs";
import { t as Input } from "./input-B_pmcD0t.mjs";
import { t as authClient } from "./client-B40BzJxt.mjs";
import { i as useSessionContext } from "./role-gate-C11Bwj7U.mjs";
import { n as PageHeader } from "./shell-Cs5SOKqP.mjs";
import { h as listStaffInvites, i as getOverview, o as inviteStaff } from "./admin-DgaUrkMa.mjs";
import { t as Progress } from "./progress-C4uOS_v1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-pnRUwpGn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Settings() {
	const { ctx } = useSessionContext();
	const qc = useQueryClient();
	const overview = useQuery({
		queryKey: ["overview"],
		queryFn: () => getOverview()
	});
	const invites = useQuery({
		queryKey: ["invites"],
		queryFn: () => listStaffInvites()
	});
	const invite = useMutation({
		mutationFn: inviteStaff,
		onSuccess: (r) => {
			toast.success(r.attached ? "Attached to existing account" : "Invite saved — they get the role on first login");
			qc.invalidateQueries({ queryKey: ["invites"] });
		}
	});
	const [pw, setPw] = (0, import_react.useState)({
		current: "",
		next: ""
	});
	const gym = ctx?.gym;
	const used = overview.data?.used ?? 0;
	const cap = overview.data?.cap ?? gym?.member_cap ?? 50;
	const plan = PLANS.find((p) => p.id === gym?.plan);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid max-w-2xl gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Settings",
				hint: "Branding lives under Gym profile. This is access, plan, and password."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-caps",
						children: "Current plan"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-2xl capitalize",
						children: gym?.plan
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-text-muted",
						children: [
							plan?.price ? `${inr(plan.price)}/month` : "Custom",
							" · ",
							used,
							" / ",
							cap,
							" members"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						className: "mt-3",
						value: cap ? used / cap * 100 : 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-4",
						variant: "outline",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/signup",
							search: { plan: "growth" },
							children: "Upgrade"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "Invite staff by email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-text-muted",
						children: "Unlimited logins on every plan. Staff see operations only."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 grid gap-3 sm:grid-cols-[1fr_8rem_auto]",
						onSubmit: (e) => {
							e.preventDefault();
							const fd = new FormData(e.currentTarget);
							invite.mutate({ data: {
								email: String(fd.get("email") || ""),
								role: String(fd.get("role") || "staff")
							} });
							e.currentTarget.reset();
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "email",
								type: "email",
								required: true,
								placeholder: "desk@gym.in"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								name: "role",
								className: "h-11 rounded-md border border-border bg-surface px-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "staff",
									children: "Staff"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "trainer",
									children: "Trainer"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Invite"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-1 text-sm text-text-muted",
						children: (invites.data ?? []).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							String(i.email),
							" · ",
							String(i.role),
							" · ",
							i.accepted ? "accepted" : "pending"
						] }, String(i.id)))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "Change password"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 grid gap-3",
					onSubmit: async (e) => {
						e.preventDefault();
						const { error } = await authClient.changePassword({
							currentPassword: pw.current,
							newPassword: pw.next
						});
						if (error) toast.error(error.message ?? "Could not change password");
						else {
							toast.success("Password updated");
							setPw({
								current: "",
								next: ""
							});
						}
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Current",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								value: pw.current,
								onChange: (e) => setPw((p) => ({
									...p,
									current: e.target.value
								}))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "New",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								value: pw.next,
								onChange: (e) => setPw((p) => ({
									...p,
									next: e.target.value
								}))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "outline",
							children: "Update password"
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { Settings as component };
