import { o as __toESM } from "../_runtime.mjs";
import { C as onSnapshot, T as query, j as collection, k as where } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { i as getDb, t as COL } from "./firebase-BQC3oBr4.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-CjUebW4j.mjs";
import { n as CardContent, t as Card } from "./card-C8W-HuJg.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Input } from "./input-DgSC1K2-.mjs";
import { t as Button } from "./button-l9FdWCHm.mjs";
import { j as Search, xt as Download } from "../_libs/lucide-react.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers-BjRRKwbX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomersPage() {
	const { shop } = useShop();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const { t } = useTranslation();
	(0, import_react.useEffect)(() => {
		document.title = `${t("common.customers")} · ${t("common.appName")}`;
	}, [t]);
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		const unsub = onSnapshot(query(collection(getDb(), COL.customers), where("shopId", "==", shop.id)), (snap) => {
			setRows(snap.docs.map((d) => ({
				id: d.id,
				...d.data()
			})));
		});
		return () => unsub();
	}, [shop]);
	const filtered = (0, import_react.useMemo)(() => {
		const s = q.toLowerCase().trim();
		if (!s) return rows;
		return rows.filter((r) => (r.name ?? "").toLowerCase().includes(s) || r.mobile.includes(s));
	}, [rows, q]);
	const exportCsv = () => {
		const header = "Name,Mobile,Orders,Spending,Loyalty,LastVisit\n";
		const body = filtered.map((r) => [
			r.name ?? "",
			r.mobile,
			r.totalOrders ?? 0,
			r.totalSpending ?? 0,
			r.loyaltyPoints ?? 0,
			r.lastVisit ? new Date(r.lastVisit.toMillis()).toISOString() : ""
		].join(",")).join("\n");
		const blob = new Blob([header + body], { type: "text/csv" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "customers.csv";
		a.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-bold",
					children: t("common.customers")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: exportCsv,
					className: "w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4 mr-2" }), t("common.export")]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "pl-9",
					placeholder: "Search by name or mobile…",
					value: q,
					onChange: (e) => setQ(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "shadow-soft overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Name" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Mobile" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Orders"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Spending"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Loyalty"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Last visit" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 6,
						className: "text-center text-muted-foreground py-12",
						children: "No customers yet."
					}) }), filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium whitespace-nowrap",
							children: r.name ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-mono text-xs",
							children: r.mobile
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: r.totalOrders ?? 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "text-right",
							children: ["₹", Number(r.totalSpending ?? 0).toFixed(0)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: r.loyaltyPoints ?? 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs text-muted-foreground whitespace-nowrap",
							children: r.lastVisit ? new Date(r.lastVisit.toMillis()).toLocaleString() : "—"
						})
					] }, r.id))] })] })
				})
			})
		]
	});
}
//#endregion
export { CustomersPage as component };
