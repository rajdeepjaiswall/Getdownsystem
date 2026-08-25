import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Building2, C as Dumbbell, F as Activity, T as ClipboardList, _ as Menu, b as LayoutDashboard, d as Shield, f as Settings, i as Users, j as BadgeCheck, k as CalendarClock, l as Sparkles, m as QrCode, n as Warehouse, o as UserPlus, s as TriangleAlert, t as X, x as Image, y as LogOut } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { i as useSessionContext, r as UserButton, t as RoleGate } from "./role-gate-C11Bwj7U.mjs";
import { t as Badge } from "./badge-EeB0puxv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-Cs5SOKqP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminShell() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGate, {
		allow: [
			"gym_owner",
			"staff",
			"super_admin"
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFrame, {})
	});
}
function AdminFrame() {
	const { ctx } = useSessionContext();
	const [open, setOpen] = (0, import_react.useState)(false);
	if (!ctx?.gym && !ctx?.isSuperAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-bg px-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl",
			children: "No gym on this account"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/signup",
				children: "Create one"
			})
		})] })
	});
	const staffOnly = ctx && !ctx.isOwner && !ctx.isSuperAdmin && ctx.roles.includes("staff");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "hidden w-60 shrink-0 border-r border-border bg-surface lg:flex lg:flex-col",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {
					ctx,
					staffOnly: Boolean(staffOnly)
				})
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "absolute inset-0 bg-text/30",
					onClick: () => setOpen(false),
					"aria-label": "Close menu"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "relative z-50 flex h-full w-60 flex-col bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-md p-2",
							onClick: () => setOpen(false),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {
						ctx,
						staffOnly: Boolean(staffOnly),
						onNavigate: () => setOpen(false)
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-14 items-center justify-between gap-3 border-b border-border bg-surface px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-md p-2 lg:hidden",
							onClick: () => setOpen(true),
							"aria-label": "Open menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: ctx?.gym?.name ?? "Admin"
							}), ctx?.impersonating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-accent-clay",
								children: "Impersonating · actions are logged"
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [ctx?.isSuperAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/god",
								className: "hidden text-xs text-text-muted hover:text-text sm:inline",
								children: "Super admin"
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 px-4 py-6 sm:px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				})]
			})
		]
	});
}
function Sidebar({ ctx, staffOnly, onNavigate }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	const ops = [
		{
			to: "/admin",
			label: "Overview",
			icon: LayoutDashboard
		},
		{
			to: "/admin/members",
			label: "Members",
			icon: Users
		},
		{
			to: "/admin/signups",
			label: "Signups",
			icon: UserPlus
		},
		{
			to: "/admin/renewals",
			label: "Renewals due",
			icon: CalendarClock
		},
		{
			to: "/admin/checkins",
			label: "Check-ins",
			icon: QrCode
		},
		{
			to: "/admin/enquiries",
			label: "Enquiries",
			icon: ClipboardList
		},
		{
			to: "/admin/red-list",
			label: "Red list",
			icon: TriangleAlert
		}
	];
	const content = [
		{
			to: "/admin/plans",
			label: "Plans",
			icon: BadgeCheck
		},
		{
			to: "/admin/trainers",
			label: "Trainers",
			icon: Sparkles
		},
		{
			to: "/admin/amenities",
			label: "Amenities",
			icon: Warehouse
		},
		{
			to: "/admin/equipment",
			label: "Equipment",
			icon: Dumbbell
		},
		{
			to: "/admin/testimonials",
			label: "Testimonials",
			icon: Building2
		},
		{
			to: "/admin/transformations",
			label: "Transformations",
			icon: Image
		},
		{
			to: "/admin/profile",
			label: "Gym profile",
			icon: Activity
		}
	];
	const settings = [{
		to: "/admin/settings",
		label: "Settings",
		icon: Settings
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 border-b border-border px-4 py-4",
				children: [ctx.gym?.logo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: ctx.gym.logo_url,
					alt: "",
					className: "h-8 w-8 rounded-md object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-8 w-8 place-items-center rounded-md text-xs font-semibold text-white",
					style: { background: ctx.gym?.brand_color ?? "#5B8C51" },
					children: ctx.gym?.name?.[0] ?? "G"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate text-sm font-semibold",
					children: ctx.gym?.name
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex-1 overflow-y-auto px-2 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-caps px-2 py-2",
						children: "Operations"
					}),
					ops.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
						item: i,
						active: path === i.to,
						onClick: onNavigate
					}, i.to)),
					!staffOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-caps mt-4 px-2 py-2",
							children: "Content"
						}),
						content.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
							item: i,
							active: path === i.to,
							onClick: onNavigate
						}, i.to)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-caps mt-4 px-2 py-2",
							children: "Settings"
						}),
						settings.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
							item: i,
							active: path === i.to,
							onClick: onNavigate
						}, i.to))
					] }) : null,
					ctx.isSuperAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
						item: {
							to: "/god",
							label: "Super admin",
							icon: Shield
						},
						active: path.startsWith("/god"),
						onClick: onNavigate
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex items-center gap-2 border-t border-border px-4 py-3 text-sm text-text-muted hover:text-text",
				onClick: () => void signOut("/"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), " Sign out"]
			})
		]
	});
}
function NavLink({ item, active, onClick }) {
	const Icon = item.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: item.to,
		onClick,
		className: cn("flex items-center gap-2 rounded-md px-2 py-2 text-sm", active ? "bg-primary-tint text-primary font-medium" : "text-text-muted hover:bg-primary-tint/50 hover:text-text"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex-1",
				children: item.label
			}),
			item.badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: item.badge }) : null
		]
	});
}
function PageHeader({ title, hint, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-wrap items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl sm:text-3xl",
			children: title
		}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-text-muted",
			children: hint
		}) : null] }), action]
	});
}
//#endregion
export { PageHeader as n, AdminShell as t };
