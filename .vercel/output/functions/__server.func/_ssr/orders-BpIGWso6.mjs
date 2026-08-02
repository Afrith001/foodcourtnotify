import { o as __toESM } from "../_runtime.mjs";
import { C as onSnapshot, T as query, j as collection, k as where, w as orderBy } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { i as getDb, t as COL } from "./firebase-BQC3oBr4.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-CjUebW4j.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-C8W-HuJg.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Input } from "./input-DgSC1K2-.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Button } from "./button-l9FdWCHm.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-5nmLeuF4.mjs";
import { I as Receipt, T as Smartphone, Tt as Clock, _t as Funnel, j as Search, u as User, z as Printer } from "../_libs/lucide-react.mjs";
import { n as formatCurrency, t as buildReceiptText } from "./pos-BKnCkGZE.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { c as isSameDay, i as format, l as startOfDay, n as isBefore, r as isAfter, s as endOfDay, t as subDays } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-BpIGWso6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KANBAN_COLUMNS = [
	{
		key: "pending",
		label: "Pending",
		next: "preparing"
	},
	{
		key: "preparing",
		label: "Preparing",
		next: "ready"
	},
	{
		key: "ready",
		label: "Ready",
		next: "completed"
	},
	{
		key: "completed",
		label: "Completed"
	}
];
var STATUS_COLORS = {
	pending: "bg-amber-100 text-amber-800 border-amber-200",
	preparing: "bg-blue-100 text-blue-800 border-blue-200",
	ready: "bg-emerald-100 text-emerald-800 border-emerald-200",
	completed: "bg-gray-100 text-gray-800 border-gray-200",
	cancelled: "bg-red-100 text-red-800 border-red-200",
	refunded: "bg-purple-100 text-purple-800 border-purple-200"
};
function OrdersPage() {
	const { shop } = useShop();
	const { t } = useTranslation();
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [activeTab, setActiveTab] = (0, import_react.useState)("kanban");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [dateRange, setDateRange] = (0, import_react.useState)("today");
	const [customFrom, setCustomFrom] = (0, import_react.useState)("");
	const [customTo, setCustomTo] = (0, import_react.useState)("");
	const [selectedOrderId, setSelectedOrderId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		document.title = `${t("common.orders")} · ${t("common.appName")}`;
	}, [t]);
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		const unsub = onSnapshot(query(collection(getDb(), COL.orders), where("shopId", "==", shop.id), orderBy("createdAt", "desc")), (snap) => {
			setOrders(snap.docs.map((d) => ({
				id: d.id,
				...d.data()
			})).filter((o) => o.status !== "Waiting"));
			setLoading(false);
		}, (err) => {
			setLoading(false);
		});
		return () => unsub();
	}, [shop]);
	const dateLimits = (0, import_react.useMemo)(() => {
		const now = /* @__PURE__ */ new Date();
		return {
			today: startOfDay(now),
			yesterdayStart: startOfDay(subDays(now, 1)),
			yesterdayEnd: endOfDay(subDays(now, 1)),
			week: startOfDay(subDays(now, 7)),
			month: startOfDay(subDays(now, 30))
		};
	}, []);
	const filteredOrders = (0, import_react.useMemo)(() => {
		return orders.filter((o) => {
			const search = searchQuery.toLowerCase().trim();
			if (search) {
				const orderNumMatches = String(o.orderNumber).includes(search);
				const orderIdMatches = (o.orderId ?? "").toLowerCase().includes(search);
				const nameMatches = (o.customerName ?? "").toLowerCase().includes(search);
				const mobileMatches = (o.customerMobile ?? "").toLowerCase().includes(search);
				if (!orderNumMatches && !orderIdMatches && !nameMatches && !mobileMatches) return false;
			}
			if (!o.createdAt) return false;
			const orderDate = new Date(o.createdAt.toMillis());
			if (dateRange === "today") return orderDate >= dateLimits.today;
			else if (dateRange === "yesterday") return orderDate >= dateLimits.yesterdayStart && orderDate <= dateLimits.yesterdayEnd;
			else if (dateRange === "week") return orderDate >= dateLimits.week;
			else if (dateRange === "month") return orderDate >= dateLimits.month;
			else if (dateRange === "custom") {
				if (customFrom) {
					if (isBefore(orderDate, startOfDay(new Date(customFrom)))) return false;
				}
				if (customTo) {
					if (isAfter(orderDate, endOfDay(new Date(customTo)))) return false;
				}
			}
			return true;
		});
	}, [
		orders,
		searchQuery,
		dateRange,
		customFrom,
		customTo,
		dateLimits
	]);
	const selectedOrder = (0, import_react.useMemo)(() => {
		return orders.find((o) => o.id === selectedOrderId) || null;
	}, [orders, selectedOrderId]);
	const groupedHistory = (0, import_react.useMemo)(() => {
		const groups = /* @__PURE__ */ new Map();
		const today = /* @__PURE__ */ new Date();
		const yesterday = subDays(today, 1);
		filteredOrders.forEach((order) => {
			if (!order.createdAt) return;
			const createdAt = new Date(order.createdAt.toMillis());
			const groupKey = format(startOfDay(createdAt), "yyyy-MM-dd");
			const label = isSameDay(createdAt, today) ? "Today" : isSameDay(createdAt, yesterday) ? "Yesterday" : format(createdAt, "dd MMM yyyy");
			const group = groups.get(groupKey) ?? {
				label,
				orders: []
			};
			group.orders.push(order);
			groups.set(groupKey, group);
		});
		return Array.from(groups.values()).map((group) => ({
			...group,
			orders: group.orders.sort((a, b) => {
				const aTime = a.createdAt?.toMillis() ?? 0;
				return (b.createdAt?.toMillis() ?? 0) - aTime;
			})
		}));
	}, [filteredOrders]);
	const printReceipt = (o) => {
		const sub = o.subtotal || o.total;
		const tax = o.tax || 0;
		const disc = o.discount || 0;
		const itemsConverted = o.items.map((item) => ({
			id: item.id,
			name: item.name,
			price: item.price,
			quantity: item.quantity,
			taxRate: item.taxRate || 0,
			discount: item.discount || 0,
			preparationTime: 0,
			notes: item.notes || null,
			variant: item.variant || null
		}));
		const paymentsConverted = o.payments || [{
			method: o.paymentMethod,
			amount: o.total
		}];
		const receiptHtml = buildReceiptText(o.orderNumber, o.customerName || "", itemsConverted, sub, tax, disc, o.total, paymentsConverted, shop?.currency ?? "INR", o.orderId).replace(`ORDER ID\n${o.orderId || o.id}`, `<section class="order-id"><div>ORDER ID</div><strong>${o.orderId || o.id}</strong></section>`);
		const printWindow = window.open("", "_blank");
		if (printWindow) {
			printWindow.document.write(`
        <html>
          <head>
            <title>Receipt ${o.orderId || o.id}</title>
            <style>
              body {
                font-family: 'Courier New', Courier, monospace;
                padding: 20px;
                width: 280px;
                font-size: 13px;
                line-height: 1.4;
              }
              pre {
                white-space: pre-wrap;
              }
              .order-id { margin: 12px 0; padding: 10px; text-align: center; color: #000; background: #fff; border: 2px solid #000; font-weight: 900; }
              .order-id div { font-size: 14px; letter-spacing: 1px; }
              .order-id strong { display: block; font-size: 22px; letter-spacing: 1px; }
            </style>
          </head>
          <body>
            <pre>${receiptHtml}</pre>
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            <\/script>
          </body>
        </html>
      `);
			printWindow.document.close();
		}
	};
	if (!shop) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-2 flex-shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold tracking-tight",
				children: t("common.orders")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Manage active kitchen prep queues and view sales history details."
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			value: activeTab,
			onValueChange: setActiveTab,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "grid grid-cols-2 w-[340px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "kanban",
						className: "font-semibold text-xs",
						children: "Live Kanban Board"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "history",
						className: "font-semibold text-xs",
						children: "Order History & Search"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "kanban",
					className: "space-y-4 outline-none",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted-foreground py-8",
						children: "Loading prep queues..."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
						children: KANBAN_COLUMNS.map((col) => {
							const colOrders = orders.filter((o) => o.status === col.key);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 bg-muted/20 border rounded-xl p-3 flex flex-col min-h-[480px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-xs uppercase tracking-wider text-muted-foreground",
										children: t("orders." + col.key)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: "font-semibold text-[10px]",
										children: colOrders.length
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 flex-1 overflow-y-auto",
									children: [colOrders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "shadow-soft hover:shadow-md transition border-border/80 bg-background overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-3 space-y-2.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-sm text-primary font-display",
														children: o.orderId || o.id
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[10px] text-muted-foreground flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }), o.createdAt ? new Date(o.createdAt.toMillis()).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit"
														}) : ""]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "border-t border-dashed pt-2 space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-xs font-bold truncate",
														children: o.customerName ?? "Walk-in"
													}), o.customerMobile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[10px] text-muted-foreground",
														children: o.customerMobile
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "space-y-1",
													children: (o.items ?? []).map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-xs text-muted-foreground flex items-center gap-1.5 min-w-0",
														children: [item.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															src: item.imageUrl,
															alt: "",
															className: "w-5 h-5 rounded object-cover flex-shrink-0"
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "truncate flex-1",
															children: [
																item.quantity,
																"x ",
																item.name,
																item.variant ? ` [${item.variant}]` : ""
															]
														})]
													}, idx))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between pt-2 border-t border-dashed mt-1.5 flex-shrink-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs font-bold text-gray-800",
														children: formatCurrency(o.total, shop.currency ?? "INR")
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														className: "text-[10px] font-semibold",
														children: t("orders." + o.status) || o.status
													})]
												})
											]
										})
									}, o.id)), !colOrders.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-center text-[10px] py-16 text-muted-foreground/70",
										children: "Queue empty"
									})]
								})]
							}, col.key);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "history",
					className: "outline-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-4 min-h-[500px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-soft border-border/80 flex flex-col overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "p-3 border-b flex-shrink-0 bg-background/50 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col md:flex-row gap-3 justify-between items-start md:items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative w-full md:w-[260px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: searchQuery,
											onChange: (e) => setSearchQuery(e.target.value),
											placeholder: "Search order #, customer...",
											className: "pl-8 h-9 text-xs"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1.5 items-center",
										children: [
											{
												id: "today",
												label: "Today"
											},
											{
												id: "yesterday",
												label: "Yesterday"
											},
											{
												id: "week",
												label: "7 Days"
											},
											{
												id: "month",
												label: "Month"
											},
											{
												id: "custom",
												label: "Custom"
											}
										].map((btn) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: dateRange === btn.id ? "default" : "outline",
											onClick: () => setDateRange(btn.id),
											className: "h-8 text-[11px] px-2.5 rounded-full",
											children: btn.label
										}, btn.id))
									})]
								}), dateRange === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3 pt-2 animate-fade-in border-t border-dashed border-border/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[10px] text-muted-foreground font-semibold",
										children: "From Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: customFrom,
										onChange: (e) => setCustomFrom(e.target.value),
										className: "h-8 text-xs"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[10px] text-muted-foreground font-semibold",
										children: "To Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: customTo,
										onChange: (e) => setCustomTo(e.target.value),
										className: "h-8 text-xs"
									})] })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "p-0 overflow-auto flex-1 max-h-[460px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
									className: "bg-muted/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "w-[90px] text-xs font-bold",
											children: "Order ID"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-xs font-bold",
											children: "Date & Time"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-xs font-bold",
											children: "Customer Info"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-xs font-bold",
											children: "Payment"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-xs font-bold text-right",
											children: "Total"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-xs font-bold text-center",
											children: "Status"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: groupedHistory.length ? groupedHistory.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, {
									className: "bg-muted/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
										colSpan: 6,
										className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600 py-2",
										children: [
											group.label,
											" — ",
											group.orders.length,
											" order",
											group.orders.length === 1 ? "" : "s"
										]
									})
								}), group.orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
									onClick: () => setSelectedOrderId(o.id),
									className: `cursor-pointer hover:bg-muted/40 transition select-none ${selectedOrderId === o.id ? "bg-muted/70 font-semibold" : ""}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "font-bold text-primary font-display text-xs",
											children: o.orderId || o.id
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-xs text-muted-foreground whitespace-nowrap",
											children: o.createdAt ? format(new Date(o.createdAt.toMillis()), "dd MMM yyyy, hh:mm a") : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
											className: "text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate font-semibold max-w-[120px]",
												children: o.customerName || "Walk-in"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-muted-foreground truncate",
												children: o.customerMobile || "—"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-xs capitalize font-medium",
											children: o.paymentMethod
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-xs font-bold text-right font-display",
											children: formatCurrency(o.total, shop.currency ?? "INR")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: `text-[9px] py-0 px-2 border font-bold capitalize shadow-none ${STATUS_COLORS[o.status] || "bg-gray-100"}`,
												children: o.status
											})
										})
									]
								}, o.id))] }, group.label)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									colSpan: 6,
									className: "text-center py-16 text-xs text-muted-foreground",
									children: "No history records found matching criteria."
								}) }) })] })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: selectedOrder ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "shadow-soft border-border/80 flex flex-col overflow-hidden animate-slide-up h-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "p-4 border-b flex-shrink-0 bg-background/50 flex flex-row items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
										className: "text-sm font-semibold flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "w-4 h-4 text-primary" }), " Invoice Summary"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
										className: "text-[10px]",
										children: [
											"Order ID: ",
											selectedOrder.id.slice(0, 8),
											"..."
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => printReceipt(selectedOrder),
										className: "h-8 text-xs font-semibold px-2.5 rounded-lg border-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-3.5 h-3.5 mr-1" }), " Print Slip"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "p-4 overflow-y-auto space-y-4 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2 text-xs border-b border-dashed pb-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-muted-foreground flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5" }), " Date & Time"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium",
														children: selectedOrder.createdAt ? format(new Date(selectedOrder.createdAt.toMillis()), "dd MMM yyyy, hh:mm a") : "—"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-muted-foreground flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-3.5 h-3.5" }), " Customer"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold",
														children: selectedOrder.customerName || "Walk-in Customer"
													})]
												}),
												selectedOrder.customerMobile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-muted-foreground flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-3.5 h-3.5" }), " Mobile"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium",
														children: selectedOrder.customerMobile
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-muted-foreground flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "w-3.5 h-3.5" }), " Payment"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold uppercase text-primary",
														children: selectedOrder.paymentMethod
													})]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-muted-foreground uppercase font-semibold tracking-wider",
												children: "Ordered Items"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "space-y-1.5",
												children: selectedOrder.items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between items-start text-xs border-b border-border/40 pb-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "min-w-0",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "font-medium truncate",
																children: item.name
															}),
															item.variant && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																variant: "secondary",
																className: "text-[9px] py-0 px-1 mt-0.5",
																children: item.variant
															}),
															item.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "text-[10px] text-amber-600 font-medium italic mt-0.5",
																children: ["Note: ", item.notes]
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-right whitespace-nowrap",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "font-semibold",
															children: [
																item.quantity,
																"x ",
																formatCurrency(item.price, shop.currency ?? "INR")
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[10px] text-muted-foreground",
															children: formatCurrency(item.price * item.quantity, shop.currency ?? "INR")
														})]
													})]
												}, idx))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5 text-xs pt-3 border-t border-dashed border-border/80",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatCurrency(selectedOrder.subtotal || selectedOrder.total, shop.currency ?? "INR") })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GST Tax:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatCurrency(selectedOrder.tax || 0, shop.currency ?? "INR") })]
												}),
												selectedOrder.discount && selectedOrder.discount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-red-600",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Discount:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["-", formatCurrency(selectedOrder.discount, shop.currency ?? "INR")] })]
												}) : null,
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between font-bold text-sm border-t border-dashed pt-2 mt-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Grand Total:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-primary font-display",
														children: formatCurrency(selectedOrder.total, shop.currency ?? "INR")
													})]
												})
											]
										})
									]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "shadow-soft border-border/80 flex flex-col justify-center items-center p-12 text-center text-muted-foreground h-full min-h-[300px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "w-8 h-8 text-border mb-2" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs",
										children: "No invoice selected."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] mt-1 text-muted-foreground/80",
										children: "Click any row in the order history list on the left to review billing details."
									})
								]
							})
						})]
					})
				})
			]
		})]
	});
}
//#endregion
export { OrdersPage as component };
