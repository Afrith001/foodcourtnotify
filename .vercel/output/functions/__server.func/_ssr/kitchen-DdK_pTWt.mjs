import { o as __toESM } from "../_runtime.mjs";
import { C as onSnapshot, M as doc, O as updateDoc, S as limit, T as query, j as collection, k as where, w as orderBy } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { r as getDb, t as COL } from "./firebase-jX9Hxz-N.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-oa7pWA7o.mjs";
import { n as CardContent, t as Card } from "./card-ZV2o_Ft7.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-ufo6MiTZ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Nt as Clock3, Rt as CircleCheck } from "../_libs/lucide-react.mjs";
import { o as notifyOrderStatusChange } from "./order-utils-BPm42f6Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kitchen-DdK_pTWt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var stages = [
	{
		key: "pending",
		label: "Pending"
	},
	{
		key: "preparing",
		label: "Preparing"
	},
	{
		key: "ready",
		label: "Ready"
	},
	{
		key: "completed",
		label: "Completed"
	}
];
function KitchenPage() {
	const { shop } = useShop();
	const [orders, setOrders] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		const unsub = onSnapshot(query(collection(getDb(), COL.orders), where("shopId", "==", shop.id), orderBy("createdAt", "desc"), limit(100)), (snap) => setOrders(snap.docs.map((d) => ({
			id: d.id,
			...d.data()
		})).filter((o) => o.status !== "Waiting")));
		return () => unsub();
	}, [shop]);
	const advance = async (orderId, nextStatus) => {
		try {
			const order = orders.find((entry) => entry.id === orderId);
			await updateDoc(doc(getDb(), COL.orders, orderId), {
				status: nextStatus,
				updatedAt: /* @__PURE__ */ new Date()
			});
			await notifyOrderStatusChange({
				id: orderId,
				orderId: order?.orderId,
				customerName: order?.items?.[0]?.name
			}, nextStatus, shop?.id);
			toast.success(`Order moved to ${nextStatus}`);
		} catch (error) {
			toast.error(error.message);
		}
	};
	if (!shop) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold",
				children: "Kitchen workflow"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Move orders through pending, preparing, ready and completed states in real time."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 lg:grid-cols-4",
			children: stages.map((stage) => {
				const stageOrders = orders.filter((order) => order.status === stage.key);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: stage.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							children: stageOrders.length
						})]
					}), stageOrders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-3 pt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: order.orderId || order.id
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "h-3 w-3" }), order.createdAt ? new Date(order.createdAt.toMillis()).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit"
										}) : "—"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted-foreground",
									children: order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-semibold",
									children: ["₹", Number(order.total || 0).toFixed(0)]
								}),
								stage.key !== "completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "w-full",
									onClick: () => advance(order.id, stages[stages.findIndex((item) => item.key === stage.key) + 1]?.key ?? "completed"),
									children: ["Mark ", stages[stages.findIndex((item) => item.key === stage.key) + 1]?.label ?? "Completed"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-sm text-success",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Completed"]
								})
							]
						})
					}, order.id))]
				}, stage.key);
			})
		})]
	});
}
//#endregion
export { KitchenPage as component };
