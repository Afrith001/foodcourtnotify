import { o as __toESM } from "../_runtime.mjs";
import { A as writeBatch, C as onSnapshot, M as doc, O as updateDoc, T as query, g as deleteDoc, j as collection, k as where, w as orderBy } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { i as getDb, t as COL } from "./firebase-BQC3oBr4.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-CjUebW4j.mjs";
import { n as CardContent, t as Card } from "./card-C8W-HuJg.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Button } from "./button-l9FdWCHm.mjs";
import { Lt as Check, Wt as Bell, g as Trash2 } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-CkgRPEsS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NotificationsPage() {
	const { shop } = useShop();
	const [rows, setRows] = (0, import_react.useState)([]);
	const { t } = useTranslation();
	(0, import_react.useEffect)(() => {
		document.title = `${t("common.notifications")} · ${t("common.appName")}`;
	}, [t]);
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		const unsub = onSnapshot(query(collection(getDb(), COL.notifications), where("shopId", "==", shop.id), orderBy("createdAt", "desc")), (snap) => {
			setRows(snap.docs.map((d) => ({
				id: d.id,
				...d.data()
			})));
		});
		return () => unsub();
	}, [shop]);
	const markRead = async (id) => {
		await updateDoc(doc(getDb(), COL.notifications, id), { read: true });
	};
	const del = async (id) => {
		await deleteDoc(doc(getDb(), COL.notifications, id));
	};
	const markAll = async () => {
		const db = getDb();
		const batch = writeBatch(db);
		rows.filter((r) => !r.read).forEach((r) => batch.update(doc(db, COL.notifications, r.id), { read: true }));
		await batch.commit();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between sm:items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-bold",
					children: t("common.notifications")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					onClick: markAll,
					className: "w-full sm:w-auto",
					children: "Mark all as read"
				})]
			}),
			rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "shadow-soft",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "pt-12 pb-12 text-center text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-8 h-8 mx-auto mb-2 opacity-40" }), "No notifications yet."]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: rows.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: `shadow-soft ${n.read ? "" : "border-primary/50"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "pt-4 pb-4 flex items-start justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: n.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted-foreground",
									children: n.body
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-1",
									children: n.createdAt ? new Date(n.createdAt.toMillis()).toLocaleString() : ""
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [!n.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => markRead(n.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => del(n.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
							})]
						})]
					})
				}, n.id))
			})
		]
	});
}
//#endregion
export { NotificationsPage as component };
