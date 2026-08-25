import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { i as useSessionContext } from "./role-gate-C11Bwj7U.mjs";
import { s as memberCheckin } from "./member-htK_68s1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkin-DM86ggX5.js
var import_jsx_runtime = require_jsx_runtime();
function Checkin() {
	const { ctx } = useSessionContext();
	const qc = useQueryClient();
	const mut = useMutation({
		mutationFn: () => memberCheckin(),
		onSuccess: (r) => {
			toast.success(r.already ? "Already in for today" : "You’re in");
			qc.invalidateQueries({ queryKey: ["member-home"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center pt-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-40 place-items-center rounded-xl text-white",
				style: { background: ctx?.gym?.brand_color ?? "#5B8C51" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-6xl",
					children: "QR"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 font-display text-2xl",
				children: "At the gate?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xs text-sm text-text-muted",
				children: "Point this at the gym’s code, or tap below if you’re already inside. One check-in per day."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6 w-full max-w-xs",
				onClick: () => mut.mutate(),
				disabled: mut.isPending,
				children: mut.isPending ? "Saving…" : "I’m here — check in"
			})
		]
	});
}
//#endregion
export { Checkin as component };
