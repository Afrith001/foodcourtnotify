import { o as __toESM } from "../_runtime.mjs";
import { T as query, j as collection, k as where, x as getDocs } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { r as getDb, t as COL } from "./firebase-jX9Hxz-N.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-oa7pWA7o.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-ZV2o_Ft7.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { a as YAxis, c as Line, i as LineChart, l as CartesianGrid, m as Tooltip, o as XAxis, p as ResponsiveContainer, r as BarChart, u as Bar } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-CTNO8I5T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AnalyticsPage() {
	const { shop } = useShop();
	const [hourly, setHourly] = (0, import_react.useState)([]);
	const [daily, setDaily] = (0, import_react.useState)([]);
	const { t } = useTranslation();
	(0, import_react.useEffect)(() => {
		document.title = `${t("common.analytics")} · ${t("common.appName")}`;
	}, [t]);
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		(async () => {
			const snap = await getDocs(query(collection(getDb(), COL.orders), where("shopId", "==", shop.id)));
			const since = Date.now() - 336 * 60 * 60 * 1e3;
			const rows = snap.docs.map((d) => d.data()).filter((r) => (r.createdAt?.toMillis?.() ?? 0) >= since);
			const h = {};
			const d = {};
			rows.forEach((r) => {
				const dt = new Date(r.createdAt.toMillis());
				h[dt.getHours()] = (h[dt.getHours()] ?? 0) + 1;
				const key = dt.toISOString().slice(0, 10);
				d[key] = (d[key] ?? 0) + Number(r.total || 0);
			});
			setHourly(Array.from({ length: 24 }, (_, i) => ({
				hour: `${i}h`,
				orders: h[i] ?? 0
			})));
			setDaily(Object.keys(d).sort().map((k) => ({
				day: k.slice(5),
				revenue: d[k]
			})));
		})();
	}, [shop]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 max-w-6xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-bold",
			children: t("common.analytics")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Revenue (last 14 days)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: daily,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								opacity: .2
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "day",
								fontSize: 11
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { fontSize: 11 }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "revenue",
								stroke: "var(--color-primary)",
								strokeWidth: 2,
								dot: false
							})
						]
					}) })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Peak hours" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: hourly,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								opacity: .2
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "hour",
								fontSize: 11
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { fontSize: 11 }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "orders",
								fill: "var(--color-primary)",
								radius: [
									4,
									4,
									0,
									0
								]
							})
						]
					}) })
				})]
			})]
		})]
	});
}
//#endregion
export { AnalyticsPage as component };
