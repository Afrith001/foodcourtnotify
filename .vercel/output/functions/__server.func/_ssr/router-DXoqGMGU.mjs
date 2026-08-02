import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as i18n_default } from "./i18n-BnUAatYi.mjs";
import { t as Route$26 } from "./auth-COFleP6j.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DXoqGMGU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DWOv03Fx.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$25 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
			},
			{ title: "FoodCourtNotify" },
			{
				name: "description",
				content: "FoodCourtNotify - Smart order management, customer engagement and notification platform for restaurants, food courts and cafes."
			},
			{
				name: "author",
				content: "FoodCourtNotify"
			},
			{
				property: "og:title",
				content: "FoodCourtNotify"
			},
			{
				property: "og:description",
				content: "Smart order management and customer engagement platform."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "FoodCourtNotify"
			},
			{
				name: "twitter:description",
				content: "Smart order management and customer engagement platform."
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			type: "image/x-icon",
			href: "/favicon.ico"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$25.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var Route$24 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const base = "";
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${["/", "/auth"].map((p) => `  <url><loc>${base}${p}</loc></url>`).join("\n")}\n</urlset>`;
	return new Response(xml, { headers: { "Content-Type": "application/xml" } });
} } } });
var $$splitComponentImporter$23 = () => import("./route-DUKJE0fk.mjs");
var Route$23 = createFileRoute("/_authenticated")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./routes-B-ORQONO.mjs");
var Route$22 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Nexavo POS — Smart Billing + Live Customer Order Tracking" },
		{
			name: "description",
			content: "Modern POS for restaurants and food courts with billing, product management, kitchen workflow, QR tracking and real-time customer updates."
		},
		{
			property: "og:title",
			content: "Nexavo POS"
		},
		{
			property: "og:description",
			content: "Smart billing and live order tracking for modern food businesses."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./order._shopCode-BIx1c-eu.mjs");
var Route$21 = createFileRoute("/order/$shopCode")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./tracking-BFUHdlGZ.mjs");
var Route$20 = createFileRoute("/_authenticated/tracking")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./subscription-Bh_9E_L6.mjs");
var Route$19 = createFileRoute("/_authenticated/subscription")({
	head: () => ({ meta: [{ title: `${i18n_default.t("common.subscription")} · ${i18n_default.t("common.appName")}` }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./staff-EZFcvDD7.mjs");
var Route$18 = createFileRoute("/_authenticated/staff")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./settings-C2R0qf2g.mjs");
var Route$17 = createFileRoute("/_authenticated/settings")({
	head: () => ({ meta: [{ title: `${i18n_default.t("common.settings")} · ${i18n_default.t("common.appName")}` }] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./restaurant-FIsHh1yb.mjs");
var Route$16 = createFileRoute("/_authenticated/restaurant")({
	head: () => ({ meta: [{ title: `Restaurant CMS · ${i18n_default.t("common.appName")}` }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./reports-CYJuE75o.mjs");
var Route$15 = createFileRoute("/_authenticated/reports")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./qr-DMZshdN6.mjs");
var Route$14 = createFileRoute("/_authenticated/qr")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./products---208Iel.mjs");
var Route$13 = createFileRoute("/_authenticated/products")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./orders-BpIGWso6.mjs");
var Route$12 = createFileRoute("/_authenticated/orders")({
	head: () => ({ meta: [{ title: `${i18n_default.t("common.orders")} · ${i18n_default.t("common.appName")}` }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./notifications-CkgRPEsS.mjs");
var Route$11 = createFileRoute("/_authenticated/notifications")({
	head: () => ({ meta: [{ title: `${i18n_default.t("common.notifications")} · ${i18n_default.t("common.appName")}` }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./kitchen-Ccjh5Pfz.mjs");
var Route$10 = createFileRoute("/_authenticated/kitchen")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./dashboard-D57V_OzL.mjs");
var Route$9 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: `${i18n_default.t("common.dashboard")} · ${i18n_default.t("common.appName")}` }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./customers-BjRRKwbX.mjs");
var Route$8 = createFileRoute("/_authenticated/customers")({
	head: () => ({ meta: [{ title: `${i18n_default.t("common.customers")} · ${i18n_default.t("common.appName")}` }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./coupons-C2ukmukO.mjs");
var Route$7 = createFileRoute("/_authenticated/coupons")({
	head: () => ({ meta: [{ title: `${i18n_default.t("common.coupons")} · ${i18n_default.t("common.appName")}` }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./coming-soon-qKlRj3-A.mjs");
var Route$6 = createFileRoute("/_authenticated/coming-soon")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./categories-DRjAiMyz.mjs");
var Route$5 = createFileRoute("/_authenticated/categories")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./campaigns-lPnXNQlC.mjs");
var Route$4 = createFileRoute("/_authenticated/campaigns")({
	head: () => ({ meta: [{ title: `${i18n_default.t("common.campaigns")} · ${i18n_default.t("common.appName")}` }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./business-oXTEKO6y.mjs");
var Route$3 = createFileRoute("/_authenticated/business")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./billing-6ZYOQIAc.mjs");
var Route$2 = createFileRoute("/_authenticated/billing")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./analytics-CpqU4cG9.mjs");
var Route$1 = createFileRoute("/_authenticated/analytics")({
	head: () => ({ meta: [{ title: `${i18n_default.t("common.analytics")} · ${i18n_default.t("common.appName")}` }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin-CjSvcL2e.mjs");
var Route = createFileRoute("/_authenticated/admin")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var SitemapDotxmlRoute = Route$24.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$25
});
var AuthRoute = Route$26.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$25
});
var AuthenticatedRouteRoute = Route$23.update({
	id: "/_authenticated",
	getParentRoute: () => Route$25
});
var IndexRoute = Route$22.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$25
});
var OrderShopCodeRoute = Route$21.update({
	id: "/order/$shopCode",
	path: "/order/$shopCode",
	getParentRoute: () => Route$25
});
var AuthenticatedTrackingRoute = Route$20.update({
	id: "/tracking",
	path: "/tracking",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSubscriptionRoute = Route$19.update({
	id: "/subscription",
	path: "/subscription",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedStaffRoute = Route$18.update({
	id: "/staff",
	path: "/staff",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSettingsRoute = Route$17.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRestaurantRoute = Route$16.update({
	id: "/restaurant",
	path: "/restaurant",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedReportsRoute = Route$15.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedQrRoute = Route$14.update({
	id: "/qr",
	path: "/qr",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedProductsRoute = Route$13.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedOrdersRoute = Route$12.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedNotificationsRoute = Route$11.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedKitchenRoute = Route$10.update({
	id: "/kitchen",
	path: "/kitchen",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$9.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCustomersRoute = Route$8.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCouponsRoute = Route$7.update({
	id: "/coupons",
	path: "/coupons",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedComingSoonRoute = Route$6.update({
	id: "/coming-soon",
	path: "/coming-soon",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCategoriesRoute = Route$5.update({
	id: "/categories",
	path: "/categories",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCampaignsRoute = Route$4.update({
	id: "/campaigns",
	path: "/campaigns",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedBusinessRoute = Route$3.update({
	id: "/business",
	path: "/business",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedBillingRoute = Route$2.update({
	id: "/billing",
	path: "/billing",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAnalyticsRoute = Route$1.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminRoute: Route.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedAnalyticsRoute,
	AuthenticatedBillingRoute,
	AuthenticatedBusinessRoute,
	AuthenticatedCampaignsRoute,
	AuthenticatedCategoriesRoute,
	AuthenticatedComingSoonRoute,
	AuthenticatedCouponsRoute,
	AuthenticatedCustomersRoute,
	AuthenticatedDashboardRoute,
	AuthenticatedKitchenRoute,
	AuthenticatedNotificationsRoute,
	AuthenticatedOrdersRoute,
	AuthenticatedProductsRoute,
	AuthenticatedQrRoute,
	AuthenticatedReportsRoute,
	AuthenticatedRestaurantRoute,
	AuthenticatedSettingsRoute,
	AuthenticatedStaffRoute,
	AuthenticatedSubscriptionRoute,
	AuthenticatedTrackingRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	SitemapDotxmlRoute,
	OrderShopCodeRoute
};
var routeTree = Route$25._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
