import { o as __toESM } from "../_runtime.mjs";
import { C as onSnapshot, E as runTransaction, M as doc, O as updateDoc, P as serverTimestamp } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { i as getDb, t as COL } from "./firebase-BQC3oBr4.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-CjUebW4j.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-C8W-HuJg.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Input } from "./input-DgSC1K2-.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Button } from "./button-l9FdWCHm.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { At as CircleDashed, D as ShoppingBag, Et as Clock3, F as ReceiptText, It as ChefHat, j as Search, jt as CircleCheck, q as PackageCheck } from "../_libs/lucide-react.mjs";
import { i as normalizeMobile, r as isOrderArchived, t as findOrderByPublicId } from "./order-utils-CFPxZ7kp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tracking-BFUHdlGZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_STEPS = [
	{
		key: "pending",
		label: "Preparing",
		icon: CircleDashed
	},
	{
		key: "preparing",
		label: "Cooking",
		icon: ChefHat
	},
	{
		key: "ready",
		label: "Ready",
		icon: PackageCheck
	},
	{
		key: "completed",
		label: "Completed",
		icon: CircleCheck
	}
];
function TrackingPage() {
	const { shop } = useShop();
	const [mobile, setMobile] = (0, import_react.useState)("");
	const [orderIdInput, setOrderIdInput] = (0, import_react.useState)("");
	const [order, setOrder] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [activeStep, setActiveStep] = (0, import_react.useState)(0);
	const [lookupError, setLookupError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!order?.id) return;
		const unsub = onSnapshot(doc(getDb(), COL.orders, order.id), (snap) => {
			if (!snap.exists()) return;
			const data = snap.data();
			setOrder((current) => current ? {
				...current,
				...data,
				id: snap.id
			} : null);
		}, (error) => {
			setLookupError("Live updates are temporarily unavailable. Please refresh and try again.");
		});
		return () => unsub();
	}, [order?.id]);
	(0, import_react.useEffect)(() => {
		if (!order) return;
		const index = STATUS_STEPS.findIndex((step) => step.key === order.status);
		setActiveStep(index >= 0 ? index : 0);
	}, [order?.status]);
	const trackOrder = async () => {
		if (!shop) return;
		if (!mobile.trim() || !orderIdInput.trim()) {
			toast.error("Please enter the order ID and mobile number.");
			return;
		}
		setLoading(true);
		setLookupError(null);
		try {
			const db = getDb();
			const matched = await findOrderByPublicId(db, shop.id, orderIdInput);
			if (!matched) {
				setOrder(null);
				toast.error("No matching order was found for that Order ID.");
				return;
			}
			const data = matched.data();
			const normalizedMobile = normalizeMobile(mobile);
			const storedMobile = normalizeMobile(String(data.customerMobile || ""));
			if (storedMobile && storedMobile !== normalizedMobile) {
				setOrder(null);
				toast.error("No matching order was found for those details.");
				return;
			}
			if (!storedMobile) await updateDoc(doc(db, COL.orders, matched.id), {
				customerMobile: normalizedMobile,
				updatedAt: serverTimestamp()
			});
			const customerId = `${shop.id}_${normalizedMobile}`;
			const customerRef = doc(db, COL.customers, customerId);
			await runTransaction(db, async (tx) => {
				const existing = await tx.get(customerRef);
				if (existing.exists()) tx.update(customerRef, {
					name: data.customerName || existing.data().name || "Customer",
					mobile: normalizedMobile,
					lastVisit: serverTimestamp()
				});
				else tx.set(customerRef, {
					shopId: shop.id,
					mobile: normalizedMobile,
					name: data.customerName || "Customer",
					totalOrders: 1,
					totalSpending: data.total || 0,
					loyaltyPoints: Math.max(1, Math.floor((data.total || 0) / 100)),
					createdAt: serverTimestamp(),
					lastVisit: serverTimestamp()
				});
			});
			setOrder({
				id: matched.id,
				...data,
				orderNumber: data.orderNumber ?? 0,
				customerMobile: normalizedMobile
			});
			toast.success("Order found. Live tracking is now active.");
		} catch (error) {
			const message = "We could not look up that order right now. Please try again shortly.";
			setLookupError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};
	const archived = (0, import_react.useMemo)(() => order ? isOrderArchived(order) : false, [order]);
	const estimatedMinutes = (0, import_react.useMemo)(() => {
		if (!order?.items?.length) return 15;
		const computed = order.items.reduce((sum, item) => sum + (item.preparationTime ?? 10) * (item.quantity ?? 1), 0);
		return Math.max(15, Math.round(computed / 60));
	}, [order?.items]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 p-2 lg:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold text-slate-900",
						children: "Customer Tracking"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-slate-500",
						children: "Track the current kitchen progress with your order ID and mobile number."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "w-fit rounded-full bg-orange-500 px-3 py-1 text-[11px] font-semibold text-white",
						children: "Live status updates"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500",
							children: "Order ID"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: orderIdInput,
							onChange: (e) => setOrderIdInput(e.target.value.toUpperCase()),
							placeholder: "NX-8F4K2Q9M7Z",
							className: "h-10 rounded-2xl border-slate-200"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500",
							children: "Mobile Number"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: mobile,
							onChange: (e) => setMobile(e.target.value),
							placeholder: "Enter mobile number",
							className: "h-10 rounded-2xl border-slate-200"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: trackOrder,
							disabled: loading,
							className: "h-10 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-2 h-4 w-4" }), " Track Order"]
						})
					]
				}),
				lookupError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "mt-3 text-sm font-medium text-rose-600",
					children: lookupError
				})
			]
		}), !order ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center text-sm text-slate-500",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "h-6 w-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 font-semibold text-slate-700",
					children: "No active tracking session"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1",
					children: "Enter the order ID and mobile number to see the live kitchen progress for that order."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 xl:grid-cols-[1.05fr_0.95fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-0 bg-white p-0 shadow-[0_18px_45px_rgba(15,23,42,0.06)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "border-b border-slate-100 p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-lg font-semibold text-slate-900",
							children: "Live Progress Timeline"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
							className: "mt-1 text-sm text-slate-500",
							children: ["Order ", order.orderId || order.id]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: `rounded-full px-3 py-1 text-[11px] font-semibold ${order.status === "completed" ? "bg-emerald-600 text-white" : order.status === "cancelled" ? "bg-rose-600 text-white" : "bg-slate-900 text-white"}`,
							children: order.status || "pending"
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: STATUS_STEPS.map((step, index) => {
							const isActive = index <= activeStep;
							const Icon = step.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isActive ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 rounded-[16px] border border-slate-100 bg-slate-50/80 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-slate-900",
											children: step.label
										}), index === activeStep && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-semibold text-orange-700",
											children: "Current"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 text-sm text-slate-500",
										children: step.key === "pending" ? "Order received and queued in the kitchen" : step.key === "preparing" ? "Kitchen is actively cooking your order" : step.key === "ready" ? "Your food is ready for pickup" : "Your order has been completed successfully"
									})]
								})]
							}, step.key);
						})
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-0 bg-white p-0 shadow-[0_18px_45px_rgba(15,23,42,0.06)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "border-b border-slate-100 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-lg font-semibold text-slate-900",
						children: "Order Snapshot"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
						className: "mt-1 text-sm text-slate-500",
						children: "Current order details and kitchen timing"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[18px] border border-slate-100 bg-slate-50/70 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500",
									children: "Customer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 font-semibold text-slate-900",
									children: order.customerName || "Guest"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-sm text-slate-500",
									children: order.customerMobile || "No mobile captured yet"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[18px] border border-slate-100 bg-slate-50/70 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500",
									children: "Order Details"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-center justify-between text-sm text-slate-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Order ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-slate-900",
										children: order.orderId || order.id
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-center justify-between text-sm text-slate-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Items" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-slate-900",
										children: order.items?.length || 0
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-center justify-between text-sm text-slate-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-slate-900",
										children: ["₹", Number(order.total || 0).toFixed(0)]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[18px] border border-slate-100 bg-slate-50/70 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm font-semibold text-slate-900",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "h-4 w-4 text-orange-500" }), " Estimated time"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center justify-between text-sm text-slate-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ready in" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-slate-900",
									children: [
										"~",
										estimatedMinutes,
										" min"
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[18px] border border-slate-100 bg-slate-50/70 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm font-semibold text-slate-900",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4 text-orange-500" }), " Ordered items"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 space-y-2",
								children: (order.items || []).map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-slate-800",
										children: item.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-slate-500",
										children: ["Qty ", item.quantity]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs font-semibold text-slate-500",
										children: [item.quantity, " ×"]
									})]
								}, `${item.name}-${index}`))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[18px] border border-slate-100 bg-slate-50/70 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-sm font-semibold text-slate-900",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptText, { className: "h-4 w-4 text-orange-500" }), " Order timing"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-center justify-between text-sm text-slate-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Order time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-slate-900",
										children: order.createdAt ? new Date(order.createdAt.toMillis()).toLocaleString() : "—"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-center justify-between text-sm text-slate-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-slate-900",
										children: archived ? "Archived" : order.status || "pending"
									})]
								})
							]
						})
					]
				})]
			})]
		})]
	});
}
//#endregion
export { TrackingPage as component };
