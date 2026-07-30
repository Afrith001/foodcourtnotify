import { o as __toESM } from "../_runtime.mjs";
import { C as onSnapshot, T as query, j as collection, k as where } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { r as getDb, t as COL } from "./firebase-jX9Hxz-N.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-oa7pWA7o.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-ZV2o_Ft7.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Input } from "./input-B-tDUnPX.mjs";
import { N as Search } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventory-ztWLI2eA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InventoryPage() {
	const { shop } = useShop();
	const [products, setProducts] = (0, import_react.useState)([]);
	const [search, setSearch] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		const unsub = onSnapshot(query(collection(getDb(), COL.products), where("shopId", "==", shop.id)), (snap) => setProducts(snap.docs.map((d) => ({
			id: d.id,
			...d.data()
		}))));
		return () => unsub();
	}, [shop]);
	const filtered = (0, import_react.useMemo)(() => {
		const term = search.toLowerCase().trim();
		if (!term) return products;
		return products.filter((product) => product.name.toLowerCase().includes(term));
	}, [products, search]);
	if (!shop) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold",
				children: "Inventory"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Track low stock, stock levels and availability for every product."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "shadow-soft",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Stock overview" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: search,
					onChange: (e) => setSearch(e.target.value),
					placeholder: "Search inventory",
					className: "pl-9"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: filtered.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between rounded-xl border border-border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold",
						children: product.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: ["Price ₹", product.price]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: product.stock <= (product.lowStockThreshold ?? 0) ? "destructive" : "secondary",
							children: ["Stock ", product.stock]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: product.available ? "secondary" : "outline",
							children: product.available ? "Available" : "Hidden"
						})]
					})]
				}, product.id))
			})] })]
		})]
	});
}
//#endregion
export { InventoryPage as component };
