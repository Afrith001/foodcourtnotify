import { o as __toESM } from "../_runtime.mjs";
import { C as onSnapshot, M as doc, O as updateDoc, S as limit, T as query, j as collection, k as where, w as orderBy } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { c as signOut } from "../_libs/firebase__auth.mjs";
import { i as getDb, o as getFirebaseAuth, t as COL } from "./firebase-BQC3oBr4.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-CjUebW4j.mjs";
import { n as CardContent, t as Card } from "./card-C8W-HuJg.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-l9FdWCHm.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Ht as CalendarDays, jt as CircleCheck, w as Sparkles } from "../_libs/lucide-react.mjs";
import { o as notifyOrderStatusChange } from "./order-utils-CFPxZ7kp.mjs";
import { i as format, l as startOfDay, s as endOfDay, t as subDays } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kitchen-Ccjh5Pfz.js
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
	const navigate = useNavigate();
	const { shop } = useShop();
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [flashingOrderIds, setFlashingOrderIds] = (0, import_react.useState)([]);
	const [tick, setTick] = (0, import_react.useState)(Date.now());
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"));
	const [filterMode, setFilterMode] = (0, import_react.useState)("today");
	const [expandedStages, setExpandedStages] = (0, import_react.useState)({});
	const seenOrderIdsRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const audioContextRef = (0, import_react.useRef)(null);
	const dateInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		const unsub = onSnapshot(query(collection(getDb(), COL.orders), where("shopId", "==", shop.id), orderBy("createdAt", "desc"), limit(100)), (snap) => {
			const nextOrders = snap.docs.map((d) => ({
				id: d.id,
				...d.data()
			})).filter((order) => order.status !== "Waiting" && order.status !== "cancelled").sort((a, b) => Number(b.createdAt?.seconds ?? 0) - Number(a.createdAt?.seconds ?? 0));
			const incomingIds = nextOrders.filter((order) => !seenOrderIdsRef.current.has(order.id)).map((order) => order.id);
			if (incomingIds.length > 0) {
				incomingIds.forEach((id) => seenOrderIdsRef.current.add(id));
				setFlashingOrderIds((prev) => Array.from(new Set([...prev, ...incomingIds])));
				playArrivalChime();
			}
			setOrders(nextOrders);
		});
		return () => unsub();
	}, [shop]);
	(0, import_react.useEffect)(() => {
		if (!flashingOrderIds.length) return;
		const timeoutId = window.setTimeout(() => setFlashingOrderIds([]), 4e3);
		return () => window.clearTimeout(timeoutId);
	}, [flashingOrderIds]);
	(0, import_react.useEffect)(() => {
		const timerId = window.setInterval(() => setTick(Date.now()), 15e3);
		return () => window.clearInterval(timerId);
	}, []);
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
	const handleLogout = async () => {
		try {
			await signOut(getFirebaseAuth());
			navigate({ to: "/auth" });
		} catch (error) {
			toast.error(error.message);
		}
	};
	const formatElapsed = (createdAt) => {
		if (!createdAt?.toDate) return "Just now";
		const created = createdAt.toDate();
		const diffMs = Date.now() - created.getTime();
		const diffMinutes = Math.max(0, Math.floor(diffMs / 6e4));
		if (diffMinutes < 1) return "Just now";
		if (diffMinutes < 60) return `${diffMinutes}m ago`;
		return `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m ago`;
	};
	const getSelectedDateValue = () => {
		const [year, month, day] = selectedDate.split("-").map(Number);
		return new Date(year, month - 1, day);
	};
	const isOrderOnSelectedDate = (createdAt) => {
		const value = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
		const start = startOfDay(getSelectedDateValue());
		const end = endOfDay(getSelectedDateValue());
		return value >= start && value <= end;
	};
	const handleQuickFilter = (mode, value) => {
		setFilterMode(mode);
		if (value) {
			setSelectedDate(value);
			return;
		}
		if (mode === "today") setSelectedDate(format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"));
		else if (mode === "yesterday") setSelectedDate(format(subDays(/* @__PURE__ */ new Date(), 1), "yyyy-MM-dd"));
	};
	const openDatePicker = () => {
		dateInputRef.current?.showPicker?.();
		dateInputRef.current?.click();
	};
	const playArrivalChime = () => {
		if (typeof window === "undefined") return;
		const AudioCtor = window.AudioContext || window.webkitAudioContext;
		if (!AudioCtor) return;
		const ctx = audioContextRef.current ?? new AudioCtor();
		audioContextRef.current = ctx;
		if (ctx.state === "suspended") ctx.resume();
		const now = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "triangle";
		osc.frequency.setValueAtTime(880, now);
		osc.frequency.exponentialRampToValueAtTime(660, now + .16);
		gain.gain.setValueAtTime(.001, now);
		gain.gain.exponentialRampToValueAtTime(.14, now + .04);
		gain.gain.exponentialRampToValueAtTime(.001, now + .28);
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start(now);
		osc.stop(now + .3);
	};
	if (!shop) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(182,124,47,0.16),_transparent_28%),_linear-gradient(135deg,_rgba(255,250,243,0.98),_rgba(248,239,228,0.95))] p-2 sm:p-4 lg:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-7xl flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3 rounded-[28px] border border-border/70 bg-card/90 p-4 shadow-soft sm:p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Kitchen display"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-display text-3xl font-semibold sm:text-4xl",
							children: "Live kitchen workflow"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base",
							children: "New orders appear instantly, flash for staff attention, and stay easy to read from a distance."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border/70 bg-muted/70 px-4 py-3 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-semibold text-foreground",
								children: [orders.length, " active orders"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1",
								children: ["Updated ", new Date(tick).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: handleLogout,
							children: "Logout"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[24px] border border-border/70 border-b-[3px] border-b-[#d8b46b]/50 bg-[linear-gradient(135deg,_rgba(255,250,243,0.98),_rgba(248,239,228,0.95))] p-3 shadow-soft sm:p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-h-[44px] items-center gap-2 rounded-full border border-[#d8b46b]/50 bg-[#fffaf3]/90 px-3 py-2 text-sm font-medium text-[#6b1d1d]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Filter by date" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `min-h-[44px] rounded-full border px-4 py-2 text-sm font-semibold transition-all ${filterMode === "today" ? "border-[#6b1d1d] bg-[#6b1d1d] text-[#fffaf3] shadow-sm" : "border-[#d8b46b]/60 bg-transparent text-[#6b1d1d] hover:bg-[#fff7e8]"}`,
								onClick: () => handleQuickFilter("today"),
								children: "Today"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `min-h-[44px] rounded-full border px-4 py-2 text-sm font-semibold transition-all ${filterMode === "yesterday" ? "border-[#6b1d1d] bg-[#6b1d1d] text-[#fffaf3] shadow-sm" : "border-[#d8b46b]/60 bg-transparent text-[#6b1d1d] hover:bg-[#fff7e8]"}`,
								onClick: () => handleQuickFilter("yesterday"),
								children: "Yesterday"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: openDatePicker,
									className: `flex min-h-[44px] items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-all ${filterMode === "custom" ? "border-[#6b1d1d] bg-[#6b1d1d] text-[#fffaf3] shadow-sm" : "border-[#d8b46b]/60 bg-[#fffaf3] text-[#6b1d1d] hover:bg-[#fff7e8]"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: filterMode === "custom" ? format(getSelectedDateValue(), "d MMM yyyy") : "Custom date" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: dateInputRef,
									type: "date",
									value: selectedDate,
									onChange: (event) => {
										setSelectedDate(event.target.value);
										setFilterMode("custom");
									},
									className: "absolute inset-0 h-full w-full cursor-pointer opacity-0"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 text-sm font-medium text-[#7c5f48]",
						children: ["Showing orders for ", format(getSelectedDateValue(), "d MMM yyyy")]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 xl:grid-cols-4",
					children: stages.map((stage) => {
						const stageOrders = orders.filter((order) => order.status === stage.key && isOrderOnSelectedDate(order.createdAt));
						const isExpanded = expandedStages[stage.key] ?? false;
						const visibleOrders = isExpanded ? stageOrders : stageOrders.slice(0, 6);
						const showMoreControl = stageOrders.length > 6;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-semibold",
									children: stage.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									children: stageOrders.length
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [visibleOrders.map((order) => {
									const isFlashing = flashingOrderIds.includes(order.id);
									const nextStage = stages[stages.findIndex((item) => item.key === stage.key) + 1];
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: isFlashing ? "border-amber-500 bg-amber-50/80 shadow-[0_0_0_4px_rgba(245,158,11,0.2)]" : "border-border/70 bg-card/95 shadow-soft",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "space-y-4 p-4 sm:p-5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-start justify-between gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground",
														children: ["Order #", order.orderNumber || order.orderId || order.id]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-1 text-xl font-semibold text-foreground",
														children: order.orderId || order.id
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "rounded-2xl bg-muted/80 px-3 py-2 text-right text-sm text-muted-foreground",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "font-semibold text-foreground",
															children: formatElapsed(order.createdAt)
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[11px] uppercase tracking-[0.2em]",
															children: "Placed"
														})]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap gap-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "secondary",
															children: order.orderType || "Dine-In"
														}),
														order.tableNumber ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
															variant: "secondary",
															children: ["Table ", order.tableNumber]
														}) : null,
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															className: "bg-amber-500/10 text-amber-800",
															children: stage.label
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-2xl border border-border/70 bg-background/70 p-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground",
														children: "Items"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
														className: "mt-2 space-y-2",
														children: order.items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
															className: "rounded-xl bg-card px-3 py-2 text-sm font-semibold text-foreground",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex items-start justify-between gap-3",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
																	item.quantity,
																	" × ",
																	item.name
																] }), item.variant ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
																	children: item.variant
																}) : null]
															}), item.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "mt-1 text-sm text-muted-foreground",
																children: ["Note: ", item.notes]
															}) : null]
														}, `${order.id}-${index}`))
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between rounded-2xl border border-border/70 bg-muted/60 px-3 py-2 text-sm",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-foreground",
														children: "Total"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-lg font-semibold text-foreground",
														children: ["₹", Number(order.total || 0).toFixed(0)]
													})]
												}),
												stage.key !== "completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													className: "h-12 w-full text-base",
													onClick: () => advance(order.id, nextStage?.key ?? "completed"),
													children: ["Mark ", nextStage?.label ?? "Completed"]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-3 py-3 text-sm font-semibold text-emerald-700",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Completed"]
												})
											]
										})
									}, order.id);
								}), showMoreControl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									className: "w-full text-sm",
									onClick: () => setExpandedStages((prev) => ({
										...prev,
										[stage.key]: !prev[stage.key]
									})),
									children: isExpanded ? "Show less" : "Show more"
								}) : null]
							})]
						}, stage.key);
					})
				})
			]
		})
	});
}
//#endregion
export { KitchenPage as component };
