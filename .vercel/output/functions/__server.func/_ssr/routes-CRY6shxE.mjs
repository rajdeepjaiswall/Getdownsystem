import { o as __toESM } from "../_runtime.mjs";
import { a as FOUNDATION, c as WHATSAPP_LINK, o as FOUNDATION_CITY, s as PLANS } from "./constants-BVZriJ13.mjs";
import { r as inr, t as cn } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime, a as Trigger2, i as Root2, n as Header, r as Item, t as Content2, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as ChevronDown, N as ArrowRight, T as ClipboardList, d as Shield, g as MessageCircle, i as Users, m as QrCode, p as ScrollText, r as Wallet, u as Smartphone, x as Image } from "../_libs/lucide-react.mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { t as Field } from "./label-Xiqkwoxn.mjs";
import { n as Textarea, t as Input } from "./input-B_pmcD0t.mjs";
import { i as submitLead } from "./public-w3IgwuSE.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { t as Badge } from "./badge-EeB0puxv.mjs";
import { t as Wordmark } from "./brand-CroCFBDV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CRY6shxE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Accordion = Root2;
function AccordionItem({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
		className: cn("border-b border-border", className),
		...props
	});
}
function AccordionTrigger({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
		className: "flex",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger2, {
			className: cn("flex flex-1 items-center justify-between gap-4 py-4 text-left text-base font-medium transition-colors hover:text-primary [&[data-state=open]>svg]:rotate-180", className),
			...props,
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 shrink-0 text-text-muted transition-transform duration-200" })]
		})
	});
}
function AccordionContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		className: "overflow-hidden text-sm text-text-muted",
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("pb-4 leading-relaxed", className),
			children
		})
	});
}
function AuthSlot() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-11 w-24 animate-pulse rounded-lg bg-border" });
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		asChild: true,
		size: "sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/go",
			children: "Open app"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/login",
			className: "hidden text-sm font-medium text-text-muted hover:text-text sm:inline",
			children: "Log in"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			size: "sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/signup",
				children: "Start free"
			})
		})]
	});
}
function Nav() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-30 border-b border-border bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-6 text-sm font-medium text-text-muted md:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#features",
							className: "hover:text-text",
							children: "Features"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#pricing",
							className: "hover:text-text",
							children: "Pricing"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#contact",
							className: "hover:text-text",
							children: "Contact"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {})
			]
		})
	});
}
function DashboardMock() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-soft)] sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-caps",
					children: "Shakti Fitness · today"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-display text-2xl text-text",
					children: "Members"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-accent-clay/10 px-3 py-2 text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-caps",
						children: "Renewals due"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl tabular-nums text-accent-clay",
						children: "12"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-md border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-primary-tint/60 text-text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Member"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Plan"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium text-right",
								children: "Left"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [
						{
							name: "Aman Verma",
							plan: "Monthly",
							due: "5d",
							ok: true
						},
						{
							name: "Anjali Tiwari",
							plan: "Monthly",
							due: "3d",
							ok: false
						},
						{
							name: "Priya Singh",
							plan: "Yearly",
							due: "165d",
							ok: true
						},
						{
							name: "Sanjay Srivastava",
							plan: "Monthly",
							due: "12d",
							ok: true
						}
					].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5 font-medium",
								children: r.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5 text-text-muted",
								children: r.plan
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: cn("px-3 py-2.5 text-right tabular-nums", r.ok ? "text-text-muted" : "font-medium text-accent-clay"),
								children: r.due
							})
						]
					}, r.name)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-text-muted",
				children: "42 / 50 members used"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 h-1.5 overflow-hidden rounded-full bg-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-4/5 rounded-full bg-primary" })
			})
		]
	});
}
var FEATURES = [
	{
		icon: Users,
		title: "Member records",
		body: "Every name, phone and photo. Search instead of flipping the register."
	},
	{
		icon: Wallet,
		title: "Plans and renewals",
		body: "Monthly, quarterly, yearly. A list of who is due this week, not a surprise at the gate."
	},
	{
		icon: QrCode,
		title: "QR check-in",
		body: "A code on the door. Members scan. You see who came, and who has not."
	},
	{
		icon: Shield,
		title: "Staff and trainer logins",
		body: "Front desk sees operations. Trainers see their clients. You see everything."
	},
	{
		icon: Smartphone,
		title: "Member mobile app",
		body: "Their plan, days left, and a check-in button — branded as your gym."
	},
	{
		icon: ClipboardList,
		title: "Enquiries and leads",
		body: "The form on your public page writes straight into a list you can call back."
	},
	{
		icon: Image,
		title: "Transformations gallery",
		body: "Before and after, on your page. The reason someone walking past comes in."
	},
	{
		icon: ScrollText,
		title: "Reports",
		body: "Capacity, attendance, money in. One screen instead of three notebooks."
	}
];
function PricingRail({ hover }) {
	const idx = hover ?? -1;
	const fill = idx < 0 ? 0 : idx === 3 ? 100 : (idx + 1) / 4 * 100;
	const label = idx < 0 ? "" : idx === 3 ? "∞" : String([
		50,
		100,
		150
	][idx]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mt-6 px-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1.5 overflow-hidden rounded-full bg-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full rounded-full bg-primary transition-[width] duration-300 ease-out motion-reduce:transition-none",
				style: { width: `${fill}%` }
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex justify-between text-text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-caps",
				children: "Capacity"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-3xl tabular-nums text-accent-clay",
				"aria-live": "polite",
				children: label || "—"
			})]
		})]
	});
}
function Pricing() {
	const [hover, setHover] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "pricing",
		className: "scroll-mt-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-16 sm:py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-caps",
					children: "Pricing"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 max-w-xl font-display text-3xl sm:text-4xl",
					children: "Four prices. One product. The only difference is how many members you can hold."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: PLANS.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						tabIndex: 0,
						onMouseEnter: () => setHover(i),
						onMouseLeave: () => setHover(null),
						onFocus: () => setHover(i),
						onBlur: () => setHover(null),
						className: cn("flex flex-col p-5 transition-colors", p.popular && "border-primary ring-1 ring-primary", p.enterprise && "border-accent-clay/40"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: p.name
								}), p.popular ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Most popular" }) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 font-display text-4xl tabular-nums text-text",
								children: p.price == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-accent-clay",
									children: "Custom"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [inr(p.price), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1 text-base font-sans font-normal text-text-muted",
									children: "/month"
								})] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-text-muted",
								children: p.enterprise ? "150+ members, or more than one branch" : `Up to ${p.memberCap} members`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-auto pt-6",
								children: p.enterprise ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "clay",
									className: "w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/contact",
										children: "Contact us"
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: p.popular ? "default" : "outline",
									className: "w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/signup",
										search: { plan: p.id },
										children: "Start free"
									})
								})
							})
						]
					}, p.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PricingRail, { hover }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-2xl text-sm text-text",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Every plan includes every feature and unlimited staff logins. Only the member limit changes." })
				})
			]
		})
	});
}
function Contact() {
	const [sent, setSent] = (0, import_react.useState)(false);
	const mut = useMutation({
		mutationFn: submitLead,
		onSuccess: () => {
			setSent(true);
			toast.success("We have the note. Someone will call.");
		},
		onError: () => toast.error("Could not send. Try WhatsApp.")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "contact",
		className: "scroll-mt-20 border-t border-border bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-24 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-caps",
					children: "Talk to us"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-3xl sm:text-4xl",
					children: "Sit with the register. We will tell you if software is worth it."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-text-muted",
					children: [
						"Getdown Fitness is built by ",
						FOUNDATION,
						", ",
						FOUNDATION_CITY,
						". The first gyms we take on, we sit with in person."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: WHATSAPP_LINK,
					target: "_blank",
					rel: "noreferrer",
					className: "mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-white hover:bg-primary-hover",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), "WhatsApp us"]
				})
			] }), sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex flex-col justify-center p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl",
					children: "Received."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-text-muted",
					children: "We will call the number you left. No drip emails."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3",
				onSubmit: (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					mut.mutate({ data: {
						gym_name: String(fd.get("gym_name") || ""),
						owner_name: String(fd.get("owner_name") || ""),
						phone: String(fd.get("phone") || ""),
						city: String(fd.get("city") || ""),
						member_count: Number(fd.get("member_count") || 0) || void 0,
						message: String(fd.get("message") || "")
					} });
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Gym name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									name: "gym_name",
									required: true,
									placeholder: "Shakti Fitness"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Owner name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									name: "owner_name",
									required: true,
									placeholder: "Your name"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Phone",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									name: "phone",
									type: "tel",
									required: true,
									placeholder: "98xxxxxxxx"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "City",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									name: "city",
									placeholder: "Prayagraj"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Current member count",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "member_count",
							type: "number",
							min: 0,
							placeholder: "80"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Message",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							name: "message",
							placeholder: "How you run the gym today"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: mut.isPending,
						children: mut.isPending ? "Sending…" : "Send"
					})
				]
			})]
		})
	});
}
function MarketingHome() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:py-20 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "fade-up",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/getdown-logo.jpg",
							alt: "Getdown Foundation",
							className: "mb-6 h-14 w-auto object-contain object-left sm:h-16"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-caps",
							children: "Gym software · Prayagraj"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-display text-4xl leading-tight text-text sm:text-5xl",
							children: "Run the gym without the register."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-md text-base text-text-muted sm:text-lg",
							children: "Memberships, renewals, check-ins and staff — in your name, on your phone. Built for a single-location gym that still keeps names in a notebook and reminders on WhatsApp."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/signup",
									children: ["Start free ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contact",
									children: "Talk to us"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-sm text-text-muted",
							children: [
								"Or",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/g/$slug",
									params: { slug: "shakti-fitness" },
									className: "font-medium text-primary",
									children: "open a live gym page"
								}),
								" ",
								"to see what members see."
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fade-up",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardMock, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-y border-border bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:grid-cols-3",
					children: [
						{
							icon: ScrollText,
							title: "The register",
							body: "A name, a date, a tick. It works until the page tears, the ink fades, and you cannot find who paid in March."
						},
						{
							icon: Wallet,
							title: "The missed renewals",
							body: "People keep training. You keep being nice. At month-end the cash does not match the floor."
						},
						{
							icon: MessageCircle,
							title: "The WhatsApp chaos",
							body: "Diet charts in one chat, overdue fees in another, the trainer asking who is coming tomorrow in a third."
						}
					].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { className: "size-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 font-display text-xl",
								children: c.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-text-muted",
								children: c.body
							})
						]
					}, c.title))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "features",
				className: "scroll-mt-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 py-16 sm:py-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-caps",
							children: "What you get"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 max-w-xl font-display text-3xl sm:text-4xl",
							children: "The desk, the gate, and the member’s phone — one system."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
							children: FEATURES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "size-5 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-3 font-medium",
										children: f.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 text-sm text-text-muted",
										children: f.body
									})
								]
							}, f.title))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pricing, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-3xl px-4 py-16 sm:py-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-caps",
							children: "Questions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-3xl",
							children: "Before you decide on ₹2,500 a month."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Accordion, {
							type: "single",
							collapsible: true,
							className: "mt-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
									value: "cap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, { children: "What happens when I cross my member limit?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, { children: "New active members are blocked until you upgrade. Existing people keep training. We show a plain upgrade link — not a database error. You can also ask us to raise the cap by hand for Enterprise deals." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
									value: "change",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, { children: "Can I change plans?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, { children: "Yes. Starter, Growth and Pro are the same product. Move up when the floor fills. Move down at the next billing date if you shrink. Enterprise is quoted, not self-serve." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
									value: "safe",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, { children: "Is my member data safe?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, { children: "Each gym is a tenant. Queries are scoped to your gym. Another owner cannot open your register. Staff see operations; they do not see your billing settings." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
									value: "app",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, { children: "Do my members need to install anything?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, { children: "No. The member app is a website that sits on a phone like an app. They can add it to the home screen. Check-in is a QR on your door." })]
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 max-w-sm text-sm text-text-muted",
						children: [
							FOUNDATION,
							", ",
							FOUNDATION_CITY,
							". Software for gyms that still know their members by name."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-4 text-sm text-text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/g/$slug",
								params: { slug: "shakti-fitness" },
								className: "hover:text-text",
								children: "Sample gym"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "hover:text-text",
								children: "Log in"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								search: { next: "/god" },
								className: "text-text-muted/70 hover:text-text-muted",
								children: "Admin"
							})
						]
					})]
				})
			})
		]
	});
}
var SplitComponent = MarketingHome;
//#endregion
export { SplitComponent as component };
