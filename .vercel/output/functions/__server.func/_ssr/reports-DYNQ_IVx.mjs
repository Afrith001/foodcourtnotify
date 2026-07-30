import { o as __toESM } from "../_runtime.mjs";
import { C as onSnapshot, T as query, j as collection, k as where } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { r as getDb, t as COL } from "./firebase-jX9Hxz-N.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-oa7pWA7o.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-ZV2o_Ft7.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as YAxis, d as Pie, f as Cell, h as Legend, l as CartesianGrid, m as Tooltip, n as PieChart, o as XAxis, p as ResponsiveContainer, s as Area, t as AreaChart } from "../_libs/recharts+[...].mjs";
import { t as Button } from "./button-ufo6MiTZ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Gt as ChartPie, H as Printer, Ot as Download, Qt as Award, h as TrendingUp, k as ShoppingBag, kt as DollarSign, l as Users } from "../_libs/lucide-react.mjs";
import { n as formatCurrency } from "./pos-BKnCkGZE.mjs";
import { a as startOfYear, c as startOfDay, i as format, o as startOfMonth, t as subDays } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-DYNQ_IVx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PIE_COLORS = [
	"#10b981",
	"#3b82f6",
	"#f59e0b",
	"#ef4444"
];
function ReportsPage() {
	const { shop } = useShop();
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [dateFilter, setDateFilter] = (0, import_react.useState)("week");
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		const db = getDb();
		const unsub = onSnapshot(query(collection(db, COL.orders), where("shopId", "==", shop.id)), (snap) => {
			setOrders(snap.docs.map((d) => d.data()));
		});
		const unsubCat = onSnapshot(query(collection(db, COL.categories), where("shopId", "==", shop.id)), (snap) => {
			setCategories(snap.docs.map((d) => ({
				id: d.id,
				name: d.data().name
			})));
		});
		return () => {
			unsub();
			unsubCat();
		};
	}, [shop]);
	const categoryMap = (0, import_react.useMemo)(() => {
		const map = {};
		categories.forEach((cat) => {
			map[cat.id] = cat.name;
		});
		return map;
	}, [categories]);
	const parsedOrders = (0, import_react.useMemo)(() => {
		return orders.map((o) => {
			const date = o.createdAt ? new Date(o.createdAt.toMillis()) : /* @__PURE__ */ new Date();
			return {
				...o,
				date,
				total: Number(o.total || 0)
			};
		});
	}, [orders]);
	const todayStart = (0, import_react.useMemo)(() => startOfDay(/* @__PURE__ */ new Date()), []);
	const yesterdayStart = (0, import_react.useMemo)(() => startOfDay(subDays(/* @__PURE__ */ new Date(), 1)), []);
	const weekStart = (0, import_react.useMemo)(() => startOfDay(subDays(/* @__PURE__ */ new Date(), 7)), []);
	const monthStart = (0, import_react.useMemo)(() => startOfMonth(/* @__PURE__ */ new Date()), []);
	const yearStart = (0, import_react.useMemo)(() => startOfYear(/* @__PURE__ */ new Date()), []);
	const stats = (0, import_react.useMemo)(() => {
		let todaySales = 0;
		let yesterdaySales = 0;
		let weekSales = 0;
		let monthSales = 0;
		let yearSales = 0;
		let cashSales = 0;
		let upiSales = 0;
		let cardSales = 0;
		let pendingCount = 0;
		let completedCount = 0;
		let cancelledCount = 0;
		let refundCount = 0;
		const uniqueMobiles = /* @__PURE__ */ new Set();
		let totalCompletedRevenue = 0;
		let totalCompletedCount = 0;
		const itemCounts = {};
		const catCounts = {};
		parsedOrders.forEach((o) => {
			const isCancelled = o.status === "cancelled";
			const isRefunded = o.status === "refunded";
			if (o.status === "pending") pendingCount++;
			else if (o.status === "completed" || o.status === "ready" || o.status === "preparing") completedCount++;
			else if (o.status === "cancelled") cancelledCount++;
			else if (o.status === "refunded") refundCount++;
			if (o.customerMobile) uniqueMobiles.add(o.customerMobile);
			if (!isCancelled && !isRefunded) {
				const orderDate = o.date;
				const totalVal = o.total;
				if (orderDate >= todayStart) todaySales += totalVal;
				if (orderDate >= yesterdayStart && orderDate < todayStart) yesterdaySales += totalVal;
				if (orderDate >= weekStart) weekSales += totalVal;
				if (orderDate >= monthStart) monthSales += totalVal;
				if (orderDate >= yearStart) yearSales += totalVal;
				if (o.payments && Array.isArray(o.payments)) o.payments.forEach((p) => {
					if (p.method === "cash") cashSales += Number(p.amount || 0);
					else if (p.method === "upi") upiSales += Number(p.amount || 0);
					else if (p.method === "card") cardSales += Number(p.amount || 0);
				});
				else if (o.paymentMethod === "cash") cashSales += totalVal;
				else if (o.paymentMethod === "upi") upiSales += totalVal;
				else if (o.paymentMethod === "card") cardSales += totalVal;
				totalCompletedRevenue += totalVal;
				totalCompletedCount++;
				if (Array.isArray(o.items)) o.items.forEach((item) => {
					const qty = Number(item.quantity || 1);
					if (!itemCounts[item.name]) itemCounts[item.name] = {
						quantity: 0,
						totalSales: 0
					};
					itemCounts[item.name].quantity += qty;
					itemCounts[item.name].totalSales += Number(item.price || 0) * qty;
					const catName = categoryMap[item.categoryId || ""] || "General";
					catCounts[catName] = (catCounts[catName] || 0) + qty;
				});
			}
		});
		const averageBill = totalCompletedCount > 0 ? totalCompletedRevenue / totalCompletedCount : 0;
		const topItems = Object.entries(itemCounts).map(([name, data]) => ({
			name,
			...data
		})).sort((a, b) => b.quantity - a.quantity);
		const topCats = Object.entries(catCounts).map(([name, quantity]) => ({
			name,
			quantity
		})).sort((a, b) => b.quantity - a.quantity);
		return {
			todaySales,
			yesterdaySales,
			weekSales,
			monthSales,
			yearSales,
			cashSales,
			upiSales,
			cardSales,
			pendingCount,
			completedCount,
			cancelledCount,
			refundCount,
			averageBill,
			totalCustomers: uniqueMobiles.size,
			topItems: topItems.slice(0, 5),
			topCats: topCats.slice(0, 5)
		};
	}, [
		parsedOrders,
		todayStart,
		yesterdayStart,
		weekStart,
		monthStart,
		yearStart,
		categoryMap
	]);
	const chartData = (0, import_react.useMemo)(() => {
		const dataMap = {};
		const now = /* @__PURE__ */ new Date();
		if (dateFilter === "week") {
			for (let i = 6; i >= 0; i--) {
				const d = subDays(now, i);
				dataMap[format(d, "EEE dd MMM")] = 0;
			}
			parsedOrders.forEach((o) => {
				if (o.status !== "cancelled" && o.status !== "refunded" && o.date >= weekStart) {
					const key = format(o.date, "EEE dd MMM");
					if (key in dataMap) dataMap[key] += o.total;
				}
			});
		} else if (dateFilter === "month") {
			for (let i = 29; i >= 0; i--) {
				const d = subDays(now, i);
				dataMap[format(d, "dd MMM")] = 0;
			}
			parsedOrders.forEach((o) => {
				const month30Days = startOfDay(subDays(now, 30));
				if (o.status !== "cancelled" && o.status !== "refunded" && o.date >= month30Days) {
					const key = format(o.date, "dd MMM");
					if (key in dataMap) dataMap[key] += o.total;
				}
			});
		} else {
			for (let i = 11; i >= 0; i--) {
				const d = subDays(now, i * 30);
				dataMap[format(d, "MMM yyyy")] = 0;
			}
			parsedOrders.forEach((o) => {
				if (o.status !== "cancelled" && o.status !== "refunded" && o.date >= yearStart) {
					const key = format(o.date, "MMM yyyy");
					if (key in dataMap) dataMap[key] += o.total;
				}
			});
		}
		return Object.entries(dataMap).map(([name, sales]) => ({
			name,
			sales
		}));
	}, [
		parsedOrders,
		dateFilter,
		weekStart,
		yearStart
	]);
	const paymentPieData = (0, import_react.useMemo)(() => {
		return [
			{
				name: "Cash",
				value: stats.cashSales
			},
			{
				name: "UPI",
				value: stats.upiSales
			},
			{
				name: "Card",
				value: stats.cardSales
			}
		].filter((item) => item.value > 0);
	}, [stats]);
	const exportCsv = () => {
		const headers = "Date,OrderId,Status,PaymentMethod,ItemsCount,TotalRevenue\n";
		const rows = parsedOrders.map((o) => {
			const dateStr = o.createdAt ? format(new Date(o.createdAt.toMillis()), "yyyy-MM-dd HH:mm") : "—";
			const itemsCount = o.items ? o.items.reduce((s, i) => s + (i.quantity || 1), 0) : 0;
			return `"${dateStr}","${o.orderId || ""}","${o.status}","${o.paymentMethod}",${itemsCount},${o.total}`;
		}).join("\n");
		const blob = new Blob([headers + rows], { type: "text/csv" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `sales_report_${format(/* @__PURE__ */ new Date(), "yyyy_MM_dd")}.csv`;
		link.click();
		toast.success("CSV export downloaded successfully");
	};
	if (!shop) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 print-content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            padding: 0 !important;
          }
          .print-content {
            margin: 0 !important;
            width: 100% !important;
          }
        }
      ` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-bold tracking-tight",
					children: "Sales Analytics Dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Comprehensive real-time financial reporting for ",
						shop.name,
						"."
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 no-print",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: exportCsv,
						className: "h-9",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), " Export CSV"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "default",
						size: "sm",
						onClick: () => window.print(),
						className: "h-9",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-2 h-4 w-4" }), " Export PDF"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
				children: [
					{
						title: "Today's Sales",
						amount: stats.todaySales,
						tone: "text-emerald-600 bg-emerald-50 border-emerald-100"
					},
					{
						title: "Yesterday's Sales",
						amount: stats.yesterdaySales,
						tone: "text-blue-600 bg-blue-50 border-blue-100"
					},
					{
						title: "Weekly Sales",
						amount: stats.weekSales,
						tone: "text-amber-600 bg-amber-50 border-amber-100"
					},
					{
						title: "Monthly Sales",
						amount: stats.monthSales,
						tone: "text-indigo-600 bg-indigo-50 border-indigo-100"
					},
					{
						title: "Yearly Sales",
						amount: stats.yearSales,
						tone: "text-rose-600 bg-rose-50 border-rose-100"
					}
				].map((range, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: `border ${range.tone} shadow-soft`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "p-3 pb-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold uppercase tracking-wider opacity-85",
							children: range.title
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-3 pt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xl font-bold font-display",
							children: formatCurrency(range.amount, shop.currency ?? "INR")
						})
					})]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-4",
				children: [
					{
						title: "Average Bill",
						value: formatCurrency(stats.averageBill, shop.currency ?? "INR"),
						desc: "Per order average spending",
						icon: DollarSign
					},
					{
						title: "Total Customers",
						value: stats.totalCustomers,
						desc: "Unique mobile check-ins",
						icon: Users
					},
					{
						title: "Popular Item",
						value: stats.topItems[0]?.name || "—",
						desc: "Most orders containing",
						icon: Award
					},
					{
						title: "Completed Orders",
						value: stats.completedCount,
						desc: "Successful checkouts",
						icon: ShoppingBag
					}
				].map((kpi, i) => {
					const Icon = kpi.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-soft border-border/70",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-muted-foreground",
										children: kpi.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xl font-bold leading-none",
										children: kpi.value
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block",
										children: kpi.desc
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-2 rounded-xl bg-primary/5 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-5 h-5" })
							})]
						})
					}, i);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[1.3fr_0.7fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft border-border/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "p-4 flex flex-row items-center justify-between border-b pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-sm font-semibold flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-primary" }), " Sales Over Time"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
							className: "text-xs",
							children: "Select range interval for chart summary."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1 no-print",
							children: [
								{
									id: "week",
									label: "7 Days"
								},
								{
									id: "month",
									label: "30 Days"
								},
								{
									id: "year",
									label: "12 Months"
								}
							].map((pill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: dateFilter === pill.id ? "default" : "outline",
								onClick: () => setDateFilter(pill.id),
								className: "h-8 text-xs px-2.5 rounded-full",
								children: pill.label
							}, pill.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-4 pt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full h-[280px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
									data: chartData,
									margin: {
										top: 10,
										right: 10,
										left: -20,
										bottom: 0
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
											id: "salesGrad",
											x1: "0",
											y1: "0",
											x2: "0",
											y2: "1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "5%",
												stopColor: "#ea580c",
												stopOpacity: .2
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "95%",
												stopColor: "#ea580c",
												stopOpacity: 0
											})]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											vertical: false,
											stroke: "#E5E7EB"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "name",
											fontSize: 9,
											tickLine: false,
											axisLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											fontSize: 9,
											tickLine: false,
											axisLine: false,
											tickFormatter: (val) => `₹${val}`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											formatter: (val) => [formatCurrency(Number(val), shop.currency ?? "INR"), "Sales"],
											contentStyle: {
												borderRadius: "10px",
												fontSize: "11px"
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
											type: "monotone",
											dataKey: "sales",
											stroke: "#ea580c",
											strokeWidth: 2,
											fillOpacity: 1,
											fill: "url(#salesGrad)"
										})
									]
								})
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft border-border/80 flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "p-4 border-b pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-sm font-semibold flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "w-4 h-4 text-primary" }), " Revenue by Payment Method"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
							className: "text-xs",
							children: "Comparison of Cash, Card, and UPI."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-4 flex-1 flex flex-col items-center justify-center min-h-[220px]",
						children: paymentPieData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full h-[220px] relative",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
										data: paymentPieData,
										cx: "50%",
										cy: "50%",
										innerRadius: 60,
										outerRadius: 80,
										paddingAngle: 4,
										dataKey: "value",
										children: paymentPieData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PIE_COLORS[index % PIE_COLORS.length] }, `cell-${index}`))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (val) => formatCurrency(Number(val), shop.currency ?? "INR") }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
										verticalAlign: "bottom",
										fontSize: 10,
										iconSize: 8,
										iconType: "circle"
									})
								] })
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground py-12",
							children: "No recorded sales data."
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft border-border/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "p-4 border-b pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-sm font-semibold flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-4 h-4 text-primary" }), " Top 5 Selling Products"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
							className: "text-xs",
							children: "Based on total item quantity sold."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4 space-y-3.5",
						children: [stats.topItems.map((item, i) => {
							const maxQty = stats.topItems[0]?.quantity || 1;
							const percent = item.quantity / maxQty * 100;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-muted-foreground",
											children: ["#", i + 1]
										}), item.name]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											item.quantity,
											" units · ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-emerald-600",
												children: formatCurrency(item.totalSales, shop.currency ?? "INR")
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full bg-muted h-2 rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-primary h-full rounded-full",
										style: { width: `${percent}%` }
									})
								})]
							}, i);
						}), !stats.topItems.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center text-xs text-muted-foreground py-10",
							children: "No items sold."
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft border-border/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "p-4 border-b pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-sm font-semibold flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "w-4 h-4 text-primary" }), " Order Status Breakdown"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
							className: "text-xs",
							children: "Aggregated counts of order statuses."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [
								{
									label: "Completed / Prep",
									count: stats.completedCount,
									color: "bg-emerald-500",
									textClass: "text-emerald-700 bg-emerald-50"
								},
								{
									label: "Pending",
									count: stats.pendingCount,
									color: "bg-amber-500",
									textClass: "text-amber-700 bg-amber-50"
								},
								{
									label: "Cancelled",
									count: stats.cancelledCount,
									color: "bg-red-500",
									textClass: "text-red-700 bg-red-50"
								},
								{
									label: "Refunded",
									count: stats.refundCount,
									color: "bg-indigo-500",
									textClass: "text-indigo-700 bg-indigo-50"
								}
							].map((status, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex flex-col p-3 rounded-xl border border-border/60 ${status.textClass}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold uppercase tracking-wider opacity-80",
									children: status.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xl font-bold font-display mt-0.5",
									children: status.count
								})]
							}, i))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 border-t pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3",
								children: "Top Selling Categories"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [stats.topCats.map((cat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "px-3 py-1 font-semibold flex items-center gap-1 bg-background",
									children: [
										cat.name,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-primary font-bold",
											children: [
												"(",
												cat.quantity,
												")"
											]
										})
									]
								}, i)), !stats.topCats.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "No categories data."
								})]
							})]
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
export { ReportsPage as component };
