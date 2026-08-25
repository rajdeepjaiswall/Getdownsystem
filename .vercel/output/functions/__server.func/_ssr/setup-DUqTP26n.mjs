import { o as __toESM } from "../_runtime.mjs";
import { i as DEFAULT_MEMBERSHIP_PLANS, n as DEFAULT_AMENITIES, r as DEFAULT_EQUIPMENT } from "./constants-BVZriJ13.mjs";
import { t as cn } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Check } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { t as Field } from "./label-Xiqkwoxn.mjs";
import { n as Textarea, t as Input } from "./input-B_pmcD0t.mjs";
import { i as useSessionContext, t as RoleGate } from "./role-gate-C11Bwj7U.mjs";
import { A as upsertMember, D as seedDefaultPlans, S as saveFacility, T as saveTrainer, a as importMembers, f as listPlans, k as updateGym } from "./admin-DgaUrkMa.mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as fileToDataUrl } from "./file-to-data-url-BrDw548Y.mjs";
import { t as Wordmark } from "./brand-CroCFBDV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/setup-DUqTP26n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Checkbox({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
		className: cn("grid size-5 shrink-0 place-items-center rounded-sm border border-border bg-surface data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			className: "size-3.5",
			strokeWidth: 3
		}) })
	});
}
function Setup() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGate, {
		allow: ["gym_owner", "super_admin"],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wizard, {})
	});
}
function Wizard() {
	const { ctx } = useSessionContext();
	const qc = useQueryClient();
	const [step, setStep] = (0, import_react.useState)(0);
	const gym = ctx?.gym;
	if (!gym) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/signup" });
	const steps = [
		"Identity",
		"Plans",
		"Facilities",
		"Trainers",
		"Members",
		"Story",
		"Live"
	];
	async function persistGym(patch) {
		await updateGym({ data: patch });
		await qc.invalidateQueries({ queryKey: ["me"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-14 max-w-2xl items-center justify-between px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { to: "/admin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm text-text-muted",
					onClick: async () => {
						await persistGym({ onboarding_completed: true });
						window.location.href = "/admin";
					},
					children: "Skip"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "label-caps",
					children: [
						"Step ",
						step + 1,
						" of ",
						steps.length
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex gap-1",
					children: steps.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}` }, i))
				}),
				step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Identity, {
					gym,
					onNext: () => setStep(1),
					persist: persistGym
				}) : null,
				step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlansStep, {
					onNext: () => setStep(2),
					onBack: () => setStep(0)
				}) : null,
				step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FacilitiesStep, {
					onNext: () => setStep(3),
					onBack: () => setStep(1)
				}) : null,
				step === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainersStep, {
					onNext: () => setStep(4),
					onBack: () => setStep(2)
				}) : null,
				step === 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MembersStep, {
					slug: gym.slug,
					onNext: () => setStep(5),
					onBack: () => setStep(3)
				}) : null,
				step === 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryStep, {
					onNext: () => setStep(6),
					onBack: () => setStep(4),
					persist: persistGym
				}) : null,
				step === 6 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Done, {
					slug: gym.slug,
					persist: persistGym
				}) : null
			]
		})]
	});
}
function Identity({ gym, onNext, persist }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mt-8 grid gap-3",
		onSubmit: async (e) => {
			e.preventDefault();
			const fd = new FormData(e.currentTarget);
			const logo = fd.get("logo");
			const cover = fd.get("cover");
			await persist({
				name: String(fd.get("name") || ""),
				city: String(fd.get("city") || ""),
				address: String(fd.get("address") || ""),
				phone: String(fd.get("phone") || ""),
				brand_color: String(fd.get("brand_color") || "#5B8C51"),
				opening_hours: {
					mon: String(fd.get("hours") || "6:00–22:00"),
					tue: String(fd.get("hours") || "6:00–22:00"),
					wed: String(fd.get("hours") || "6:00–22:00"),
					thu: String(fd.get("hours") || "6:00–22:00"),
					fri: String(fd.get("hours") || "6:00–22:00"),
					sat: String(fd.get("hours") || "6:00–21:00"),
					sun: String(fd.get("sun") || "7:00–13:00")
				},
				logo_url: logo && logo.size ? await fileToDataUrl(logo) : void 0,
				cover_image_url: cover && cover.size ? await fileToDataUrl(cover) : void 0
			});
			onNext();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Gym identity"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-text-muted",
				children: "Saved as you go. Close the tab; come back."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Gym name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					name: "name",
					defaultValue: gym.name,
					required: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "City",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "city",
						defaultValue: gym.city ?? ""
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Phone",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "phone",
						defaultValue: gym.phone ?? ""
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Address",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					name: "address",
					defaultValue: gym.address ?? ""
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Weekday hours",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					name: "hours",
					defaultValue: "6:00–22:00"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Brand colour",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					name: "brand_color",
					type: "color",
					defaultValue: gym.brand_color ?? "#5B8C51",
					className: "h-11 w-20 p-1"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Logo",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					name: "logo",
					type: "file",
					accept: "image/*"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Cover photo",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					name: "cover",
					type: "file",
					accept: "image/*"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				children: "Continue"
			})
		]
	});
}
function PlansStep({ onNext, onBack }) {
	const plans = useQuery({
		queryKey: ["plans"],
		queryFn: () => listPlans()
	});
	const [rows, setRows] = (0, import_react.useState)(DEFAULT_MEMBERSHIP_PLANS);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Your plans"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-text-muted",
				children: "Three typical Indian gym plans. Edit, don’t start from zero."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-3",
				children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "grid gap-2 p-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: r.name,
							onChange: (e) => setRows((x) => x.map((y, j) => j === i ? {
								...y,
								name: e.target.value
							} : y))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: r.durationDays,
							onChange: (e) => setRows((x) => x.map((y, j) => j === i ? {
								...y,
								durationDays: Number(e.target.value)
							} : y))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: r.price,
							onChange: (e) => setRows((x) => x.map((y, j) => j === i ? {
								...y,
								price: Number(e.target.value)
							} : y))
						})
					]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onBack,
					children: "Back"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: async () => {
						if (!plans.data?.length) await seedDefaultPlans({ data: { plans: rows.map((r) => ({
							name: r.name,
							duration_days: r.durationDays,
							price: r.price
						})) } });
						onNext();
					},
					children: "Continue"
				})]
			})
		]
	});
}
function FacilitiesStep({ onNext, onBack }) {
	const [am, setAm] = (0, import_react.useState)([
		"Air conditioning",
		"Lockers",
		"Drinking water"
	]);
	const [eq, setEq] = (0, import_react.useState)([
		"Dumbbells",
		"Treadmills",
		"Squat rack"
	]);
	const [extra, setExtra] = (0, import_react.useState)("");
	function toggle(list, set, name) {
		set(list.includes(name) ? list.filter((x) => x !== name) : [...list, name]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Facilities"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-text-muted",
				children: "Tick what you have. Each tick becomes a row you can photograph later. This list is what members see."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "label-caps mt-6",
				children: "Amenities"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid gap-2 sm:grid-cols-2",
				children: DEFAULT_AMENITIES.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						checked: am.includes(a.name),
						onCheckedChange: () => toggle(am, setAm, a.name)
					}), a.name]
				}, a.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "label-caps mt-6",
				children: "Equipment"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid gap-2 sm:grid-cols-2",
				children: DEFAULT_EQUIPMENT.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						checked: eq.includes(a.name),
						onCheckedChange: () => toggle(eq, setEq, a.name)
					}), a.name]
				}, a.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Anything missing?",
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: extra,
					onChange: (e) => setExtra(e.target.value),
					placeholder: "Steam, combat class…"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onBack,
					children: "Back"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: async () => {
						for (const name of am) await saveFacility({ data: {
							kind: "amenities",
							name
						} });
						for (const name of eq) await saveFacility({ data: {
							kind: "equipment",
							name
						} });
						if (extra.trim()) await saveFacility({ data: {
							kind: "amenities",
							name: extra.trim()
						} });
						onNext();
					},
					children: "Continue"
				})]
			})
		]
	});
}
function TrainersStep({ onNext, onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Trainers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-text-muted",
				children: "Skippable. Add a face if you have one."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 grid gap-3",
				onSubmit: async (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					const name = String(fd.get("name") || "").trim();
					if (name) {
						const photo = fd.get("photo");
						await saveTrainer({ data: {
							name,
							speciality: String(fd.get("speciality") || ""),
							photo_url: photo && photo.size ? await fileToDataUrl(photo) : void 0
						} });
					}
					onNext();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { name: "name" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Speciality",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "speciality",
							placeholder: "Strength, weight loss…"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Photo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "photo",
							type: "file",
							accept: "image/*"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: onBack,
							children: "Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Continue"
						})]
					})
				]
			})
		]
	});
}
function MembersStep({ slug, onNext, onBack }) {
	const join = typeof window !== "undefined" ? `${window.location.origin}/g/${slug}/join` : `/g/${slug}/join`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Your members"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-text-muted",
				children: "Three ways in. The third is how a 200-name register actually finishes."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-6 border-primary p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-caps",
						children: "Most useful"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-medium",
						children: "Share a signup link or QR"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-text-muted",
						children: "Member fills details on their phone. You approve from Signups."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 break-all font-mono text-xs",
						children: join
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						alt: "QR",
						className: "mt-3 h-36 w-36",
						src: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(join)}`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-3 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "Type one in"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-3 grid gap-2 sm:grid-cols-[1fr_8rem_auto]",
					onSubmit: async (e) => {
						e.preventDefault();
						const fd = new FormData(e.currentTarget);
						try {
							await upsertMember({ data: {
								full_name: String(fd.get("full_name") || ""),
								phone: String(fd.get("phone") || "")
							} });
							toast.success("Added");
							e.currentTarget.reset();
						} catch (err) {
							toast.error(err instanceof Error ? err.message : "Could not add");
						}
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "full_name",
							required: true,
							placeholder: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "phone",
							placeholder: "Phone"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "sm",
							children: "Add"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-3 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "Bulk upload CSV"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-text-muted",
						children: "Columns: full_name, phone, email. Preview before commit."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "mt-3 text-sm",
						type: "file",
						accept: ".csv,text/csv",
						onChange: async (e) => {
							const file = e.target.files?.[0];
							if (!file) return;
							const lines = (await file.text()).split(/\r?\n/).filter(Boolean);
							const header = lines[0]?.split(",").map((h) => h.trim().toLowerCase()) ?? [];
							const ni = header.findIndex((h) => h.includes("name"));
							const pi = header.findIndex((h) => h.includes("phone"));
							const ei = header.findIndex((h) => h.includes("email"));
							const rows = lines.slice(1).map((line) => {
								const c = line.split(",");
								return {
									full_name: (c[ni] ?? c[0] ?? "").trim(),
									phone: (pi >= 0 ? c[pi] : "").trim(),
									email: (ei >= 0 ? c[ei] : "").trim()
								};
							});
							const preview = rows.slice(0, 8).map((r) => r.full_name).join(", ");
							if (!confirm(`Import ${rows.length} rows? First names: ${preview}`)) return;
							const res = await importMembers({ data: { rows } });
							toast.success(`Imported ${res.imported}. Skipped ${res.skipped.length}.`);
						}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onBack,
					children: "Back"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: onNext,
					children: "Continue"
				})]
			})
		]
	});
}
function StoryStep({ onNext, onBack, persist }) {
	const [year, setYear] = (0, import_react.useState)("2018");
	const [proud, setProud] = (0, import_react.useState)("We still know every member by name.");
	const [who, setWho] = (0, import_react.useState)("Neighbourhood people who want to train seriously without a chain-gym price.");
	const [about, setAbout] = (0, import_react.useState)("Neighbourhood people who want to train seriously without a chain-gym price. We opened in 2018. We still know every member by name.");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Your story"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-text-muted",
				children: "Three short answers. We draft the about text. You can rewrite it."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "What year did you start?",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: year,
							onChange: (e) => setYear(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "What are you proudest of?",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: proud,
							onChange: (e) => setProud(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Who is this gym for?",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: who,
							onChange: (e) => setWho(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						onClick: () => setAbout(`${who} We opened in ${year}. ${proud}`),
						children: "Draft about us"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "About us",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: about,
							onChange: (e) => setAbout(e.target.value)
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onBack,
					children: "Back"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: async () => {
						await persist({
							about_text: about,
							established_year: Number(year) || null
						});
						onNext();
					},
					children: "Continue"
				})]
			})
		]
	});
}
function Done({ slug, persist }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "You’re live"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-text-muted",
				children: "Identity, plans, facilities, and story are on your public page. Members can join from a link. The desk is at the admin home."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/g/$slug",
						params: { slug },
						children: "Open public page"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: async () => {
						await persist({ onboarding_completed: true });
						window.location.href = "/admin";
					},
					children: "Go to the desk"
				})]
			})
		]
	});
}
//#endregion
export { Setup as component };
