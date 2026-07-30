import { o as __toESM } from "../_runtime.mjs";
import { C as onSnapshot, T as query, j as collection, k as where, x as getDocs, y as getCountFromServer } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { r as getDb, t as COL } from "./firebase-jX9Hxz-N.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-oa7pWA7o.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Button } from "./button-ufo6MiTZ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Wt as Check, a as Watch, k as ShoppingBag } from "../_libs/lucide-react.mjs";
import { n as generateQrDataUrl, t as buildPortalUrl } from "./qr-Cv02SMs8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-tLqJ4icn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const { shop } = useShop();
	const [qr, setQr] = (0, import_react.useState)("");
	const { t } = useTranslation();
	const [loadingStats, setLoadingStats] = (0, import_react.useState)(true);
	const [stats, setStats] = (0, import_react.useState)({
		total: 0,
		today: 0,
		pending: 0,
		preparing: 0,
		ready: 0,
		completed: 0,
		customers: 0,
		revenue: 0
	});
	(0, import_react.useEffect)(() => {
		document.title = `${t("common.dashboard")} · ${t("common.appName")}`;
	}, [t]);
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		generateQrDataUrl(buildPortalUrl(shop.shopCode), shop.themeColor).then(setQr);
	}, [shop]);
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		const db = getDb();
		let activeUnsub = () => {};
		let todayUnsub = () => {};
		let isCancelled = false;
		(async () => {
			try {
				setLoadingStats(true);
				const customersCountSnap = await getCountFromServer(query(collection(db, COL.customers), where("shopId", "==", shop.id)));
				if (isCancelled) return;
				const totalCustomers = customersCountSnap.data().count;
				const allOrdersSnap = await getDocs(query(collection(db, COL.orders), where("shopId", "==", shop.id)));
				if (isCancelled) return;
				const allOrdersList = allOrdersSnap.docs.map((d) => d.data());
				const today = /* @__PURE__ */ new Date();
				today.setHours(0, 0, 0, 0);
				const histOrders = allOrdersList.filter((o) => {
					return (o.createdAt?.toMillis?.() ?? 0) < today.getTime() && o.status !== "Waiting";
				});
				const histOrdersCount = histOrders.length;
				const histRevenue = histOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
				setStats({
					total: allOrdersList.filter((o) => o.status !== "Waiting").length,
					today: allOrdersList.filter((o) => {
						return (o.createdAt?.toMillis?.() ?? 0) >= today.getTime() && o.status !== "Waiting";
					}).length,
					pending: allOrdersList.filter((o) => o.status === "pending").length,
					preparing: allOrdersList.filter((o) => o.status === "preparing").length,
					ready: allOrdersList.filter((o) => o.status === "ready").length,
					completed: allOrdersList.filter((o) => o.status === "completed").length,
					customers: totalCustomers,
					revenue: allOrdersList.filter((o) => o.status !== "Waiting").reduce((sum, o) => sum + Number(o.total || 0), 0)
				});
				setLoadingStats(false);
				const todayQ = query(collection(db, COL.orders), where("shopId", "==", shop.id), where("createdAt", ">=", today));
				const activeQ = query(collection(db, COL.orders), where("shopId", "==", shop.id), where("status", "in", [
					"pending",
					"preparing",
					"ready"
				]));
				const todayOrdersMap = /* @__PURE__ */ new Map();
				const activeOrdersMap = /* @__PURE__ */ new Map();
				const updateLiveStats = () => {
					const merged = /* @__PURE__ */ new Map();
					todayOrdersMap.forEach((v, k) => merged.set(k, v));
					activeOrdersMap.forEach((v, k) => merged.set(k, v));
					const orderRows = Array.from(merged.values());
					const liveTodayOrders = orderRows.filter((r) => {
						return (r.createdAt?.toMillis?.() ?? 0) >= today.getTime() && r.status !== "Waiting";
					});
					const liveTodayOrdersCount = liveTodayOrders.length;
					const liveTodayRevenue = liveTodayOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
					setStats((prev) => ({
						...prev,
						total: histOrdersCount + liveTodayOrdersCount,
						today: liveTodayOrdersCount,
						revenue: histRevenue + liveTodayRevenue,
						pending: orderRows.filter((r) => r.status === "pending").length,
						preparing: orderRows.filter((r) => r.status === "preparing").length,
						ready: orderRows.filter((r) => r.status === "ready").length,
						completed: orderRows.filter((r) => r.status === "completed" && (r.createdAt?.toMillis?.() ?? 0) >= today.getTime()).length
					}));
				};
				todayUnsub = onSnapshot(todayQ, (snap) => {
					snap.docChanges().forEach((change) => {
						if (change.type === "removed") todayOrdersMap.delete(change.doc.id);
						else todayOrdersMap.set(change.doc.id, change.doc.data());
					});
					updateLiveStats();
				}, (err) => {
					console.error("todayQ listener error:", err);
				});
				activeUnsub = onSnapshot(activeQ, (snap) => {
					snap.docChanges().forEach((change) => {
						if (change.type === "removed") activeOrdersMap.delete(change.doc.id);
						else activeOrdersMap.set(change.doc.id, change.doc.data());
					});
					updateLiveStats();
				}, (err) => {
					console.error("activeQ listener error:", err);
				});
			} catch (err) {
				console.error("Error loading dashboard statistics:", err);
				if (!isCancelled) setLoadingStats(false);
			}
		})();
		return () => {
			isCancelled = true;
			activeUnsub();
			todayUnsub();
		};
	}, [shop]);
	if (!shop) return null;
	const portalUrl = buildPortalUrl(shop.shopCode);
	const copyUrl = async () => {
		await navigator.clipboard.writeText(portalUrl);
		toast.success("Portal URL copied");
	};
	const downloadQr = () => {
		const a = document.createElement("a");
		a.href = qr;
		a.download = `${shop.shopCode}-qr.png`;
		a.click();
	};
	stats.total, stats.today, stats.customers, `${stats.revenue.toFixed(0)}`;
	const statusStages = [
		{
			key: "pending",
			label: "Pending",
			icon: Watch,
			color: "amber"
		},
		{
			key: "preparing",
			label: "Preparing",
			icon: ShoppingBag,
			color: "sky"
		},
		{
			key: "ready",
			label: "Ready for Pickup",
			icon: ShoppingBag,
			color: "orange"
		},
		{
			key: "completed",
			label: "Completed",
			icon: Check,
			color: "emerald"
		}
	];
	const stageCounts = {
		pending: stats.pending,
		preparing: stats.preparing,
		ready: stats.ready,
		completed: stats.completed
	};
	const activeStage = statusStages.reduce((index, stage, idx) => {
		if (stageCounts[stage.key] > 0) return idx;
		return index;
	}, -1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#FDF6E9] p-4 lg:p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-[2rem] bg-white/90 p-8 shadow-[0_24px_60px_rgba(111,65,54,0.12)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm uppercase tracking-[0.3em] text-[#8B5E58]",
							children: "Good morning"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-3 text-4xl md:text-5xl font-serif font-semibold leading-tight text-[#2B0F12]",
							children: ["Good Morning, ", shop.name]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-2xl text-sm text-[#6F4A44]",
							children: "Welcome back. Here is your warm bistro dashboard with the latest insight into orders, revenue, and customer activity."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "rounded-[2rem] bg-white/90 p-6 shadow-[0_16px_45px_rgba(111,65,54,0.1)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-6 top-1/2 h-[2px] bg-[#E8D7C3]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 sm:grid-cols-4 gap-6 relative",
							children: statusStages.map((stage, idx) => {
								const filled = idx <= activeStage;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 ${filled ? "border-[#B96A24] bg-[#F5E0C7]" : "border-[#E8D7C3] bg-white"} shadow-sm`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(stage.icon, { className: `w-7 h-7 ${filled ? "text-[#B96A24]" : "text-[#A37A6E]"}` })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-4 text-sm font-medium text-[#5A2C2C]",
										children: stage.label
									})]
								}, stage.key);
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid gap-6 lg:grid-cols-[1.7fr_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 grid-cols-1 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#F3D9A5] via-[#EACB94] to-[#F7E2C0] p-6 shadow-[0_18px_50px_rgba(202,138,93,0.18)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute right-4 top-4 text-[5rem] font-serif text-[#F5E1C2] opacity-40",
									children: "₹"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative z-10",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-[#6A3B24]",
											children: "Revenue"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-10 text-5xl font-serif font-semibold text-[#3E1D10]",
											children: ["₹", stats.revenue.toFixed(0)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 text-xs uppercase tracking-[0.24em] text-[#6A3B24]/80 flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Last 7 days" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-white/90 px-3 py-1 text-[#6A3B24]",
												children: "Trend"
											})]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#F2D6DE] to-[#E8D6E0] p-6 shadow-[0_18px_50px_rgba(180,109,142,0.14)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute right-4 top-4 text-[5rem] text-[#F6D5E0] opacity-40",
									children: "🛒"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative z-10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-[#5B2E3C]",
										children: "Total Orders"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-8 text-4xl font-semibold text-[#3D1F27]",
										children: stats.total
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#F9E7D9] to-[#F2D8C2] p-6 shadow-[0_18px_50px_rgba(204,145,101,0.12)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-6 top-6 w-32 h-32 rounded-3xl bg-white/90 blur-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative z-10",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-[#6A4A39]",
											children: "QR Code"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-6 flex items-center justify-center rounded-3xl bg-white p-4 shadow-inner",
											children: qr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: qr,
												alt: "QR",
												className: "w-32 h-32 rounded-2xl"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-32 h-32 rounded-2xl bg-slate-100 animate-pulse" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-4 text-sm text-[#5B3F30]",
											children: "Scan as QR code"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#D7ECF7] to-[#E8F3FB] p-6 shadow-[0_18px_50px_rgba(119,153,183,0.14)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute right-6 top-4 text-[4.5rem] text-[#B7D6EB] opacity-40",
									children: "👥"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative z-10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-[#38607A]",
										children: "New Customers"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-8 text-4xl font-semibold text-[#1D3A4D]",
										children: stats.customers
									})]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#DCEFD8] to-[#E9F6E9] p-6 shadow-[0_18px_50px_rgba(107,151,118,0.14)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute right-6 top-4 text-[4.5rem] text-[#CFE7D1] opacity-40",
								children: "📋"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-[#3F5B3E]",
									children: "Today's Orders"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-8 text-4xl font-semibold text-[#2A4330]",
									children: stats.today
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#F5F0E0] to-[#EDE2CB] p-6 shadow-[0_18px_50px_rgba(175,133,97,0.12)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute left-4 top-4 rounded-full bg-white/90 p-3 text-[#A67A4D]",
								children: "💠"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-[#69543E]",
										children: "Customer portal"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 rounded-3xl bg-white p-4 text-sm text-[#5F4A3B] break-all",
										children: portalUrl
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											onClick: copyUrl,
											variant: "outline",
											size: "sm",
											children: "Copy"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											onClick: downloadQr,
											size: "sm",
											disabled: !qr,
											children: "Download"
										})]
									})
								]
							})]
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { Dashboard as component };
