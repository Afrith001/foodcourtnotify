import { o as __toESM } from "../_runtime.mjs";
import { D as setDoc, M as doc, P as serverTimestamp, b as getDoc } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { i as getDb, t as COL } from "./firebase-BQC3oBr4.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-CjUebW4j.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-C8W-HuJg.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Button } from "./button-l9FdWCHm.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Lt as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/subscription-Bh_9E_L6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PLANS = [
	{
		id: "free",
		name: "Free",
		price: "₹0",
		limit: "100 orders / month, 1 staff",
		features: ["Basic QR", "Real-time orders"]
	},
	{
		id: "starter",
		name: "Starter",
		price: "₹499",
		limit: "1000 orders / month, 5 staff",
		features: [
			"Custom branding",
			"Coupons",
			"Customer CRM"
		]
	},
	{
		id: "pro",
		name: "Pro",
		price: "₹1499",
		limit: "Unlimited",
		features: [
			"Marketing campaigns",
			"Advanced analytics",
			"Loyalty rewards",
			"Priority support"
		]
	}
];
function SubscriptionPage() {
	const { shop } = useShop();
	const [sub, setSub] = (0, import_react.useState)(null);
	const { t } = useTranslation();
	(0, import_react.useEffect)(() => {
		document.title = `${t("common.subscription")} · ${t("common.appName")}`;
	}, [t]);
	const load = async () => {
		if (!shop) return;
		const snap = await getDoc(doc(getDb(), COL.subscriptions, shop.id));
		if (snap.exists()) setSub(snap.data());
	};
	(0, import_react.useEffect)(() => {
		load();
	}, [shop]);
	const upgrade = async (plan) => {
		if (!shop) return;
		try {
			const expires = /* @__PURE__ */ new Date();
			expires.setDate(expires.getDate() + 30);
			await setDoc(doc(getDb(), COL.subscriptions, shop.id), {
				shopId: shop.id,
				plan,
				renewedAt: serverTimestamp(),
				expiresAt: expires.toISOString()
			}, { merge: true });
			toast.success(`Plan changed to ${plan}. Payments coming soon.`);
			load();
		} catch (e) {
			toast.error(e.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold",
				children: t("common.subscription")
			}),
			sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "shadow-soft gradient-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "capitalize",
						children: [sub.plan, " plan"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: ["Renews ", new Date(sub.expiresAt).toLocaleDateString()] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						children: [sub.ordersUsedThisMonth ?? 0, " orders used this month"]
					})]
				}) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-4",
				children: PLANS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: `shadow-soft ${sub?.plan === p.id ? "ring-2 ring-primary" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "font-display",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-3xl font-display font-bold",
							children: [p.price, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground font-normal",
								children: "/mo"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: p.limit })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-2",
						children: [p.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 text-success" }), f]
						}, f)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full mt-4",
							disabled: sub?.plan === p.id,
							onClick: () => upgrade(p.id),
							children: sub?.plan === p.id ? "Current plan" : "Choose plan"
						})]
					})]
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Note: Payment processing isn't wired in this build. Plan changes update your record immediately."
			})
		]
	});
}
//#endregion
export { SubscriptionPage as component };
