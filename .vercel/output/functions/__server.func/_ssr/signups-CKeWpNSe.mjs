import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-BnjvlsCL.mjs";
import { t as Card } from "./card-CPmJxf_b.mjs";
import { i as useSessionContext } from "./role-gate-C11Bwj7U.mjs";
import { t as Badge } from "./badge-EeB0puxv.mjs";
import { n as PageHeader } from "./shell-Cs5SOKqP.mjs";
import { d as listMembers, f as listPlans, t as approveMember, y as rejectMember } from "./admin-DgaUrkMa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signups-CKeWpNSe.js
var import_jsx_runtime = require_jsx_runtime();
function Signups() {
	const qc = useQueryClient();
	const { ctx } = useSessionContext();
	const members = useQuery({
		queryKey: ["members", "pending"],
		queryFn: () => listMembers({ data: { status: "pending" } })
	});
	const plans = useQuery({
		queryKey: ["plans"],
		queryFn: () => listPlans()
	});
	const approve = useMutation({
		mutationFn: approveMember,
		onSuccess: () => {
			toast.success("Approved");
			qc.invalidateQueries();
		},
		onError: (e) => toast.error(e.message)
	});
	const reject = useMutation({
		mutationFn: rejectMember,
		onSuccess: () => {
			toast.success("Removed");
			qc.invalidateQueries();
		}
	});
	const joinUrl = typeof window !== "undefined" && ctx?.gym ? `${window.location.origin}/g/${ctx.gym.slug}/join` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Signups",
			hint: "People who filled the phone form. Approve to make them a member — this counts against your cap."
		}),
		joinUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-4 p-4 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-caps",
					children: "Share this link or QR"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 break-all font-mono text-xs",
					children: joinUrl
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					alt: "Signup QR",
					className: "mt-3 h-36 w-36",
					src: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(joinUrl)}`
				})
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [(members.data ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex flex-wrap items-center justify-between gap-3 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: String(m.full_name)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-text-muted",
					children: [
						String(m.phone ?? ""),
						" ",
						m.email ? `· ${String(m.email)}` : ""
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "warn",
							children: "pending"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-11 rounded-md border border-border bg-surface px-3 text-sm",
							defaultValue: plans.data?.[0]?.id ?? "",
							id: `plan-${String(m.id)}`,
							children: (plans.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p.id,
								children: p.name
							}, p.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => {
								const sel = document.getElementById(`plan-${String(m.id)}`);
								approve.mutate({ data: {
									id: String(m.id),
									plan_id: sel?.value
								} });
							},
							children: "Approve"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => reject.mutate({ data: { id: String(m.id) } }),
							children: "Reject"
						})
					]
				})]
			}, String(m.id))), members.data?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-text-muted",
				children: "No pending signups. Share the link above — it is how a 200-name register actually gets in."
			}) : null]
		})
	] });
}
//#endregion
export { Signups as component };
