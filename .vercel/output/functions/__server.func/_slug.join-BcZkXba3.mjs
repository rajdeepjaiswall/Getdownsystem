import { o as __toESM } from "./_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { i as Route$2 } from "./_ssr/router-Bmb4eFiN.mjs";
import { t as Button } from "./_ssr/button-BnjvlsCL.mjs";
import { t as Field } from "./_ssr/label-Xiqkwoxn.mjs";
import { t as Input } from "./_ssr/input-B_pmcD0t.mjs";
import { n as publicSignup, t as getPublicGym } from "./_ssr/public-w3IgwuSE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug.join-BcZkXba3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Join() {
	const { slug } = Route$2.useParams();
	const q = useQuery({
		queryKey: ["public-gym", slug],
		queryFn: () => getPublicGym({ data: slug })
	});
	const [done, setDone] = (0, import_react.useState)(false);
	const mut = useMutation({
		mutationFn: publicSignup,
		onSuccess: () => setDone(true)
	});
	const gym = q.data?.gym;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md px-4 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-caps",
					children: gym?.name ?? "Gym"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-3xl",
					children: "Join on your phone"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-text-muted",
					children: "The owner approves you from the Signups screen. You do not get in until they say yes."
				}),
				done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 font-medium",
					children: "Submitted. Wait for a call or a WhatsApp from the desk."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-8 grid gap-3",
					onSubmit: (e) => {
						e.preventDefault();
						const fd = new FormData(e.currentTarget);
						mut.mutate({ data: {
							slug,
							full_name: String(fd.get("full_name") || ""),
							phone: String(fd.get("phone") || ""),
							email: String(fd.get("email") || ""),
							gender: String(fd.get("gender") || "")
						} });
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Full name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "full_name",
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
							label: "Email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "email",
								type: "email"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: mut.isPending,
							children: "Submit for approval"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/g/$slug",
						params: { slug },
						className: "text-primary",
						children: "Back to gym page"
					})
				})
			]
		})
	});
}
//#endregion
export { Join as component };
