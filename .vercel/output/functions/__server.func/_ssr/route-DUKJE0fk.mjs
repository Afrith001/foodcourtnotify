import { o as __toESM } from "../_runtime.mjs";
import { D as setDoc, M as doc } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { c as signOut } from "../_libs/firebase__auth.mjs";
import { a as getFirebaseApp, i as getDb, o as getFirebaseAuth, r as firebaseConfigured, t as COL } from "./firebase-BQC3oBr4.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { i as useShopState, n as useAuth, r as useShop, t as ShopProvider } from "./useShop-CjUebW4j.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useLocation } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as i18n_default } from "./i18n-BnUAatYi.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Toaster$1 } from "./sonner-DoFKumIW.mjs";
import { $ as Menu, E as ShoppingCart, F as ReceiptText, Ft as ChevronDown, G as Palette, K as Package, Mt as ChevronUp, R as QrCode, S as Store, V as Phone, X as Moon, c as UtensilsCrossed, ct as LayoutDashboard, d as UserCog, dt as Image, ft as Images, k as Settings, l as Users, lt as Languages, n as X, ot as LogOut, rt as MapPinned, vt as FileText, x as Sun, y as Tags, zt as ChartColumn } from "../_libs/lucide-react.mjs";
import { n as getToken, r as onMessage, t as getMessagingInWindow } from "../_libs/firebase__messaging.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-DUKJE0fk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var items = [
	{
		to: "/dashboard",
		icon: LayoutDashboard,
		label: "Dashboard"
	},
	{
		to: "/billing",
		icon: ReceiptText,
		label: "Billing"
	},
	{
		to: "/products",
		icon: Package,
		label: "Products"
	},
	{
		to: "/categories",
		icon: Tags,
		label: "Categories"
	},
	{
		to: "/orders",
		icon: ShoppingCart,
		label: "Orders"
	},
	{
		to: "/tracking",
		icon: MapPinned,
		label: "Tracking"
	},
	{
		to: "/customers",
		icon: Users,
		label: "Customers"
	},
	{
		to: "/qr",
		icon: QrCode,
		label: "QR"
	},
	{
		to: "/reports",
		icon: ChartColumn,
		label: "Reports"
	},
	{
		to: "/staff",
		icon: UserCog,
		label: "Staff"
	},
	{
		to: "/settings",
		icon: Settings,
		label: "Settings"
	}
];
var restaurantSubItems = [
	{
		to: "/restaurant",
		hash: "branding",
		icon: Image,
		label: "Branding"
	},
	{
		to: "/restaurant",
		hash: "details",
		icon: FileText,
		label: "Details"
	},
	{
		to: "/restaurant",
		hash: "gallery",
		icon: Images,
		label: "Gallery"
	},
	{
		to: "/restaurant",
		hash: "contact",
		icon: Phone,
		label: "Contact"
	},
	{
		to: "/restaurant",
		hash: "theme",
		icon: Palette,
		label: "Theme"
	}
];
function AppSidebar({ className, onNavigate }) {
	const { shop } = useShopState();
	const shopRole = shop?.role ?? null;
	const loc = useLocation();
	const navigate = useNavigate();
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [restaurantOpen, setRestaurantOpen] = (0, import_react.useState)(loc.pathname.startsWith("/restaurant"));
	(0, import_react.useEffect)(() => {
		const hashValue = loc.hash ? loc.hash.replace(/^#/, "") : "";
		setRestaurantOpen(loc.pathname.startsWith("/restaurant") || !!hashValue);
	}, [loc.pathname, loc.hash]);
	const navigateToRestaurantHash = (hash, closeMobile = false) => {
		if (closeMobile) setMobileOpen(false);
		setRestaurantOpen(true);
		onNavigate?.();
		navigate({
			to: "/restaurant",
			hash: () => hash
		});
	};
	const visibleItems = items.filter((item) => {
		if (!shopRole || ["owner", "admin"].includes(shopRole)) return true;
		if (shopRole === "kitchen") return ["/kitchen"].includes(item.to);
		if (shopRole === "cashier") return [
			"/billing",
			"/orders",
			"/settings"
		].includes(item.to);
		return false;
	});
	const handleSignOut = async () => {
		await signOut(getFirebaseAuth());
		navigate({ to: "/auth" });
	};
	const NavItem = ({ to, icon: Icon, label }) => {
		const active = to === "/billing" ? loc.pathname === "/billing" : loc.pathname.startsWith(to);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to,
			onClick: () => onNavigate?.(),
			className: cn("flex flex-col items-center gap-1.5 py-2.5 text-[11px] font-semibold transition-all duration-200 border-l-[3px] w-full text-center relative", active ? "border-[#6b1d1d] text-[#6b1d1d] font-bold" : "border-transparent text-[#7c5f48] hover:text-[#4a0f0f]"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("w-5 h-5 shrink-0", active ? "text-[#6b1d1d]" : "text-[#7c5f48]") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "leading-tight px-1 max-w-[85px]",
				children: label
			})]
		});
	};
	const MobileNavItem = ({ to, icon: Icon, label }) => {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to,
			onClick: () => {
				setMobileOpen(false);
				onNavigate?.();
			},
			className: cn("flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-bold", loc.pathname.startsWith(to) ? "bg-[#efe0c6] text-[#6b1d1d]" : "text-[#5d4432]"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" }), label]
		}, to);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			"aria-label": "Open navigation",
			onClick: () => setMobileOpen(true),
			className: "fixed right-4 top-3 z-40 grid h-12 w-12 place-items-center rounded-2xl border border-[#d8b46b]/60 bg-[#fffaf3] text-[#6b1d1d] shadow-sm md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
		}),
		mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 bg-slate-950/35 md:hidden pointer-events-auto",
			onClick: () => setMobileOpen(false),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "h-full w-[min(320px,85vw)] overflow-y-auto overscroll-contain border-r border-[#d8b46b]/40 bg-[#fffaf3] p-4 shadow-2xl touch-pan-y",
				onClick: (event) => event.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-5 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg font-black text-slate-900",
							children: "Menu"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-label": "Close navigation",
							onClick: () => setMobileOpen(false),
							className: "grid h-12 w-12 place-items-center rounded-2xl bg-slate-100",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "space-y-1",
						children: [
							visibleItems.slice(0, 7).map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileNavItem, { ...it }, it.to)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-3 border-t border-slate-100" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-expanded": restaurantOpen,
								onClick: () => setRestaurantOpen(!restaurantOpen),
								className: cn("flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 text-sm font-bold justify-between", loc.pathname.startsWith("/restaurant") ? "bg-orange-50 text-orange-600" : "text-slate-700"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-5 w-5" }), "Restaurant Information"]
								}), restaurantOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })]
							}), restaurantOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ml-4 mt-1 space-y-0.5 border-l-2 border-orange-100 pl-3",
								children: restaurantSubItems.map((sub) => {
									const active = loc.pathname === sub.to && loc.hash.replace(/^#/, "") === sub.hash;
									const SubIcon = sub.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => navigateToRestaurantHash(sub.hash, true),
										className: cn("flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-left", active ? "bg-orange-50 text-orange-600" : "text-slate-600 hover:text-slate-900"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubIcon, { className: "h-4 w-4" }), sub.label]
									}, sub.label);
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-3 border-t border-slate-100" }),
							visibleItems.slice(7).map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileNavItem, { ...it }, it.to))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleSignOut,
						className: "mt-6 flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 text-sm font-bold text-rose-600",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-5 w-5" }), "Logout"]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: cn("hidden lg:flex w-24 xl:w-28 shrink-0 flex-col border-r border-[#d8b46b]/50 bg-[#fffaf3] py-4 justify-between overflow-y-auto overscroll-contain touch-pan-y", className),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex-1 flex flex-col gap-6 items-stretch px-0",
				children: [
					visibleItems.slice(0, 7).map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, { ...it }, it.to)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3/4 mx-auto border-t border-slate-200" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-stretch px-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-expanded": restaurantOpen,
							onClick: () => setRestaurantOpen(!restaurantOpen),
							className: cn("relative z-20 flex flex-col items-center gap-1.5 py-2.5 text-[11px] font-semibold transition-all duration-200 border-l-[3px] w-full text-center", loc.pathname.startsWith("/restaurant") ? "border-orange-500 text-orange-600 font-bold" : "border-transparent text-slate-500 hover:text-slate-900"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: cn("w-5 h-5 shrink-0", loc.pathname.startsWith("/restaurant") ? "text-orange-500" : "text-slate-500") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "leading-tight px-1 max-w-[85px]",
									children: "Restaurant"
								}),
								restaurantOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "w-3 h-3 mt-0.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-3 h-3 mt-0.5" })
							]
						}), restaurantOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col items-stretch mt-1",
							children: restaurantSubItems.map((sub) => {
								const active = loc.pathname === sub.to && loc.hash.replace(/^#/, "") === sub.hash;
								const SubIcon = sub.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => navigateToRestaurantHash(sub.hash),
									className: cn("flex flex-col items-center gap-1 py-1.5 text-[10px] font-medium transition-all duration-200 w-full text-center", active ? "text-orange-600 font-bold" : "text-slate-400 hover:text-slate-700"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubIcon, { className: cn("w-4 h-4 shrink-0", active ? "text-orange-500" : "text-slate-400") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "leading-tight px-1 max-w-[80px]",
										children: sub.label
									})]
								}, sub.label);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3/4 mx-auto border-t border-slate-200" }),
					visibleItems.slice(7).map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, { ...it }, it.to))
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3 border-t border-slate-100 pt-4 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleSignOut,
					className: "flex flex-col items-center gap-1.5 py-2 text-[11px] font-semibold text-slate-500 hover:text-rose-600 transition-colors w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-5 h-5 text-slate-500 hover:text-rose-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Logout" })]
				})
			})]
		})
	] });
}
function useTheme() {
	const [theme, setTheme] = (0, import_react.useState)("light");
	(0, import_react.useEffect)(() => {
		const initial = (typeof window !== "undefined" && localStorage.getItem("theme")) ?? (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");
		setTheme(initial);
		document.documentElement.classList.toggle("dark", initial === "dark");
	}, []);
	const toggle = () => {
		setTheme((prev) => {
			const next = prev === "dark" ? "light" : "dark";
			document.documentElement.classList.toggle("dark", next === "dark");
			localStorage.setItem("theme", next);
			return next;
		});
	};
	return {
		theme,
		toggle
	};
}
function TopBar() {
	const { shop } = useShop();
	const navigate = useNavigate();
	const { theme, toggle: toggleTheme } = useTheme();
	const handleSignOut = async () => {
		await signOut(getFirebaseAuth());
		navigate({ to: "/auth" });
	};
	const toggleLanguage = () => {
		const nextLang = (i18n_default.language || "en").startsWith("ta") ? "en" : "ta";
		i18n_default.changeLanguage(nextLang);
	};
	if (!shop) return null;
	const currentLangLabel = (i18n_default.language || "en").startsWith("ta") ? "தமிழ்" : "EN";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "h-20 border-b border-[#d8b46b]/50 bg-[linear-gradient(135deg,_rgba(255,250,243,0.98),_rgba(243,228,200,0.95))] flex items-center justify-between px-6 sticky top-0 z-40 select-none backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-10 h-10 rounded-xl bg-[#efe0c6] border border-[#d8b46b]/70 flex items-center justify-center shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "w-5 h-5 text-[#6b1d1d]" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] font-semibold text-[#7c5f48] uppercase tracking-widest leading-none",
					children: "Restaurant Name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-base font-bold text-[#4a0f0f] uppercase tracking-tight mt-0.5",
					children: shop.name
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: toggleLanguage,
					title: "Toggle Language",
					className: "flex items-center gap-1.5 px-3 h-10 rounded-xl text-[#6b1d1d] hover:bg-[#f5ebdc] border border-[#d8b46b]/60 transition-colors text-xs font-bold focus:outline-none cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "w-4 h-4 text-[#6b1d1d]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[#6b1d1d]",
						children: currentLangLabel
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: toggleTheme,
					title: "Toggle Theme",
					className: "w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50 border border-slate-100 transition-colors focus:outline-none cursor-pointer",
					children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "w-4.5 h-4.5 text-[#6b1d1d]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "w-4.5 h-4.5 text-[#6b1d1d]" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => navigate({ to: "/settings" }),
					title: "Settings",
					className: "w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50 border border-slate-100 transition-colors focus:outline-none cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "w-4.5 h-4.5 text-slate-500" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: handleSignOut,
					title: "Logout",
					className: "w-10 h-10 flex items-center justify-center rounded-xl text-[#6b1d1d] hover:bg-[#f5ebdc] hover:text-[#4a0f0f] border border-[#d8b46b]/60 transition-colors focus:outline-none cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-4.5 h-4.5" })
				})
			]
		})]
	});
}
/**
* Firebase Cloud Messaging — browser push integration.
*
* Requires VITE_FIREBASE_VAPID_KEY in addition to the standard Firebase
* configuration in src/lib/firebase.ts. Without VAPID, the app continues
* to work — notifications are still written to Firestore and visible in
* the in-app notification center.
*/
var vapidKey = "BIhymSdC9mBfgWetu2hOh0D1uE6ZQxCyY6DxzSw2MToGm8NpTVI3Hkt_K39tVnVGlkcfReA6t9dZfzgoFdYXaIE";
var fcmConfigured = Boolean(firebaseConfigured && vapidKey);
var _messaging = null;
function getFcm() {
	if (!fcmConfigured || typeof window === "undefined") return null;
	if (!("Notification" in window) || !("serviceWorker" in navigator)) return null;
	if (!_messaging) _messaging = getMessagingInWindow(getFirebaseApp());
	return _messaging;
}
async function requestNotificationPermissionAndSaveToken(userId) {
	const m = getFcm();
	if (!m) return null;
	try {
		if (await Notification.requestPermission() !== "granted") return null;
		const token = await getToken(m, {
			vapidKey,
			serviceWorkerRegistration: await navigator.serviceWorker.register("/firebase-messaging-sw.js")
		});
		if (token) await setDoc(doc(getDb(), COL.users, userId), { fcmToken: token }, { merge: true });
		return token;
	} catch (e) {
		return null;
	}
}
function listenForegroundMessages(cb) {
	const m = getFcm();
	if (!m) return () => {};
	return onMessage(m, (payload) => {
		const title = payload.notification?.title ?? "Notification";
		const body = payload.notification?.body ?? "";
		cb(title, body);
		if (Notification.permission === "granted") new Notification(title, {
			body,
			icon: "/icon-192.png"
		});
	});
}
function AuthLayout() {
	const navigate = useNavigate();
	const location = useLocation();
	const { user, loading: authLoading } = useAuth();
	const shopState = useShopState();
	const { shop, loading } = shopState;
	const isKitchenDisplayRoute = location.pathname.startsWith("/kitchen");
	(0, import_react.useEffect)(() => {
		if (authLoading || loading) return;
		if (!user) {
			navigate({ to: "/auth" });
			return;
		}
		if (!shop) navigate({
			to: "/auth",
			search: { mode: "signup" }
		});
	}, [
		user,
		shop,
		authLoading,
		loading,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (!shop || !user) return;
		const role = (shop.role || "owner").toLowerCase();
		const path = location.pathname;
		const isKitchenPath = path.startsWith("/kitchen");
		const isBillingPath = path.startsWith("/billing");
		const isAuthPath = path.startsWith("/auth");
		const isComingSoon = path.startsWith("/coming-soon");
		if (role === "kitchen") {
			if (!isKitchenPath && !isAuthPath && !isComingSoon) navigate({ to: "/kitchen" });
			return;
		}
		if (isKitchenPath) {
			if (role === "cashier") navigate({ to: "/billing" });
			else navigate({ to: "/dashboard" });
			return;
		}
		if (role === "cashier") {
			if (!isBillingPath && !isAuthPath && !isComingSoon) navigate({ to: "/billing" });
		}
	}, [
		shop,
		user,
		location.pathname,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (user && fcmConfigured) {
			requestNotificationPermissionAndSaveToken(user.uid);
			const unsub = listenForegroundMessages((title, body) => toast(title, { description: body }));
			return () => unsub();
		}
	}, [user]);
	if (authLoading || loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen grid place-items-center text-muted-foreground",
		children: "Loading…"
	});
	if (!user) return null;
	if (!shop) return null;
	if (isKitchenDisplayRoute) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopProvider, {
		value: shopState,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-background text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
				richColors: true,
				position: "top-right"
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopProvider, {
		value: shopState,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "h-screen flex flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(182,124,47,0.16),_transparent_30%),_linear-gradient(135deg,_rgba(255,250,243,0.95),_rgba(248,239,228,0.94))]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 flex min-w-0 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3 md:p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
					richColors: true,
					position: "top-right"
				})
			]
		})
	});
}
//#endregion
export { AuthLayout as component };
