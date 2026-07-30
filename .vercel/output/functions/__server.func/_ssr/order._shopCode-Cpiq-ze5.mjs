import { o as __toESM } from "../_runtime.mjs";
import { C as onSnapshot, D as setDoc, E as runTransaction, M as doc, O as updateDoc, P as serverTimestamp, S as limit, T as query, j as collection, k as where, w as orderBy, x as getDocs } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { r as getDb, t as COL } from "./firebase-jX9Hxz-N.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { v as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Input } from "./input-B-tDUnPX.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Button } from "./button-ufo6MiTZ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Toaster$1 } from "./sonner-DoFKumIW.mjs";
import { A as ShieldCheck, B as Quote, Bt as ChevronRight, Ct as Globe, D as Smartphone, Dt as Eye, E as Sparkles, Et as Facebook, Ft as CircleQuestionMark, G as Phone, Ht as ChevronDown, M as Send, Pt as CircleX, Qt as Award, St as Hash, T as Star, Ut as ChefHat, Vt as ChevronLeft, Wt as Check, Xt as BookOpen, _t as Instagram, at as MessageCircle, b as Target, ct as Maximize2, dt as MapPin, ft as Mail, m as Trophy, mt as LoaderCircle, n as X, p as Twitter, st as Megaphone, t as Youtube, u as User, vt as Image } from "../_libs/lucide-react.mjs";
import { t as optimizedImageUrl } from "./images-BnAPhdvv.mjs";
import { n as formatCurrency } from "./pos-BKnCkGZE.mjs";
import { a as normalizeOrderId, i as normalizeMobile, t as findOrderByPublicId } from "./order-utils-BPm42f6Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order._shopCode-Cpiq-ze5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DESKTOP_LAYOUTS = [
	{
		colSpan: "col-span-4",
		aspect: "aspect-[4/5]",
		rotate: "-rotate-2",
		translate: "translate-y-4",
		sizeClass: "w-full"
	},
	{
		colSpan: "col-span-4",
		aspect: "aspect-square",
		rotate: "rotate-3",
		translate: "-translate-y-8",
		sizeClass: "w-[90%]",
		align: "justify-self-center"
	},
	{
		colSpan: "col-span-4",
		aspect: "aspect-[4/3]",
		rotate: "-rotate-3",
		translate: "translate-y-12",
		sizeClass: "w-full",
		align: "justify-self-end"
	},
	{
		colSpan: "col-span-5",
		aspect: "aspect-[16/10]",
		rotate: "rotate-2",
		translate: "-translate-y-4",
		sizeClass: "w-full"
	},
	{
		colSpan: "col-span-3",
		aspect: "aspect-[3/4]",
		rotate: "-rotate-2",
		translate: "translate-y-8",
		sizeClass: "w-[85%]",
		align: "justify-self-center"
	},
	{
		colSpan: "col-span-4",
		aspect: "aspect-[4/3]",
		rotate: "rotate-1",
		translate: "-translate-y-10",
		sizeClass: "w-full"
	},
	{
		colSpan: "col-span-6",
		aspect: "aspect-[16/9]",
		rotate: "-rotate-2",
		translate: "translate-y-6",
		sizeClass: "w-[95%]"
	},
	{
		colSpan: "col-span-6",
		aspect: "aspect-square",
		rotate: "rotate-3",
		translate: "-translate-y-6",
		sizeClass: "w-[85%]",
		align: "justify-self-end"
	}
];
function PremiumGallery({ images }) {
	const [activeIdx, setActiveIdx] = (0, import_react.useState)(null);
	const [mobileActiveIdx, setMobileActiveIdx] = (0, import_react.useState)(0);
	const scrollRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (activeIdx === null) return;
		const handleKeyDown = (e) => {
			if (e.key === "Escape") setActiveIdx(null);
			else if (e.key === "ArrowRight") setActiveIdx((prev) => prev !== null && prev < images.length - 1 ? prev + 1 : 0);
			else if (e.key === "ArrowLeft") setActiveIdx((prev) => prev !== null && prev > 0 ? prev - 1 : images.length - 1);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [activeIdx, images.length]);
	const handleScroll = () => {
		if (!scrollRef.current) return;
		const { scrollLeft, clientWidth } = scrollRef.current;
		if (clientWidth > 0) setMobileActiveIdx(Math.round(scrollLeft / clientWidth));
	};
	const nextImage = (e) => {
		e?.stopPropagation();
		if (activeIdx !== null) setActiveIdx((activeIdx + 1) % images.length);
	};
	const prevImage = (e) => {
		e?.stopPropagation();
		if (activeIdx !== null) setActiveIdx((activeIdx - 1 + images.length) % images.length);
	};
	if (!images || images.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "block md:hidden relative w-full overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: scrollRef,
					onScroll: handleScroll,
					className: "flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 pb-4 px-1",
					style: {
						scrollbarWidth: "none",
						msOverflowStyle: "none"
					},
					children: images.map((url, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => setActiveIdx(idx),
						className: "snap-center shrink-0 w-[88%] aspect-[4/3] rounded-3xl overflow-hidden shadow-md border border-slate-100/60 active:scale-[0.98] transition-all duration-300 relative group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: optimizedImageUrl(url, 600, 450),
								alt: `Gallery ${idx + 1}`,
								loading: "lazy",
								decoding: "async",
								width: "600",
								height: "450",
								className: "w-full h-full object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 pointer-events-none" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute bottom-4 right-4 bg-white/85 backdrop-blur-sm p-2 rounded-full shadow-sm text-slate-700",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "w-4 h-4" })
							})
						]
					}, idx))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center items-center gap-2 mt-2",
					children: images.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							if (scrollRef.current) {
								const width = scrollRef.current.clientWidth;
								scrollRef.current.scrollTo({
									left: idx * (width + 16),
									behavior: "smooth"
								});
							}
						},
						className: `h-1.5 transition-all duration-300 rounded-full ${mobileActiveIdx === idx ? "w-6 bg-slate-800" : "w-1.5 bg-slate-300"}`,
						"aria-label": `Go to slide ${idx + 1}`
					}, idx))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden md:grid grid-cols-12 gap-x-8 gap-y-16 py-12 px-4 items-center relative min-h-[500px]",
				children: images.map((url, idx) => {
					const layout = DESKTOP_LAYOUTS[idx % DESKTOP_LAYOUTS.length];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `${layout.colSpan} ${layout.align || ""} relative z-10`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => setActiveIdx(idx),
							style: { contentVisibility: "auto" },
							className: `
                  ${layout.aspect} ${layout.sizeClass} ${layout.rotate} ${layout.translate}
                  rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl 
                  transition-all duration-300 ease-out cursor-pointer hover:rotate-0 hover:scale-[1.04] hover:z-50
                  group relative active:scale-[1.01]
                `,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: optimizedImageUrl(url, 800),
								alt: `Gallery ${idx + 1}`,
								loading: "lazy",
								decoding: "async",
								width: "800",
								height: "600",
								className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-slate-800 shadow-sm flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "w-3.5 h-3.5" }), " View Fullscreen"]
								})
							})]
						})
					}, idx);
				})
			}),
			activeIdx !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl transition-all duration-300 animate-fade-in",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setActiveIdx(null),
						className: "absolute top-6 right-6 z-[110] bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all duration-200 border border-white/10 shadow-lg",
						"aria-label": "Close lightbox",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-6 h-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: prevImage,
						className: "absolute left-6 z-[110] bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all duration-200 border border-white/10 shadow-lg active:scale-95",
						"aria-label": "Previous image",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-6 h-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: nextImage,
						className: "absolute right-6 z-[110] bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all duration-200 border border-white/10 shadow-lg active:scale-95",
						"aria-label": "Next image",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-6 h-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative max-w-[90vw] max-h-[85vh] flex items-center justify-center animate-zoom-in select-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: optimizedImageUrl(images[activeIdx], 1600),
							alt: `Gallery fullscreen ${activeIdx + 1}`,
							width: "1600",
							height: "1200",
							className: "max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/5"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white/10 text-white font-medium text-xs px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm",
							children: [
								activeIdx + 1,
								" / ",
								images.length
							]
						})]
					})
				]
			})
		]
	});
}
function isStringArray(value) {
	return Array.isArray(value) && value.every((item) => typeof item === "string");
}
function useInView(threshold = .15) {
	const ref = (0, import_react.useRef)(null);
	const [inView, setInView] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setInView(true);
				obs.unobserve(el);
			}
		}, { threshold });
		obs.observe(el);
		return () => obs.disconnect();
	}, [threshold]);
	return {
		ref,
		inView
	};
}
function AnimatedSection({ children, className = "" }) {
	const { ref, inView } = useInView(.1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: `transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`,
		children
	});
}
function StarRating({ rating, size = "sm" }) {
	const s = size === "md" ? "w-4 h-4" : "w-3 h-3";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center gap-0.5",
		children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `${s} ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}` }, i))
	});
}
function SectionHeading({ icon: Icon, title, subtitle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-200",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-5 h-5 text-white" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl font-bold text-slate-800",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-slate-400 mt-0.5",
			children: subtitle
		})] })]
	});
}
function TrackingForm({ orderIdInput, setOrderIdInput, mobile, setMobile, name, setName, handleTrackOrder, busy, trackingError, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-4",
		onSubmit: handleTrackOrder,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[24px] border border-[#C9A15A]/40 bg-[#F5EDE0] p-4 sm:p-5 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8A5A2A]",
						children: "Le Coq d'Or"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-2 text-xl font-semibold text-[#4A1620]",
						style: { fontFamily: "Georgia, 'Times New Roman', serif" },
						children: "Track Your Order"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-[#7A5A3A]",
						children: "Enter the details from your bill to follow the journey from kitchen to table."
					})
				]
			}),
			trackingError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "rounded-2xl border border-[#C58D4A]/30 bg-[#FFF3E5] px-3 py-2 text-center text-xs font-medium text-[#8A2F2F]",
				children: trackingError
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs font-semibold uppercase tracking-[0.2em] text-[#8A5A2A]",
					children: "Order ID"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A15A]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: orderIdInput,
						onChange: (e) => setOrderIdInput(e.target.value.toUpperCase()),
						required: true,
						placeholder: "e.g. NX-8F4K2Q9M7Z",
						className: "pl-10 h-12 rounded-2xl border-[#D8C2A0] bg-[#FFFDF9] text-sm uppercase text-[#4A1620] focus-visible:ring-4 focus-visible:ring-[#C9A15A]/15 focus-visible:border-[#C9A15A] transition-all"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs font-semibold uppercase tracking-[0.2em] text-[#8A5A2A]",
					children: "Mobile Number"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A15A]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: mobile,
						onChange: (e) => setMobile(e.target.value),
						required: true,
						type: "tel",
						placeholder: "e.g. 9876543210",
						className: "pl-10 h-12 rounded-2xl border-[#D8C2A0] bg-[#FFFDF9] text-sm text-[#4A1620] focus-visible:ring-4 focus-visible:ring-[#C9A15A]/15 focus-visible:border-[#C9A15A] transition-all"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs font-semibold uppercase tracking-[0.2em] text-[#8A5A2A]",
					children: "Your Name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A15A]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						required: true,
						placeholder: "e.g. Amit Kumar",
						className: "pl-10 h-12 rounded-2xl border-[#D8C2A0] bg-[#FFFDF9] text-sm text-[#4A1620] focus-visible:ring-4 focus-visible:ring-[#C9A15A]/15 focus-visible:border-[#C9A15A] transition-all"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				disabled: busy,
				className: "w-full h-12 rounded-2xl border border-[#C9A15A]/50 bg-[#4A1620] text-white font-semibold text-sm shadow-[0_12px_24px_-12px_rgba(74,22,32,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200",
				children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4 mr-2" }), "Track Order"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-2 rounded-2xl border border-[#C9A15A]/30 bg-[#FFF8EE] px-3 py-2 text-xs font-medium text-[#7A5A3A]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-[#C9A15A]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Real-time live tracking updates" })]
			})
		]
	});
}
function TrackingLive({ order, tone, shop, progressPercent, estimatedMinutes, onTrackAnother }) {
	const stageLabels = [
		"Confirmed",
		"Preparing",
		"Ready",
		"Delivered"
	];
	const currentStageIndex = Math.max(0, [
		"pending",
		"preparing",
		"ready",
		"completed"
	].indexOf(order?.status || "pending"));
	const statusHeadline = order?.status === "pending" ? "Your Order Is Confirmed" : order?.status === "preparing" ? "Preparing Your Feast" : order?.status === "ready" ? "Ready For Pickup" : order?.status === "completed" ? "Your Feast Is Served" : "Your Order Is On Its Way";
	const statusSubtitle = order?.status === "pending" ? "The kitchen has received your request and is preparing the first steps." : order?.status === "preparing" ? "Chef is crafting your meal with care and timing." : order?.status === "ready" ? "Everything is plated and awaiting collection." : order?.status === "completed" ? "Your order has reached its final destination." : "We’ll keep you updated as the meal moves through service.";
	const [videoErrored, setVideoErrored] = (0, import_react.useState)(false);
	const statusVideoSrc = (0, import_react.useMemo)(() => {
		switch ((order?.status || "pending").toLowerCase()) {
			case "pending":
			case "confirmed": return "/animations/confirmed.mp4";
			case "preparing": return "/animations/preparing.mp4";
			case "ready": return "/animations/ready.mp4";
			case "completed":
			case "delivered": return "/animations/completed.mp4";
			default: return "/animations/confirmed.mp4";
		}
	}, [order?.status]);
	(0, import_react.useEffect)(() => {
		setVideoErrored(false);
	}, [statusVideoSrc]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [order?.status === "cancelled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-[28px] border border-[#C9A15A]/40 bg-[#FFF1E3] p-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#8A2F2F]/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-7 w-7 text-[#8A2F2F]" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-semibold text-[#4A1620]",
					children: "Order Cancelled"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-[#7A5A3A]",
					children: "Your order has been cancelled by the restaurant."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative flex h-2.5 w-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A15A] opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2.5 w-2.5 rounded-full bg-[#4A1620]" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold uppercase tracking-[0.25em] text-[#8A5A2A]",
						children: "Live Tracking"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[30px] border border-[#C9A15A]/45 bg-[#F5EDE0] p-4 sm:p-6 shadow-[0_18px_44px_-24px_rgba(74,22,32,0.4)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-[132px] w-[132px] items-center justify-center overflow-hidden rounded-full border-[4px] border-[#C9A15A]/70 bg-[#FFF8F0] p-1 shadow-[0_8px_24px_-12px_rgba(74,22,32,0.35)] sm:h-[156px] sm:w-[156px]",
								children: videoErrored ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/images/chef-photo.svg",
									alt: "Chef portrait placeholder",
									className: "h-full w-full rounded-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									src: statusVideoSrc,
									autoPlay: true,
									loop: true,
									muted: true,
									playsInline: true,
									className: "h-full w-full rounded-full object-cover",
									"aria-label": `${statusHeadline} animation`,
									onError: () => setVideoErrored(true)
								}, statusVideoSrc)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-2xl font-semibold text-[#4A1620]",
								style: { fontFamily: "Georgia, 'Times New Roman', serif" },
								children: statusHeadline
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-6 text-[#7A5A3A]",
								children: statusSubtitle
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 rounded-[22px] border border-[#D8C2A0] bg-[#FFF8F0] p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative h-3 overflow-hidden rounded-full bg-[#E7D4B1]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full transition-all duration-700 ease-out",
									style: {
										width: `${progressPercent}%`,
										background: `linear-gradient(90deg, #C9A15A, #8A5A2A)`
									}
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 grid grid-cols-4 gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8A5A2A]",
								children: stageLabels.map((label, index) => {
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full px-2 py-1 text-center ${index <= currentStageIndex ? "bg-[#C9A15A]/15 text-[#4A1620]" : "bg-[#efe0c6] text-[#8A5A2A]"}`,
										children: label
									}, label);
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[28px] border border-[#C9A15A]/35 bg-[#FFF8F0] p-4 sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-dotted border-[#C9A15A]/60 pb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8A5A2A]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Order ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: order?.orderId })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center justify-between border-b border-dotted border-[#C9A15A]/60 pb-3 text-sm text-[#4A1620]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Estimated time"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-[#8A5A2A]",
								children: [
									"~",
									estimatedMinutes,
									" mins"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center justify-between border-b border-dotted border-[#C9A15A]/60 pb-3 text-sm text-[#4A1620]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Payment"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-[#8A5A2A]",
								children: order?.paymentMethod?.toUpperCase() || "CASH"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-3",
							children: (order?.items || []).map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-dotted border-[#C9A15A]/50 pb-2 text-sm text-[#4A1620]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "pr-3 font-medium",
									children: [item.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-2 rounded-full bg-[#EFE0C6] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8A5A2A]",
										children: ["x", item.quantity]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 font-semibold text-[#4A1620]",
									children: formatCurrency(item.price * item.quantity, shop?.currency ?? "INR")
								})]
							}, idx))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center justify-between rounded-[18px] border border-[#C9A15A]/40 bg-[#4A1620] px-4 py-3 text-sm font-semibold text-[#FFF8F0]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatCurrency(order?.total || 0, shop?.currency ?? "INR") })]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			onClick: onTrackAnother,
			className: "w-full h-12 rounded-2xl border-[#C9A15A]/40 bg-[#FFF8F0] text-[#4A1620] font-semibold hover:bg-[#F5EDE0] transition-all",
			children: "Track Another Order"
		})]
	});
}
function CustomerPortal() {
	const { shopCode } = useParams({ from: "/order/$shopCode" });
	const [shop, setShop] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [mobile, setMobile] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [orderIdInput, setOrderIdInput] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [order, setOrder] = (0, import_react.useState)(null);
	const [announcementIdx, setAnnouncementIdx] = (0, import_react.useState)(0);
	const [reviewIdx, setReviewIdx] = (0, import_react.useState)(0);
	const [openFaq, setOpenFaq] = (0, import_react.useState)(null);
	const [heroLoaded, setHeroLoaded] = (0, import_react.useState)(false);
	const [portalError, setPortalError] = (0, import_react.useState)(null);
	const [trackingError, setTrackingError] = (0, import_react.useState)(null);
	const [branding, setBranding] = (0, import_react.useState)(null);
	const [details, setDetails] = (0, import_react.useState)(null);
	const [gallery, setGallery] = (0, import_react.useState)(null);
	const [contact, setContact] = (0, import_react.useState)(null);
	const [announcements, setAnnouncements] = (0, import_react.useState)([]);
	const [reviews, setReviews] = (0, import_react.useState)([]);
	const [faqs, setFaqs] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			try {
				const snap = await getDocs(query(collection(getDb(), COL.shops), where("shopCode", "==", shopCode), limit(1)));
				if (cancelled) return;
				if (snap.empty) setShop(null);
				else {
					const d = snap.docs[0];
					const data = d.data();
					setShop({
						id: d.id,
						...data
					});
				}
			} catch (error) {
				console.error("[portal] load shop", error);
				if (!cancelled) {
					setPortalError("We could not load this restaurant. Please check your connection and try again.");
					setShop(null);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [shopCode]);
	(0, import_react.useEffect)(() => {
		if (!shop?.id) return;
		const db = getDb();
		const unsubs = [];
		const onListenerError = (error) => {
			console.error("[portal] CMS listener failed", error);
			setPortalError("Some restaurant details could not be loaded. Please refresh and try again.");
		};
		unsubs.push(onSnapshot(doc(db, COL.branding, shop.id), (snap) => setBranding(snap.exists() ? snap.data() : null), onListenerError));
		unsubs.push(onSnapshot(doc(db, COL.details, shop.id), (snap) => setDetails(snap.exists() ? snap.data() : null), onListenerError));
		unsubs.push(onSnapshot(doc(db, COL.gallery, shop.id), (snap) => setGallery(snap.exists() ? snap.data() : null), onListenerError));
		unsubs.push(onSnapshot(doc(db, COL.contact, shop.id), (snap) => setContact(snap.exists() ? snap.data() : null), onListenerError));
		unsubs.push(onSnapshot(query(collection(db, COL.announcements), where("shopId", "==", shop.id), where("active", "==", true), orderBy("createdAt", "desc")), (snap) => setAnnouncements(snap.docs.map((d) => ({
			id: d.id,
			...d.data()
		}))), onListenerError));
		unsubs.push(onSnapshot(query(collection(db, COL.reviews), where("shopId", "==", shop.id), where("status", "==", "approved"), orderBy("createdAt", "desc")), (snap) => setReviews(snap.docs.map((d) => ({
			id: d.id,
			...d.data()
		}))), onListenerError));
		unsubs.push(onSnapshot(query(collection(db, COL.faqs), where("shopId", "==", shop.id), where("active", "==", true), orderBy("displayOrder", "asc")), (snap) => setFaqs(snap.docs.map((d) => ({
			id: d.id,
			...d.data()
		}))), onListenerError));
		return () => unsubs.forEach((u) => u());
	}, [shop?.id]);
	(0, import_react.useEffect)(() => {
		if (!order?.id) return;
		const unsub = onSnapshot(doc(getDb(), COL.orders, order.id), (snap) => {
			if (!snap.exists()) return;
			const data = snap.data();
			setOrder({
				id: snap.id,
				orderId: data.orderId,
				orderNumber: data.orderNumber,
				status: data.status,
				items: data.items || [],
				total: data.total || 0,
				paymentMethod: data.paymentMethod || "CASH",
				createdAt: data.createdAt
			});
			if (data.status === "ready") toast.success("Your order is ready for pickup!");
		}, (err) => console.error("[portal] snapshot failed", err));
		return () => unsub();
	}, [order?.id]);
	(0, import_react.useEffect)(() => {
		if (announcements.length < 2) return;
		const t = setInterval(() => setAnnouncementIdx((i) => (i + 1) % announcements.length), 5e3);
		return () => clearInterval(t);
	}, [announcements.length]);
	const handleTrackOrder = async (e) => {
		e.preventDefault();
		if (!shop) return;
		if (!orderIdInput.trim() || !mobile.trim()) {
			toast.error("Order ID and mobile number are required.");
			return;
		}
		setBusy(true);
		setTrackingError(null);
		try {
			const db = getDb();
			const enteredOrderId = normalizeOrderId(orderIdInput);
			const normalizedMobile = normalizeMobile(mobile);
			const docSnap = await findOrderByPublicId(db, shop.id, enteredOrderId);
			if (!docSnap?.exists()) {
				setOrder(null);
				toast.error("No matching order was found for those details.");
				return;
			}
			const matchedOrderData = docSnap.data();
			const storedMobile = normalizeMobile(String(matchedOrderData.customerMobile || ""));
			if (storedMobile && storedMobile !== normalizedMobile) {
				setOrder(null);
				toast.error("No matching order was found for those details.");
				return;
			}
			const orderRef = doc(db, COL.orders, docSnap.id);
			if (!storedMobile || name.trim() && !matchedOrderData.customerName) await updateDoc(orderRef, {
				...storedMobile ? {} : { customerMobile: normalizedMobile },
				...name.trim() && !matchedOrderData.customerName ? { customerName: name.trim() } : {},
				updatedAt: serverTimestamp()
			});
			const customerId = `${shop.id}_${normalizedMobile}`;
			const customerRef = doc(db, COL.customers, customerId);
			await runTransaction(db, async (tx) => {
				const c = await tx.get(customerRef);
				if (c.exists()) {
					const prev = c.data();
					const prevName = typeof prev.name === "string" ? prev.name : void 0;
					const prevTotalOrders = typeof prev.totalOrders === "number" ? prev.totalOrders : 0;
					const prevTotalSpending = typeof prev.totalSpending === "number" ? prev.totalSpending : 0;
					const prevLoyaltyPoints = typeof prev.loyaltyPoints === "number" ? prev.loyaltyPoints : 0;
					tx.update(customerRef, {
						name: name.trim() || prevName || "Customer",
						totalOrders: prevTotalOrders + 1,
						totalSpending: prevTotalSpending + (matchedOrderData.total || 0),
						loyaltyPoints: prevLoyaltyPoints + Math.max(1, Math.floor((matchedOrderData.total || 0) / 100)),
						lastVisit: serverTimestamp()
					});
				} else tx.set(customerRef, {
					shopId: shop.id,
					mobile: normalizedMobile,
					name: name.trim() || "Customer",
					totalOrders: 1,
					totalSpending: matchedOrderData.total || 0,
					loyaltyPoints: Math.max(1, Math.floor((matchedOrderData.total || 0) / 100)),
					createdAt: serverTimestamp(),
					lastVisit: serverTimestamp()
				});
			});
			try {
				await setDoc(doc(collection(db, COL.notifications)), {
					userId: null,
					shopId: shop.id,
					title: "Customer Registered",
					body: `Order ${enteredOrderId} tracked by customer ${name.trim()} (${mobile.trim()})`,
					type: "qr_checkin",
					read: false,
					createdAt: serverTimestamp()
				});
			} catch (error) {
				console.warn("[portal] notify failed", error);
			}
			setOrder({
				id: docSnap.id,
				orderId: matchedOrderData.orderId || enteredOrderId,
				orderNumber: matchedOrderData.orderNumber || 0,
				status: matchedOrderData.status || "Waiting",
				items: matchedOrderData.items || [],
				total: matchedOrderData.total || 0,
				paymentMethod: matchedOrderData.paymentMethod || "CASH",
				createdAt: matchedOrderData.createdAt
			});
			toast.success(`Tracking active for Order ${enteredOrderId}`);
		} catch (error) {
			console.error("[portal] tracking failed", error);
			const message = "We could not look up that order right now. Please try again shortly.";
			setTrackingError(message);
			toast.error(message);
		} finally {
			setBusy(false);
		}
	};
	const progressPercent = (0, import_react.useMemo)(() => {
		if (!order) return 0;
		if (order.status === "Waiting") return 15;
		if (order.status === "pending") return 25;
		if (order.status === "preparing") return 50;
		if (order.status === "ready") return 75;
		if (order.status === "completed") return 100;
		return 0;
	}, [order]);
	const estimatedMinutes = (0, import_react.useMemo)(() => {
		if (!order?.items?.length) return 15;
		const computed = order.items.reduce((sum, item) => sum + (item.veg ? 8 : 12) * (item.quantity || 1), 0);
		return Math.max(10, computed);
	}, [order]);
	const coverBanner = branding?.coverBanner || shop?.bannerUrl || "";
	const restaurantLogo = branding?.restaurantLogo || shop?.logoUrl || "";
	const restaurantName = branding?.restaurantName || shop?.name || "";
	const tagline = branding?.restaurantTagline || "";
	const hasAbout = !!details?.aboutRestaurant;
	const hasStory = !!details?.story;
	const hasSignatureQuote = !!details?.signatureQuote;
	const hasChef = !!(details?.headChefName || details?.chefPhoto);
	const hasMission = !!details?.mission;
	const hasVision = !!details?.vision;
	const hasAwards = !!(details?.awards || details?.certifications);
	const hasGallery = gallery && Object.values(gallery).some((item) => isStringArray(item) && item.length > 0);
	const hasContact = contact && (contact.phone || contact.whatsapp || contact.email || contact.website || contact.address);
	const hasSocial = contact && (contact.instagram || contact.facebook || contact.youtube || contact.x || contact.threads);
	const hasAnnouncements = announcements.length > 0;
	const hasReviews = reviews.length > 0;
	const hasFaqs = faqs.length > 0;
	const hasMap = !!(contact?.latitude && contact?.longitude);
	const allGalleryImages = (0, import_react.useMemo)(() => {
		if (!gallery) return [];
		const imgs = [];
		Object.values(gallery).forEach((item) => {
			if (isStringArray(item)) imgs.push(...item);
		});
		return imgs;
	}, [gallery]);
	const tone = shop?.themeColor || "#F97316";
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#F7ECDD] flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 mx-auto flex items-center justify-center animate-pulse",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChefHat, { className: "w-8 h-8 text-white" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-32 bg-slate-100 rounded-full mx-auto animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-24 bg-slate-50 rounded-full mx-auto animate-pulse" })]
			})]
		})
	});
	if (!shop) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#F7ECDD] flex items-center justify-center p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-20 h-20 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChefHat, { className: "w-10 h-10 text-slate-300" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-slate-800 mb-2",
					children: portalError ? "Unable to load restaurant" : "Shop Not Found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-slate-500 text-sm",
					children: portalError ?? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"Code",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "bg-slate-100 px-2 py-0.5 rounded text-orange-600 font-mono",
							children: shopCode
						}),
						" ",
						"does not match any active shop."
					] })
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#F7ECDD] font-sans antialiased text-[#4A1620]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative w-full h-[36vh] sm:h-[42vh] md:h-[46vh] overflow-hidden bg-slate-900",
				children: [
					coverBanner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: coverBanner,
						alt: "",
						className: `absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${heroLoaded ? "opacity-100" : "opacity-0"}`,
						onLoad: () => setHeroLoaded(true)
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-[#4A1620]/70 via-[#4A1620]/40 to-[#4A1620]/90" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/30 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-x-0 top-0 z-10 px-4 pb-6 pt-4 sm:px-8 sm:pt-6 md:px-10 md:pt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-4xl",
							children: [restaurantLogo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4 h-20 w-20 overflow-hidden rounded-[24px] border border-[#C9A15A]/60 bg-[#FFF8F0]/10 shadow-2xl shadow-black/30 backdrop-blur-sm sm:h-24 sm:w-24",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: restaurantLogo,
									alt: restaurantName,
									className: "h-full w-full object-cover"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mx-auto flex w-full max-w-3xl flex-col items-center justify-center rounded-[28px] border border-[#C9A15A]/70 bg-[#4A1620]/95 px-4 py-5 text-center shadow-[0_20px_64px_-30px_rgba(0,0,0,0.7)] sm:px-6 sm:py-7",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-3 top-3 h-3 w-3 rounded-full border border-[#C9A15A]/70" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-3 top-3 h-3 w-3 rounded-full border border-[#C9A15A]/70" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-3 left-3 h-3 w-3 rounded-full border border-[#C9A15A]/70" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-3 right-3 h-3 w-3 rounded-full border border-[#C9A15A]/70" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "w-full break-words px-2 text-[1.65rem] font-semibold leading-tight tracking-[0.08em] text-[#FFF8F0] sm:px-4 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl",
										style: { fontFamily: "Georgia, 'Times New Roman', serif" },
										children: restaurantName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 h-px w-full max-w-[12rem] bg-[#C9A15A]" }),
									tagline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 max-w-2xl px-2 text-sm font-light text-[#F5EDE0]/90 sm:px-4 sm:text-base md:text-lg",
										children: tagline
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 flex justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A15A]/70 bg-[#FFF8F0] text-lg font-semibold text-[#4A1620]",
											children: "L"
										})
									})
								]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedSection, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-[36px] border border-[#C9A15A]/40 bg-[#FFF8F0]/95 p-6 shadow-[0_22px_70px_-30px_rgba(74,22,32,0.35)] backdrop-blur-xl sm:p-8 mb-8",
						children: order ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackingLive, {
							order,
							tone,
							shop,
							progressPercent,
							estimatedMinutes,
							onTrackAnother: () => setOrder(null)
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackingForm, {
							orderIdInput,
							setOrderIdInput,
							mobile,
							setMobile,
							name,
							setName,
							handleTrackOrder,
							busy,
							trackingError,
							tone
						})
					}) }),
					hasAnnouncements && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedSection, {
						className: "mb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-xl shadow-orange-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-6 sm:p-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "w-5 h-5 text-white/90" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-white/70 uppercase tracking-wider",
											children: "Announcements"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative min-h-[80px]",
										children: announcements.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `transition-all duration-500 absolute inset-0 ${idx === announcementIdx ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "text-lg font-bold text-white mb-1",
													children: item.title
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-white/80 leading-relaxed",
													children: item.message
												}),
												item.bannerImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: item.bannerImage,
													alt: "",
													className: "mt-3 rounded-2xl w-full h-32 object-cover border border-white/20"
												})
											]
										}, item.id))
									}),
									announcements.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-1.5 mt-4",
										children: announcements.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setAnnouncementIdx(idx),
											className: `h-1.5 rounded-full transition-all duration-300 ${idx === announcementIdx ? "w-8 bg-white" : "w-1.5 bg-white/40"}`
										}, idx))
									})
								]
							})
						})
					}),
					hasSignatureQuote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedSection, {
						className: "mb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-3xl p-8 sm:p-10 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, { className: "w-10 h-10 text-orange-300 mx-auto mb-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xl sm:text-2xl font-display italic text-slate-700 leading-relaxed",
								children: [
									"\"",
									details.signatureQuote,
									"\""
								]
							})]
						})
					}),
					hasAbout && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedSection, {
						className: "mb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
								icon: BookOpen,
								title: "About Us",
								subtitle: "Our story and passion"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line",
								children: details.aboutRestaurant
							})]
						})
					}),
					hasStory && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedSection, {
						className: "mb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
								icon: Sparkles,
								title: "Our Story",
								subtitle: "How it all began"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line",
								children: details.story
							})]
						})
					}),
					(hasMission || hasVision) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedSection, {
						className: "mb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid sm:grid-cols-2 gap-4",
							children: [hasMission && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white border border-slate-100 rounded-3xl p-6 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "w-5 h-5 text-orange-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-slate-800",
										children: "Our Mission"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-slate-600 whitespace-pre-line",
									children: details.mission
								})]
							}), hasVision && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white border border-slate-100 rounded-3xl p-6 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-5 h-5 text-orange-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-slate-800",
										children: "Our Vision"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-slate-600 whitespace-pre-line",
									children: details.vision
								})]
							})]
						})
					}),
					hasChef && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedSection, {
						className: "mb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
								icon: ChefHat,
								title: "Meet Our Chef",
								subtitle: "The master behind the flavors"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row items-start gap-6",
								children: [details.chefPhoto && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-lg shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: details.chefPhoto,
										alt: details.headChefName || "Chef",
										className: "w-full h-full object-cover"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [details.headChefName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xl font-bold text-slate-800 mb-1",
									children: details.headChefName
								}), details.chefDescription && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-slate-600 leading-relaxed whitespace-pre-line",
									children: details.chefDescription
								})] })]
							})]
						})
					}),
					hasAwards && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedSection, {
						className: "mb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
								icon: Trophy,
								title: "Achievements",
								subtitle: "Recognition & excellence"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									details.awards && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3 p-4 bg-amber-50/50 rounded-2xl border border-amber-100",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-5 h-5 text-amber-500 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-semibold text-sm text-slate-700 mb-1",
											children: "Awards"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-slate-600 whitespace-pre-line",
											children: details.awards
										})] })]
									}),
									details.certifications && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-5 h-5 text-emerald-500 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-semibold text-sm text-slate-700 mb-1",
											children: "Certifications"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-slate-600 whitespace-pre-line",
											children: details.certifications
										})] })]
									}),
									(details.hygieneRating || details.googleRating) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-6 pt-2",
										children: [details.hygieneRating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-center p-4 bg-slate-50 rounded-2xl flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-slate-400 mb-1",
													children: "Hygiene"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-2xl font-bold text-slate-800",
													children: details.hygieneRating
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-slate-400",
													children: "/ 5"
												})
											]
										}), details.googleRating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-center p-4 bg-slate-50 rounded-2xl flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-slate-400 mb-1",
													children: "Rating"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-2xl font-bold text-slate-800 flex items-center justify-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "w-5 h-5 text-yellow-400 fill-yellow-400" }), details.googleRating]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-slate-400",
													children: "/ 5"
												})
											]
										})]
									})
								]
							})]
						})
					}),
					hasGallery && allGalleryImages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedSection, {
						className: "mb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
								icon: Image,
								title: "Gallery",
								subtitle: "Moments captured"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PremiumGallery, { images: allGalleryImages })]
						})
					}),
					hasReviews && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedSection, {
						className: "mb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
										icon: Star,
										title: "Reviews",
										subtitle: `${reviews.length} reviews`
									}), reviews.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setReviewIdx((i) => Math.max(0, i - 1)),
											disabled: reviewIdx === 0,
											className: "w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 disabled:opacity-40 transition-all",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4 text-slate-600" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setReviewIdx((i) => Math.min(reviews.length - 1, i + 1)),
											disabled: reviewIdx >= reviews.length - 1,
											className: "w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 disabled:opacity-40 transition-all",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4 text-slate-600" })
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex transition-transform duration-500 ease-out",
										style: { transform: `translateX(-${reviewIdx * 100}%)` },
										children: reviews.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "min-w-full px-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-slate-50/80 border border-slate-100 rounded-2xl p-5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-3 mb-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm",
															children: (item.name || "A")[0].toUpperCase()
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
															className: "font-semibold text-sm text-slate-800",
															children: item.name || "Anonymous"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarRating, { rating: item.rating || 0 })] })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-slate-600 leading-relaxed",
														children: item.review
													}),
													item.photo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: item.photo,
														alt: "",
														className: "mt-3 rounded-xl w-20 h-20 object-cover border border-slate-200"
													}),
													item.reply && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-3 p-3 bg-white rounded-xl border border-slate-200",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-xs font-semibold text-slate-400 mb-1",
															children: "Owner's Reply"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-sm text-slate-600",
															children: item.reply
														})]
													})
												]
											})
										}, item.id))
									})
								}),
								reviews.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-center gap-1.5 mt-4",
									children: reviews.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setReviewIdx(idx),
										className: `h-2 rounded-full transition-all duration-300 ${idx === reviewIdx ? "w-6 bg-orange-500" : "w-2 bg-slate-200"}`
									}, idx))
								})
							]
						})
					}),
					hasFaqs && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedSection, {
						className: "mb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
								icon: CircleQuestionMark,
								title: "FAQ",
								subtitle: "Frequently asked questions"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: faqs.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setOpenFaq(openFaq === item.id ? null : item.id),
										className: "w-full flex items-center justify-between p-4 text-left bg-white hover:bg-slate-50 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-sm text-slate-800 pr-4",
											children: item.question
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === item.id ? "rotate-180" : ""}` })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `overflow-hidden transition-all duration-300 ${openFaq === item.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-4 pt-0 border-t border-slate-100",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-slate-600 whitespace-pre-line",
												children: item.answer
											})
										})
									})]
								}, item.id))
							})]
						})
					}),
					(hasContact || hasSocial) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedSection, {
						className: "mb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
								icon: Phone,
								title: "Contact",
								subtitle: "Get in touch with us"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid sm:grid-cols-2 gap-6",
								children: [hasContact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										contact.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: `tel:${contact.phone}`,
											className: "flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-orange-50 transition-colors group",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4 text-orange-600" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-medium text-slate-700",
												children: contact.phone
											})]
										}),
										contact.whatsapp && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-emerald-50 transition-colors group",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "w-4 h-4 text-emerald-600" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-medium text-slate-700",
												children: contact.whatsapp
											})]
										}),
										contact.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: `mailto:${contact.email}`,
											className: "flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-orange-50 transition-colors group",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-4 h-4 text-orange-600" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-medium text-slate-700",
												children: contact.email
											})]
										}),
										contact.website && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: contact.website.startsWith("http") ? contact.website : `https://${contact.website}`,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-orange-50 transition-colors group",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-4 h-4 text-orange-600" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-medium text-slate-700 truncate",
												children: contact.website
											})]
										}),
										contact.address && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-3 p-3 bg-slate-50 rounded-2xl",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-4 h-4 text-slate-500" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm text-slate-600 leading-relaxed",
												children: contact.address
											})]
										})
									]
								}), hasSocial && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-semibold text-sm text-slate-700 mb-3",
									children: "Follow Us"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [
										contact.instagram && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: contact.instagram.startsWith("http") ? contact.instagram : `https://instagram.com/${contact.instagram}`,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-2xl text-sm font-medium text-pink-700 hover:shadow-md transition-all",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "w-4 h-4" }), " Instagram"]
										}),
										contact.facebook && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: contact.facebook.startsWith("http") ? contact.facebook : `https://facebook.com/${contact.facebook}`,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl text-sm font-medium text-blue-700 hover:shadow-md transition-all",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "w-4 h-4" }), " Facebook"]
										}),
										contact.youtube && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: contact.youtube.startsWith("http") ? contact.youtube : `https://youtube.com/${contact.youtube}`,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-2xl text-sm font-medium text-red-700 hover:shadow-md transition-all",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "w-4 h-4" }), " YouTube"]
										}),
										contact.x && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: contact.x.startsWith("http") ? contact.x : `https://x.com/${contact.x}`,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 hover:shadow-md transition-all",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { className: "w-4 h-4" }), " X"]
										})
									]
								})] })]
							})]
						})
					}),
					hasMap && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedSection, {
						className: "mb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-6 pb-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
									icon: MapPin,
									title: "Find Us",
									subtitle: "Visit our location"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-64 sm:h-80",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
									title: "Restaurant Location",
									width: "100%",
									height: "100%",
									style: { border: 0 },
									loading: "lazy",
									referrerPolicy: "no-referrer-when-downgrade",
									src: `https://www.google.com/maps?q=${contact.latitude},${contact.longitude}&z=15&output=embed`,
									className: "rounded-b-3xl"
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-10 border-t border-slate-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-2 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChefHat, { className: "w-5 h-5 text-orange-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold text-slate-700",
								children: restaurantName
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-slate-400",
							children: ["Powered by Nexavo POS · ", shop.shopCode]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
				richColors: true,
				position: "top-center"
			})
		]
	});
}
//#endregion
export { CustomerPortal as component };
