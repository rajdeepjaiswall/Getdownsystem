import { o as __toESM } from "../_runtime.mjs";
import { t as APP_NAME } from "./constants-BVZriJ13.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { _ as createRootRoute, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as __exportAll } from "./ssr.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { n as auth } from "./server-BjOVmHFq.mjs";
import { s as TriangleAlert } from "../_libs/lucide-react.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Bmb4eFiN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function AppProviders({ children }) {
	const [client] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		staleTime: 2e4,
		refetchOnWindowFocus: false,
		retry: 1
	} } }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			position: "top-center",
			toastOptions: {
				className: "font-sans",
				style: {
					background: "#FFFFFF",
					color: "#1E241C",
					border: "1px solid #E8EDE6",
					borderRadius: 14
				}
			}
		})]
	});
}
var styles_default = "/assets/styles-mV79-5pJ.css";
var Route$42 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Gym management software for owners still running on a paper register. Members, renewals, check-ins and staff — branded as your gym."
			},
			{
				name: "theme-color",
				content: "#5B8C51"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "min-h-dvh bg-bg text-text font-sans",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppProviders, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$40 = () => import("./routes-CRY6shxE.mjs");
var Route$41 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$40, "component") });
var $$splitComponentImporter$39 = () => import("./route-D1osTSmT.mjs");
var Route$40 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$39, "component") });
var $$splitComponentImporter$38 = () => import("./route-h2qmtp91.mjs");
var Route$39 = createFileRoute("/app")({ component: lazyRouteComponent($$splitComponentImporter$38, "component") });
var $$splitComponentImporter$37 = () => import("./contact-Cna0Oteb.mjs");
var Route$38 = createFileRoute("/contact")({ component: lazyRouteComponent($$splitComponentImporter$37, "component") });
var $$splitComponentImporter$36 = () => import("./forgot-password-B1YZ_RNE.mjs");
var Route$37 = createFileRoute("/forgot-password")({ component: lazyRouteComponent($$splitComponentImporter$36, "component") });
var $$splitComponentImporter$35 = () => import("./go-Df2iOkU9.mjs");
var Route$36 = createFileRoute("/go")({ component: lazyRouteComponent($$splitComponentImporter$35, "component") });
var $$splitComponentImporter$34 = () => import("./route-Cua9wJMo.mjs");
var Route$35 = createFileRoute("/god")({ component: lazyRouteComponent($$splitComponentImporter$34, "component") });
var $$splitComponentImporter$33 = () => import("./login-D47VIyzt.mjs");
var Route$34 = createFileRoute("/login")({
	validateSearch: (s) => ({ next: typeof s.next === "string" ? s.next : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$33, "component")
});
var $$splitComponentImporter$32 = () => import("./signup-JO9yO9Yg.mjs");
var Route$33 = createFileRoute("/signup")({
	validateSearch: (s) => ({ plan: typeof s.plan === "string" ? s.plan : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
var $$splitComponentImporter$31 = () => import("./route-_WGALd7I.mjs");
var Route$32 = createFileRoute("/trainer")({ component: lazyRouteComponent($$splitComponentImporter$31, "component") });
var $$splitComponentImporter$30 = () => import("./admin-T-qWdSc6.mjs");
var Route$31 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$30, "component") });
var $$splitComponentImporter$29 = () => import("./amenities-DCth-MzQ.mjs");
var Route$30 = createFileRoute("/admin/amenities")({ component: lazyRouteComponent($$splitComponentImporter$29, "component") });
var $$splitComponentImporter$28 = () => import("./checkins-Bd_CzBZx.mjs");
var Route$29 = createFileRoute("/admin/checkins")({ component: lazyRouteComponent($$splitComponentImporter$28, "component") });
var $$splitComponentImporter$27 = () => import("./enquiries-CwFdruMA.mjs");
var Route$28 = createFileRoute("/admin/enquiries")({ component: lazyRouteComponent($$splitComponentImporter$27, "component") });
var $$splitComponentImporter$26 = () => import("./equipment-ChF2vHsl.mjs");
var Route$27 = createFileRoute("/admin/equipment")({ component: lazyRouteComponent($$splitComponentImporter$26, "component") });
var $$splitComponentImporter$25 = () => import("./members-D7ZeTsQ_.mjs");
var Route$26 = createFileRoute("/admin/members")({ component: lazyRouteComponent($$splitComponentImporter$25, "component") });
var $$splitComponentImporter$24 = () => import("./plans-76lvWWKZ.mjs");
var Route$25 = createFileRoute("/admin/plans")({ component: lazyRouteComponent($$splitComponentImporter$24, "component") });
var $$splitComponentImporter$23 = () => import("./profile-BEXPgdnM.mjs");
var Route$24 = createFileRoute("/admin/profile")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./red-list-C1aUSaU0.mjs");
var Route$23 = createFileRoute("/admin/red-list")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./renewals-CbMZ28mY.mjs");
var Route$22 = createFileRoute("/admin/renewals")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./settings-pnRUwpGn.mjs");
var Route$21 = createFileRoute("/admin/settings")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./signups-CKeWpNSe.mjs");
var Route$20 = createFileRoute("/admin/signups")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./testimonials-BbOPc9r3.mjs");
var Route$19 = createFileRoute("/admin/testimonials")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./trainers-CPiruAqX.mjs");
var Route$18 = createFileRoute("/admin/trainers")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./transformations-AEJ8ASxr.mjs");
var Route$17 = createFileRoute("/admin/transformations")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./app-CzmgWCk-.mjs");
var Route$16 = createFileRoute("/app/")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./checkin-DM86ggX5.mjs");
var Route$15 = createFileRoute("/app/checkin")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./plan-Dohth0nv.mjs");
var Route$14 = createFileRoute("/app/plan")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./profile-C7N-RN2X.mjs");
var Route$13 = createFileRoute("/app/profile")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./progress-BCMaDoe3.mjs");
var Route$12 = createFileRoute("/app/progress")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("../_slug-D38R9IDe.mjs");
var Route$11 = createFileRoute("/g/$slug")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./god-C6NEkI1q.mjs");
var Route$10 = createFileRoute("/god/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./gyms-xQPYyfEz.mjs");
var Route$9 = createFileRoute("/god/gyms")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./leads-GMhB8uDE.mjs");
var Route$8 = createFileRoute("/god/leads")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./payments-gTIq7T-y.mjs");
var Route$7 = createFileRoute("/god/payments")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./settings-CVQUB4GA.mjs");
var Route$6 = createFileRoute("/god/settings")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./setup-DUqTP26n.mjs");
var Route$5 = createFileRoute("/setup/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./trainer-DDItjUu8.mjs");
var Route$4 = createFileRoute("/trainer/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var Route$3 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var $$splitComponentImporter$2 = () => import("../_slug.join-BcZkXba3.mjs");
var Route$2 = createFileRoute("/g/$slug/join")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./gyms._id-DeuLGfu8.mjs");
var Route$1 = createFileRoute("/god/gyms/$id")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./clients._id-GrRSIaDM.mjs");
var Route = createFileRoute("/trainer/clients/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$41.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$42
});
var AdminRouteRoute = Route$40.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$42
});
var AppRouteRoute = Route$39.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => Route$42
});
var ContactRoute = Route$38.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$42
});
var ForgotPasswordRoute = Route$37.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$42
});
var GoRoute = Route$36.update({
	id: "/go",
	path: "/go",
	getParentRoute: () => Route$42
});
var GodRouteRoute = Route$35.update({
	id: "/god",
	path: "/god",
	getParentRoute: () => Route$42
});
var LoginRoute = Route$34.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$42
});
var SignupRoute = Route$33.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$42
});
var TrainerRouteRoute = Route$32.update({
	id: "/trainer",
	path: "/trainer",
	getParentRoute: () => Route$42
});
var AdminIndexRoute = Route$31.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRouteRoute
});
var AdminAmenitiesRoute = Route$30.update({
	id: "/amenities",
	path: "/amenities",
	getParentRoute: () => AdminRouteRoute
});
var AdminCheckinsRoute = Route$29.update({
	id: "/checkins",
	path: "/checkins",
	getParentRoute: () => AdminRouteRoute
});
var AdminEnquiriesRoute = Route$28.update({
	id: "/enquiries",
	path: "/enquiries",
	getParentRoute: () => AdminRouteRoute
});
var AdminEquipmentRoute = Route$27.update({
	id: "/equipment",
	path: "/equipment",
	getParentRoute: () => AdminRouteRoute
});
var AdminMembersRoute = Route$26.update({
	id: "/members",
	path: "/members",
	getParentRoute: () => AdminRouteRoute
});
var AdminPlansRoute = Route$25.update({
	id: "/plans",
	path: "/plans",
	getParentRoute: () => AdminRouteRoute
});
var AdminProfileRoute = Route$24.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AdminRouteRoute
});
var AdminRedListRoute = Route$23.update({
	id: "/red-list",
	path: "/red-list",
	getParentRoute: () => AdminRouteRoute
});
var AdminRenewalsRoute = Route$22.update({
	id: "/renewals",
	path: "/renewals",
	getParentRoute: () => AdminRouteRoute
});
var AdminSettingsRoute = Route$21.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRouteRoute
});
var AdminSignupsRoute = Route$20.update({
	id: "/signups",
	path: "/signups",
	getParentRoute: () => AdminRouteRoute
});
var AdminTestimonialsRoute = Route$19.update({
	id: "/testimonials",
	path: "/testimonials",
	getParentRoute: () => AdminRouteRoute
});
var AdminTrainersRoute = Route$18.update({
	id: "/trainers",
	path: "/trainers",
	getParentRoute: () => AdminRouteRoute
});
var AdminTransformationsRoute = Route$17.update({
	id: "/transformations",
	path: "/transformations",
	getParentRoute: () => AdminRouteRoute
});
var AppIndexRoute = Route$16.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRouteRoute
});
var AppCheckinRoute = Route$15.update({
	id: "/checkin",
	path: "/checkin",
	getParentRoute: () => AppRouteRoute
});
var AppPlanRoute = Route$14.update({
	id: "/plan",
	path: "/plan",
	getParentRoute: () => AppRouteRoute
});
var AppProfileRoute = Route$13.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AppRouteRoute
});
var AppProgressRoute = Route$12.update({
	id: "/progress",
	path: "/progress",
	getParentRoute: () => AppRouteRoute
});
var GSlugRoute = Route$11.update({
	id: "/g/$slug",
	path: "/g/$slug",
	getParentRoute: () => Route$42
});
var GodIndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => GodRouteRoute
});
var GodGymsRoute = Route$9.update({
	id: "/gyms",
	path: "/gyms",
	getParentRoute: () => GodRouteRoute
});
var GodLeadsRoute = Route$8.update({
	id: "/leads",
	path: "/leads",
	getParentRoute: () => GodRouteRoute
});
var GodPaymentsRoute = Route$7.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => GodRouteRoute
});
var GodSettingsRoute = Route$6.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => GodRouteRoute
});
var SetupIndexRoute = Route$5.update({
	id: "/setup/",
	path: "/setup/",
	getParentRoute: () => Route$42
});
var TrainerIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => TrainerRouteRoute
});
var ApiAuthSplatRoute = Route$3.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$42
});
var GSlugJoinRoute = Route$2.update({
	id: "/join",
	path: "/join",
	getParentRoute: () => GSlugRoute
});
var GodGymsIdRoute = Route$1.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => GodGymsRoute
});
var TrainerClientsIdRoute = Route.update({
	id: "/clients/$id",
	path: "/clients/$id",
	getParentRoute: () => TrainerRouteRoute
});
var AdminRouteRouteChildren = {
	AdminAmenitiesRoute,
	AdminCheckinsRoute,
	AdminEnquiriesRoute,
	AdminEquipmentRoute,
	AdminMembersRoute,
	AdminPlansRoute,
	AdminProfileRoute,
	AdminRedListRoute,
	AdminRenewalsRoute,
	AdminSettingsRoute,
	AdminSignupsRoute,
	AdminTestimonialsRoute,
	AdminTrainersRoute,
	AdminTransformationsRoute,
	AdminIndexRoute
};
var AdminRouteRouteWithChildren = AdminRouteRoute._addFileChildren(AdminRouteRouteChildren);
var AppRouteRouteChildren = {
	AppCheckinRoute,
	AppPlanRoute,
	AppProfileRoute,
	AppProgressRoute,
	AppIndexRoute
};
var AppRouteRouteWithChildren = AppRouteRoute._addFileChildren(AppRouteRouteChildren);
var GodGymsRouteChildren = { GodGymsIdRoute };
var GodRouteRouteChildren = {
	GodGymsRoute: GodGymsRoute._addFileChildren(GodGymsRouteChildren),
	GodLeadsRoute,
	GodPaymentsRoute,
	GodSettingsRoute,
	GodIndexRoute
};
var GodRouteRouteWithChildren = GodRouteRoute._addFileChildren(GodRouteRouteChildren);
var TrainerRouteRouteChildren = {
	TrainerIndexRoute,
	TrainerClientsIdRoute
};
var TrainerRouteRouteWithChildren = TrainerRouteRoute._addFileChildren(TrainerRouteRouteChildren);
var GSlugRouteChildren = { GSlugJoinRoute };
var rootRouteChildren = {
	IndexRoute,
	AdminRouteRoute: AdminRouteRouteWithChildren,
	AppRouteRoute: AppRouteRouteWithChildren,
	GodRouteRoute: GodRouteRouteWithChildren,
	TrainerRouteRoute: TrainerRouteRouteWithChildren,
	ContactRoute,
	ForgotPasswordRoute,
	GoRoute,
	LoginRoute,
	SignupRoute,
	GSlugRoute: GSlugRoute._addFileChildren(GSlugRouteChildren),
	SetupIndexRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$42._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Route$11 as a, Route$2 as i, Route as n, Route$33 as o, Route$1 as r, Route$34 as s, router_exports as t };
