import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-l9FdWCHm.mjs";
import { It as ChefHat, R as QrCode, Wt as Bell, _ as Ticket, jt as CircleCheck, l as Users, zt as ChartColumn } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B-ORQONO.js
var import_jsx_runtime = require_jsx_runtime();
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(182,124,47,0.18),_transparent_30%),_linear-gradient(135deg,_rgba(255,250,243,0.98),_rgba(248,239,228,0.96))]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-[#d8b46b]/40 bg-[rgba(255,250,243,0.82)] backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-8 h-8 rounded-lg gradient-hero flex items-center justify-center shadow-[0_8px_24px_-12px_rgba(74,15,15,0.45)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChefHat, { className: "w-4 h-4 text-primary-foreground" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display font-bold",
							children: "Nexavo POS"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								children: "Sign in"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							search: { mode: "signup" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								children: "Get started"
							})
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-32 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#efe0c6] text-[#6b1d1d] text-xs font-medium mb-6 border border-[#d8b46b]/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-success animate-pulse" }), "Smart Billing + Live Customer Order Tracking"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05]",
							children: "The complete POS platform for modern food businesses."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-lg text-muted-foreground max-w-2xl mx-auto",
							children: "Run billing, manage products, coordinate kitchen orders, send live customer updates and keep every transaction in Firebase. Set up in 60 seconds."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 flex gap-3 justify-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									search: { mode: "signup" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										className: "shadow-elev",
										children: "Launch Nexavo POS"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/downloads/nexavo-pos.apk",
									download: true,
									className: "inline-flex items-center justify-center gap-2 h-10 rounded-md px-8 text-sm font-semibold bg-primary text-primary-foreground shadow-elev transition-colors duration-75 hover:bg-primary/90 active:scale-95 active:opacity-90 will-change-transform",
									"aria-label": "Download Nexavo POS APK",
									children: "Download Now"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										variant: "outline",
										children: "Sign in"
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 text-xs text-muted-foreground",
							children: "All your POS workflows stay connected in one Firebase-powered workspace."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 -z-10 opacity-30 pointer-events-none gradient-hero blur-3xl rounded-full top-40 mx-auto max-w-2xl h-64" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "max-w-7xl mx-auto px-4 lg:px-8 py-20 grid md:grid-cols-3 gap-6",
				children: [
					{
						i: QrCode,
						t: "QR loyalty & tracking",
						d: "Generate shop and table QR codes for instant customer tracking."
					},
					{
						i: Bell,
						t: "Live kitchen updates",
						d: "Customers receive real-time status changes the moment orders move through the kitchen."
					},
					{
						i: ChartColumn,
						t: "Sales insights",
						d: "Watch daily, weekly and monthly revenue from the built-in reports view."
					},
					{
						i: Users,
						t: "Customer CRM",
						d: "Capture orders, spending and loyalty data for returning diners."
					},
					{
						i: Ticket,
						t: "Flexible billing",
						d: "Support cash, UPI, card and split payments from one POS screen."
					},
					{
						i: CircleCheck,
						t: "Firebase-backed",
						d: "Products, orders and payments stay synchronized in Firestore."
					}
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "gradient-card border border-border rounded-2xl p-6 shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.i, { className: "w-5 h-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display font-semibold text-lg",
							children: f.t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-1",
							children: f.d
						})
					]
				}, f.t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-7xl mx-auto px-4 lg:px-8 py-8 text-sm text-muted-foreground flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "© Nexavo POS" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Built with Firebase + React" })]
				})
			})
		]
	});
}
//#endregion
export { Landing as component };
