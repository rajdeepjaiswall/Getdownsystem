import { o as __toESM } from "./_runtime.mjs";
import { t as APP_NAME } from "./_ssr/constants-BVZriJ13.mjs";
import { r as inr } from "./_ssr/utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime, v as require_react } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { h as Phone, v as MapPin, w as Clock } from "./_libs/lucide-react.mjs";
import { n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { a as Route$11 } from "./_ssr/router-Bmb4eFiN.mjs";
import { t as Button } from "./_ssr/button-BnjvlsCL.mjs";
import { t as Card } from "./_ssr/card-CPmJxf_b.mjs";
import { t as Field } from "./_ssr/label-Xiqkwoxn.mjs";
import { n as Textarea, t as Input } from "./_ssr/input-B_pmcD0t.mjs";
import { r as submitEnquiry, t as getPublicGym } from "./_ssr/public-w3IgwuSE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-D38R9IDe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GymPage() {
	const { slug } = Route$11.useParams();
	const q = useQuery({
		queryKey: ["public-gym", slug],
		queryFn: () => getPublicGym({ data: slug })
	});
	const [sent, setSent] = (0, import_react.useState)(false);
	const mut = useMutation({
		mutationFn: submitEnquiry,
		onSuccess: () => {
			setSent(true);
			toast.success("Enquiry sent. They will call you.");
		}
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-bg p-8 text-text-muted",
		children: "Loading gym…"
	});
	if (!q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-bg px-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "No gym at this address"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: "Getdown Fitness"
			})
		})] })
	});
	const { gym, plans, amenities, equipment, trainers, testimonials, transformations } = q.data;
	const color = gym.brand_color || "#5B8C51";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 min-w-0",
						children: [gym.logo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: gym.logo_url,
							alt: "",
							className: "h-9 w-9 rounded-md object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-md text-white",
							style: { background: color },
							children: gym.name[0]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate font-display text-lg",
							children: gym.name
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#enquire",
						className: "text-sm font-medium",
						style: { color },
						children: "Join"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-56 w-full sm:h-80",
				children: [
					gym.cover_image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: gym.cover_image_url,
						alt: "",
						className: "size-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "size-full",
						style: { background: color }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-text/50 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute bottom-4 left-0 right-0 mx-auto max-w-5xl px-4 text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl",
							children: gym.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm opacity-90",
							children: [gym.city, gym.established_year ? `Est. ${gym.established_year}` : null].filter(Boolean).join(" · ")
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-5xl space-y-14 px-4 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-6 lg:grid-cols-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-text-muted lg:col-span-2",
							children: gym.about_text
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "space-y-3 p-5 text-sm",
							children: [
								gym.address ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-4 text-primary" }),
										" ",
										gym.address
									]
								}) : null,
								gym.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "mt-0.5 size-4 text-primary" }),
										" ",
										gym.phone
									]
								}) : null,
								gym.opening_hours ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mt-0.5 size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: Object.entries(gym.opening_hours).map(([d, h]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "capitalize",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "inline-block w-10 text-text-muted",
												children: d
											}),
											" ",
											h
										]
									}, d)) })]
								}) : null
							]
						})]
					}),
					plans.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Memberships"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-3 sm:grid-cols-3",
						children: plans.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-display text-3xl tabular-nums",
									style: { color },
									children: inr(p.price)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-text-muted",
									children: [p.duration_days, " days"]
								})
							]
						}, p.id))
					})] }) : null,
					amenities.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Amenities"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: amenities.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "overflow-hidden",
							children: [a.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: a.image_url,
								alt: "",
								className: "h-36 w-full object-cover"
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: a.name
								}), a.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-text-muted",
									children: a.description
								}) : null]
							})]
						}, a.id))
					})] }) : null,
					equipment.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Equipment"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: equipment.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "overflow-hidden",
							children: [a.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: a.image_url,
								alt: "",
								className: "h-36 w-full object-cover"
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: a.name
								}), a.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-text-muted",
									children: a.description
								}) : null]
							})]
						}, a.id))
					})] }) : null,
					trainers.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Trainers"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-4 sm:grid-cols-2",
						children: trainers.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "flex gap-4 p-4",
							children: [t.photo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: t.photo_url,
								alt: "",
								className: "h-24 w-20 rounded-md object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-24 w-20 place-items-center rounded-md bg-primary-tint font-display text-2xl",
								children: t.name[0]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: t.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm",
									style: { color },
									children: t.speciality
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-text-muted",
									children: t.bio
								})
							] })]
						}, t.id))
					})] }) : null,
					transformations.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Transformations"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-4 sm:grid-cols-2",
						children: transformations.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "overflow-hidden",
							children: [t.after_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: t.after_url,
								alt: "",
								className: "h-56 w-full object-cover"
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: t.member_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-text-muted",
									children: t.story
								})]
							})]
						}, t.id))
					})] }) : null,
					testimonials.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "grid gap-3 sm:grid-cols-2",
						children: testimonials.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
							className: "rounded-lg border border-border bg-surface p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-text",
								children: [
									"“",
									t.quote,
									"”"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
								className: "mt-3 text-sm text-text-muted",
								children: ["— ", t.member_name]
							})]
						}, t.id))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						id: "enquire",
						className: "scroll-mt-20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: "Enquire"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-text-muted",
								children: [
									"Fill this and it lands on ",
									gym.name,
									"’s desk — not a shared inbox."
								]
							}),
							sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 font-medium",
								children: "Sent. They have your number."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mt-4 grid max-w-lg gap-3",
								onSubmit: (e) => {
									e.preventDefault();
									const fd = new FormData(e.currentTarget);
									mut.mutate({ data: {
										slug,
										name: String(fd.get("name") || ""),
										phone: String(fd.get("phone") || ""),
										message: String(fd.get("message") || "")
									} });
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Your name",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											name: "name",
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
										label: "Message",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											name: "message",
											placeholder: "Looking for a morning batch…"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										style: { background: color },
										disabled: mut.isPending,
										children: "Send enquiry"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/g/$slug/join",
									params: { slug },
									className: "text-sm font-medium",
									style: { color },
									children: "Already decided? Fill your own membership form →"
								})
							})
						]
					})
				]
			}),
			gym.show_powered_by ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "border-t border-border py-6 text-center text-xs text-text-muted",
				children: ["Powered by ", APP_NAME]
			}) : null
		]
	});
}
//#endregion
export { GymPage as component };
