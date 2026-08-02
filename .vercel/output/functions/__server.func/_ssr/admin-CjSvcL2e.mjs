import { o as __toESM } from "../_runtime.mjs";
import { C as onSnapshot, T as query, j as collection, k as where } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { i as getDb, t as COL } from "./firebase-BQC3oBr4.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-CjUebW4j.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-C8W-HuJg.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CjSvcL2e.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const { shop } = useShop();
	const [stats, setStats] = (0, import_react.useState)({
		products: 0,
		orders: 0,
		customers: 0,
		staff: 0
	});
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		const db = getDb();
		const productsQ = query(collection(db, COL.products), where("shopId", "==", shop.id));
		const ordersQ = query(collection(db, COL.orders), where("shopId", "==", shop.id));
		const customersQ = query(collection(db, COL.customers), where("shopId", "==", shop.id));
		const staffQ = query(collection(db, COL.staff), where("shopId", "==", shop.id));
		const unsubProducts = onSnapshot(productsQ, (snap) => setStats((current) => ({
			...current,
			products: snap.size
		})));
		const unsubOrders = onSnapshot(ordersQ, (snap) => setStats((current) => ({
			...current,
			orders: snap.size
		})));
		const unsubCustomers = onSnapshot(customersQ, (snap) => setStats((current) => ({
			...current,
			customers: snap.size
		})));
		const unsubStaff = onSnapshot(staffQ, (snap) => setStats((current) => ({
			...current,
			staff: snap.size
		})));
		return () => {
			unsubProducts();
			unsubOrders();
			unsubCustomers();
			unsubStaff();
		};
	}, [shop]);
	if (!shop) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-bold",
					children: "Admin"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "High-level overview of your Nexavo POS workspace."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
				children: [
					{
						label: "Products",
						value: stats.products
					},
					{
						label: "Orders",
						value: stats.orders
					},
					{
						label: "Customers",
						value: stats.customers
					},
					{
						label: "Staff",
						value: stats.staff
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: item.label }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-3xl font-bold",
						children: item.value
					}) })]
				}, item.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "System status" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							children: "Firebase connected"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							children: "Realtime sync enabled"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							children: "POS modules live"
						})
					]
				}) })]
			})
		]
	});
}
//#endregion
export { AdminPage as component };
