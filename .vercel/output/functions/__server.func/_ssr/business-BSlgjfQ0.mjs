import { o as __toESM } from "../_runtime.mjs";
import { M as doc, O as updateDoc, b as getDoc } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { r as getDb, t as COL } from "./firebase-jX9Hxz-N.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-oa7pWA7o.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-ZV2o_Ft7.mjs";
import { t as Input } from "./input-B-tDUnPX.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Button } from "./button-ufo6MiTZ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/business-BSlgjfQ0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BusinessPage() {
	const { shop } = useShop();
	const [form, setForm] = (0, import_react.useState)({
		businessName: "",
		currency: "INR",
		address: "",
		phone: "",
		email: "",
		gst: "",
		fssai: "",
		timezone: "Asia/Kolkata"
	});
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		getDoc(doc(getDb(), COL.shops, shop.id)).then((snap) => {
			const data = snap.data();
			setForm({
				businessName: data?.businessName || shop.name || "",
				currency: data?.currency || "INR",
				address: data?.address || "",
				phone: data?.phone || "",
				email: data?.email || "",
				gst: data?.gst || "",
				fssai: data?.fssai || "",
				timezone: data?.timezone || "Asia/Kolkata"
			});
		});
	}, [shop]);
	const save = async () => {
		if (!shop) return;
		try {
			await updateDoc(doc(getDb(), COL.shops, shop.id), form);
			toast.success("Business settings saved");
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
				children: "Business settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Store your business identity, tax details and operating preferences."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Business profile" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "All values persist to the shared shop document in Firestore." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "grid gap-4 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Business name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.businessName,
								onChange: (e) => setForm({
									...form,
									businessName: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Currency" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.currency,
								onChange: (e) => setForm({
									...form,
									currency: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.address,
								onChange: (e) => setForm({
									...form,
									address: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.phone,
								onChange: (e) => setForm({
									...form,
									phone: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.email,
								onChange: (e) => setForm({
									...form,
									email: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "GST" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.gst,
								onChange: (e) => setForm({
									...form,
									gst: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "FSSAI" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.fssai,
								onChange: (e) => setForm({
									...form,
									fssai: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Timezone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.timezone,
								onChange: (e) => setForm({
									...form,
									timezone: e.target.value
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 pt-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: save,
						children: "Save business settings"
					})
				})
			]
		})]
	});
}
//#endregion
export { BusinessPage as component };
