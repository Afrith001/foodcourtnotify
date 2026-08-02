import { o as __toESM } from "../_runtime.mjs";
import { A as writeBatch, C as onSnapshot, M as doc, O as updateDoc, P as serverTimestamp, T as query, j as collection, k as where, m as addDoc, w as orderBy, x as getDocs } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { i as getDb, t as COL } from "./firebase-BQC3oBr4.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-CjUebW4j.mjs";
import { n as CardContent, t as Card } from "./card-C8W-HuJg.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Input } from "./input-DgSC1K2-.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Button } from "./button-l9FdWCHm.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as Send, B as Plus } from "../_libs/lucide-react.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, r as DialogFooter, t as Dialog } from "./dialog-B8mBdC_P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/campaigns-lPnXNQlC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CampaignsPage() {
	const { shop } = useShop();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [open, setOpen] = (0, import_react.useState)(false);
	const { t } = useTranslation();
	(0, import_react.useEffect)(() => {
		document.title = `${t("common.campaigns")} · ${t("common.appName")}`;
	}, [t]);
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		const unsub = onSnapshot(query(collection(getDb(), COL.campaigns), where("shopId", "==", shop.id), orderBy("createdAt", "desc")), (snap) => {
			setRows(snap.docs.map((d) => ({
				id: d.id,
				...d.data()
			})));
		});
		return () => unsub();
	}, [shop]);
	const send = async (c) => {
		if (!shop) return;
		try {
			const db = getDb();
			const customers = await getDocs(query(collection(db, COL.customers), where("shopId", "==", shop.id)));
			const batch = writeBatch(db);
			let count = 0;
			customers.forEach((cust) => {
				const data = cust.data();
				const ref = doc(collection(db, COL.notifications));
				batch.set(ref, {
					shopId: shop.id,
					customerMobile: data.mobile,
					title: c.title,
					body: c.message,
					type: "campaign",
					read: false,
					createdAt: serverTimestamp()
				});
				count++;
			});
			await batch.commit();
			await updateDoc(doc(db, COL.campaigns, c.id), {
				status: "sent",
				sentCount: count
			});
			toast.success(`Campaign sent to ${count} customer(s)`);
		} catch (e) {
			toast.error(e.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row justify-between sm:items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold",
				children: t("common.campaigns")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full sm:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), "New campaign"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampaignForm, { onClose: () => setOpen(false) })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 md:grid-cols-2 gap-4",
			children: [rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground",
				children: "No campaigns yet."
			}), rows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "shadow-soft",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "pt-6 space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display font-semibold",
								children: c.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "mt-1",
								children: c.type
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: c.status === "sent" ? "default" : "outline",
								children: c.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: c.message
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: ["Sent: ", c.sentCount ?? 0]
							}), c.status !== "sent" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => send(c),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3 h-3 mr-1" }), "Send"]
							})]
						})
					]
				})
			}, c.id))]
		})]
	});
}
function CampaignForm({ onClose }) {
	const { shop } = useShop();
	const [f, setF] = (0, import_react.useState)({
		type: "general",
		title: "",
		message: ""
	});
	const save = async () => {
		if (!shop) return;
		if (!f.title.trim() || !f.message.trim()) {
			toast.error("Title and message are required.");
			return;
		}
		try {
			await addDoc(collection(getDb(), COL.campaigns), {
				shopId: shop.id,
				type: f.type,
				title: f.title,
				message: f.message,
				status: "draft",
				sentCount: 0,
				createdAt: serverTimestamp()
			});
			toast.success("Campaign created");
			onClose();
		} catch (e) {
			toast.error(e.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New campaign" }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: f.type,
						onValueChange: (v) => setF({
							...f,
							type: v
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "festival",
								children: "Festival"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "birthday",
								children: "Birthday"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "loyalty",
								children: "Loyalty"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "discount",
								children: "Discount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "general",
								children: "General"
							})
						] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: f.title,
						onChange: (e) => setF({
							...f,
							title: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Message" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 4,
						value: f.message,
						onChange: (e) => setF({
							...f,
							message: e.target.value
						})
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
export { CampaignsPage as component };
