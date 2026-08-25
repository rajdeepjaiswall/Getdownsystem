import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Field } from "./label-Xiqkwoxn.mjs";
import { n as Textarea, t as Input } from "./input-B_pmcD0t.mjs";
import { i as useSessionContext } from "./role-gate-C11Bwj7U.mjs";
import { n as PageHeader } from "./shell-Cs5SOKqP.mjs";
import { k as updateGym } from "./admin-DgaUrkMa.mjs";
import { t as fileToDataUrl } from "./file-to-data-url-BrDw548Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-BEXPgdnM.js
var import_jsx_runtime = require_jsx_runtime();
function Profile() {
	const { ctx } = useSessionContext();
	const qc = useQueryClient();
	const gym = ctx?.gym;
	const mut = useMutation({
		mutationFn: updateGym,
		onSuccess: () => {
			toast.success("Saved");
			qc.invalidateQueries({ queryKey: ["me"] });
		}
	});
	if (!gym) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Gym profile",
		hint: "This is what the public page and the member app read.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "outline",
			size: "sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/g/$slug",
				params: { slug: gym.slug },
				children: "View page"
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid max-w-xl gap-3",
		onSubmit: async (e) => {
			e.preventDefault();
			const fd = new FormData(e.currentTarget);
			const logo = fd.get("logo");
			const cover = fd.get("cover");
			mut.mutate({ data: {
				name: String(fd.get("name") || ""),
				city: String(fd.get("city") || ""),
				address: String(fd.get("address") || ""),
				phone: String(fd.get("phone") || ""),
				about_text: String(fd.get("about_text") || ""),
				brand_color: String(fd.get("brand_color") || "#5B8C51"),
				logo_url: logo && logo.size ? await fileToDataUrl(logo) : void 0,
				cover_image_url: cover && cover.size ? await fileToDataUrl(cover) : void 0
			} });
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					name: "name",
					defaultValue: gym.name
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "City",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					name: "city",
					defaultValue: gym.city ?? ""
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Address",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					name: "address",
					defaultValue: gym.address ?? ""
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Phone",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					name: "phone",
					defaultValue: gym.phone ?? ""
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "About",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					name: "about_text",
					defaultValue: gym.about_text ?? ""
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
				disabled: mut.isPending,
				children: "Save"
			})
		]
	})] });
}
//#endregion
export { Profile as component };
