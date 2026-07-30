import { o as __toESM } from "../_runtime.mjs";
import { C as onSnapshot, M as doc, O as updateDoc, P as serverTimestamp, T as query, g as deleteDoc, j as collection, k as where, m as addDoc, w as orderBy } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { r as getDb, t as COL } from "./firebase-jX9Hxz-N.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-oa7pWA7o.mjs";
import { n as CardContent, t as Card } from "./card-ZV2o_Ft7.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Input } from "./input-B-tDUnPX.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Button } from "./button-ufo6MiTZ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { U as Plus, g as Trash2 } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, r as DialogFooter, t as Dialog } from "./dialog-B8mBdC_P.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/coupons-CjqAWEIb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CouponsPage() {
	const { shop } = useShop();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [open, setOpen] = (0, import_react.useState)(false);
	const { t } = useTranslation();
	(0, import_react.useEffect)(() => {
		document.title = `${t("common.coupons")} · ${t("common.appName")}`;
	}, [t]);
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		const unsub = onSnapshot(query(collection(getDb(), COL.coupons), where("shopId", "==", shop.id), orderBy("createdAt", "desc")), (snap) => {
			setRows(snap.docs.map((d) => ({
				id: d.id,
				...d.data()
			})));
		});
		return () => unsub();
	}, [shop]);
	const toggle = async (c) => {
		await updateDoc(doc(getDb(), COL.coupons, c.id), { active: !c.active });
	};
	const del = async (c) => {
		if (!confirm(`Delete coupon ${c.code}?`)) return;
		await deleteDoc(doc(getDb(), COL.coupons, c.id));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row justify-between sm:items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold",
				children: t("common.coupons")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full sm:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), "New coupon"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CouponForm, { onClose: () => setOpen(false) })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
			children: [rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground col-span-full",
				children: "No coupons yet."
			}), rows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "shadow-soft",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "pt-6 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono font-bold text-lg",
								children: c.code
							}), c.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: c.description
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: c.active,
								onCheckedChange: () => toggle(c)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 flex-wrap text-sm",
							children: [
								c.percentDiscount != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "px-2 py-0.5 bg-primary/10 text-primary rounded",
									children: [c.percentDiscount, "% off"]
								}),
								c.fixedDiscount != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "px-2 py-0.5 bg-accent/20 text-accent-foreground rounded",
									children: [
										"₹",
										c.fixedDiscount,
										" off"
									]
								}),
								c.expiry && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "px-2 py-0.5 bg-muted rounded",
									children: ["Exp ", new Date(c.expiry).toLocaleDateString()]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Used ",
								c.usageCount ?? 0,
								c.usageLimit ? ` / ${c.usageLimit}` : ""
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => del(c),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3 h-3" })
							})]
						})
					]
				})
			}, c.id))]
		})]
	});
}
function CouponForm({ onClose }) {
	const { shop } = useShop();
	const [f, setF] = (0, import_react.useState)({
		code: "",
		description: "",
		percent: "",
		fixed: "",
		expiry: "",
		limit: ""
	});
	const save = async () => {
		if (!shop) return;
		if (!f.code.trim()) {
			toast.error("Code is required.");
			return;
		}
		try {
			await addDoc(collection(getDb(), COL.coupons), {
				shopId: shop.id,
				code: f.code.toUpperCase().trim(),
				description: f.description || null,
				percentDiscount: f.percent ? Number(f.percent) : null,
				fixedDiscount: f.fixed ? Number(f.fixed) : null,
				expiry: f.expiry || null,
				usageLimit: f.limit ? Number(f.limit) : null,
				usageCount: 0,
				active: true,
				createdAt: serverTimestamp()
			});
			toast.success("Coupon created");
			onClose();
		} catch (e) {
			toast.error(e.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New coupon" }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: f.code,
						onChange: (e) => setF({
							...f,
							code: e.target.value
						}),
						placeholder: "WELCOME10"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: f.description,
						onChange: (e) => setF({
							...f,
							description: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "% off" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: f.percent,
							onChange: (e) => setF({
								...f,
								percent: e.target.value
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Flat off" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: f.fixed,
							onChange: (e) => setF({
								...f,
								fixed: e.target.value
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Expiry" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "datetime-local",
							value: f.expiry,
							onChange: (e) => setF({
								...f,
								expiry: e.target.value
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Usage limit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: f.limit,
							onChange: (e) => setF({
								...f,
								limit: e.target.value
							})
						})]
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			onClick: onClose,
			children: "Cancel"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: save,
			children: "Create"
		})] })
	] });
}
//#endregion
export { CouponsPage as component };
