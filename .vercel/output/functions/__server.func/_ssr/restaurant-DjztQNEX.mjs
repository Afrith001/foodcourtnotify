import { o as __toESM } from "../_runtime.mjs";
import { C as onSnapshot, D as setDoc, M as doc, O as updateDoc, P as serverTimestamp, T as query, b as getDoc, g as deleteDoc, j as collection, k as where, m as addDoc, w as orderBy } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { r as getDb, t as COL } from "./firebase-jX9Hxz-N.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-oa7pWA7o.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-ZV2o_Ft7.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Input } from "./input-B-tDUnPX.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Button } from "./button-ufo6MiTZ.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-WFFmfsjP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as Navigation, B as Quote, Ct as Globe, Dt as Eye, E as Sparkles, Et as Facebook, F as Save, Ft as CircleQuestionMark, G as Phone, I as Reply, J as PenLine, Jt as Calendar, L as RefreshCw, Mt as Clock, T as Star, U as Plus, Ut as ChefHat, W as Pin, Wt as Check, X as Palette, Xt as BookOpen, Y as PanelsTopLeft, Zt as Bell, _ as ToggleRight, _t as Instagram, at as MessageCircle, b as Target, bt as ImagePlus, dt as MapPin, et as Music2, f as Upload, ft as Mail, g as Trash2, i as Wifi, it as MessageSquare, l as Users, lt as Map, m as Trophy, mt as LoaderCircle, n as X, nt as Monitor, p as Twitter, qt as Car, r as Wind, s as Utensils, st as Megaphone, t as Youtube, v as ToggleLeft, vt as Image, xt as House } from "../_libs/lucide-react.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/radix-ui__react-slider.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/restaurant-DjztQNEX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
var UPLOAD_PRESET = "nexavo-products";
var CLOUD_NAME = "dicpzzwgw";
function uploadToCloudinary(file, onProgress) {
	return new Promise((resolve, reject) => {
		const fd = new FormData();
		fd.append("file", file);
		fd.append("upload_preset", UPLOAD_PRESET);
		const xhr = new XMLHttpRequest();
		xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, true);
		xhr.upload.onprogress = (e) => {
			if (e.lengthComputable && onProgress) onProgress(Math.round(e.loaded / e.total * 100));
		};
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) try {
				const resp = JSON.parse(xhr.responseText);
				if (resp.secure_url) resolve(resp.secure_url);
				else reject(/* @__PURE__ */ new Error("Missing secure_url in Cloudinary response"));
			} catch {
				reject(/* @__PURE__ */ new Error("Failed to parse Cloudinary response"));
			}
			else try {
				const errResp = JSON.parse(xhr.responseText);
				reject(new Error(errResp.error?.message || "Cloudinary upload failed"));
			} catch {
				reject(/* @__PURE__ */ new Error("Cloudinary upload failed"));
			}
		};
		xhr.onerror = () => reject(/* @__PURE__ */ new Error("Network error during upload"));
		xhr.send(fd);
	});
}
function DropZone({ onFiles, label = "Drop files here", maxSize = 5, multiple = false }) {
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onDragOver: (e) => {
			e.preventDefault();
			setDragging(true);
		},
		onDragLeave: () => setDragging(false),
		onDrop: (0, import_react.useCallback)((e) => {
			e.preventDefault();
			setDragging(false);
			const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
			const valid = files.filter((f) => f.size <= maxSize * 1024 * 1024);
			if (valid.length !== files.length) toast.error(`Some files exceed ${maxSize}MB limit`);
			if (valid.length) onFiles(valid);
		}, [onFiles, maxSize]),
		onClick: () => inputRef.current?.click(),
		className: `border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${dragging ? "border-orange-500 bg-orange-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			ref: inputRef,
			type: "file",
			accept: "image/*",
			multiple: true,
			className: "hidden",
			onChange: (e) => {
				const files = Array.from(e.target.files || []);
				const valid = files.filter((f) => f.size <= maxSize * 1024 * 1024);
				if (valid.length !== files.length) toast.error(`Some files exceed ${maxSize}MB limit`);
				if (valid.length) onFiles(valid);
				e.target.value = "";
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-5 h-5 text-orange-600" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-slate-600",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-slate-400",
					children: [
						"PNG, JPG, WEBP up to ",
						maxSize,
						"MB"
					]
				})
			]
		})]
	});
}
function ImgPreview({ src, onDelete, onReplace }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative group rounded-xl overflow-hidden border bg-white shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: "",
			className: "w-full h-28 object-cover"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100",
			children: [onReplace && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onReplace,
				className: "w-7 h-7 rounded-full bg-white/90 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5 text-slate-700" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onDelete,
				className: "w-7 h-7 rounded-full bg-red-500/90 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5 text-white" })
			})]
		})]
	});
}
function ColorField({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs font-semibold text-slate-600",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "color",
				value,
				onChange: (e) => onChange(e.target.value),
				className: "w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value,
				onChange: (e) => onChange(e.target.value),
				className: "font-mono text-sm h-9"
			})]
		})]
	});
}
function Skeleton({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `animate-pulse bg-slate-200 rounded-xl ${className}` });
}
function RestaurantCMSPage() {
	const { t } = useTranslation();
	const { shop } = useShop();
	const [activeTab, setActiveTab] = (0, import_react.useState)("branding");
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		document.title = `Restaurant CMS · ${t("common.appName")}`;
	}, [t]);
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		const hash = window.location.hash.replace("#", "");
		if ([
			"branding",
			"details",
			"gallery",
			"contact",
			"theme",
			"announcements",
			"reviews",
			"faq"
		].includes(hash)) setActiveTab(hash);
		setLoading(false);
	}, [shop]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 max-w-6xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-64" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 w-full" })
		]
	});
	if (!shop) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-6xl pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-bold",
			children: "Restaurant CMS"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground text-sm mt-1",
			children: "Manage everything your customers see — no developer needed."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			value: activeTab,
			onValueChange: (v) => {
				setActiveTab(v);
				window.location.hash = v;
			},
			className: "w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
					className: "flex flex-wrap h-auto w-full justify-start mb-6 gap-1 bg-transparent",
					children: [
						{
							value: "branding",
							label: "Branding",
							icon: Sparkles
						},
						{
							value: "details",
							label: "Details",
							icon: ChefHat
						},
						{
							value: "gallery",
							label: "Gallery",
							icon: Image
						},
						{
							value: "contact",
							label: "Contact",
							icon: Phone
						},
						{
							value: "theme",
							label: "Theme",
							icon: Palette
						},
						{
							value: "announcements",
							label: "Announcements",
							icon: Megaphone
						},
						{
							value: "reviews",
							label: "Reviews",
							icon: Star
						},
						{
							value: "faq",
							label: "FAQ",
							icon: CircleQuestionMark
						}
					].map((tab) => {
						const Icon = tab.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: tab.value,
							className: "data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 rounded-xl px-3 py-2 text-xs sm:text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-4 h-4 mr-1.5" }), tab.label]
						}, tab.value);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "branding",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandingSection, { shopId: shop.id })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "details",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailsSection, { shopId: shop.id })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "gallery",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GallerySection, { shopId: shop.id })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "contact",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactSection, { shopId: shop.id })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "theme",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSection, { shopId: shop.id })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "announcements",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnnouncementsSection, { shopId: shop.id })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "reviews",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewsSection, { shopId: shop.id })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "faq",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { shopId: shop.id })
				})
			]
		})]
	});
}
function BrandingSection({ shopId }) {
	const [data, setData] = (0, import_react.useState)({
		restaurantLogo: "",
		coverBanner: "",
		restaurantName: "",
		restaurantTagline: "",
		shortDescription: "",
		loaderLogo: "",
		loaderAnimation: true,
		loaderSpeed: 1,
		loaderColor: "#F97316",
		themeColor: "#F97316",
		accentColor: "#10B981",
		primaryFont: "Inter",
		secondaryFont: "Sora",
		enableAnimatedHeader: true,
		animatedRestaurantName: true,
		scrollingSpeed: 3,
		favicon: ""
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(null);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		(async () => {
			const snap = await getDoc(doc(getDb(), COL.branding, shopId));
			if (snap.exists()) setData((p) => ({
				...p,
				...snap.data()
			}));
			setLoaded(true);
		})();
	}, [shopId]);
	const update = (k, v) => setData((p) => ({
		...p,
		[k]: v
	}));
	const handleUpload = async (file, field, folder) => {
		setUploading(field);
		try {
			update(field, await uploadToCloudinary(file));
			toast.success(`${folder} uploaded`);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setUploading(null);
		}
	};
	const save = async () => {
		setSaving(true);
		try {
			await setDoc(doc(getDb(), COL.branding, shopId), {
				...data,
				updatedAt: serverTimestamp()
			}, { merge: true });
			toast.success("Branding saved");
		} catch (e) {
			toast.error(e.message);
		} finally {
			setSaving(false);
		}
	};
	if (!loaded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 w-full" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold",
					children: "Restaurant Branding"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: save,
					disabled: saving,
					className: "bg-orange-500 hover:bg-orange-600",
					children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4 mr-2" }), "Save"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Logos & Images"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-sm font-semibold mb-2 block",
									children: "Restaurant Logo"
								}),
								data.restaurantLogo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative w-32 h-32 rounded-2xl overflow-hidden border group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: data.restaurantLogo,
										alt: "",
										className: "w-full h-full object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => update("restaurantLogo", ""),
											className: "w-7 h-7 rounded-full bg-red-500 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5 text-white" })
										})
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropZone, {
									onFiles: (f) => handleUpload(f[0], "restaurantLogo", "logo"),
									label: "Drop logo here"
								}),
								uploading === "restaurantLogo" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-sm text-orange-600 mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3 h-3 animate-spin" }), " Uploading..."]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-sm font-semibold mb-2 block",
									children: "Cover Banner"
								}),
								data.coverBanner ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative w-full h-36 rounded-2xl overflow-hidden border group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: data.coverBanner,
										alt: "",
										className: "w-full h-full object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => update("coverBanner", ""),
											className: "w-7 h-7 rounded-full bg-red-500 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5 text-white" })
										})
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropZone, {
									onFiles: (f) => handleUpload(f[0], "coverBanner", "banner"),
									label: "Drop banner here"
								}),
								uploading === "coverBanner" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-sm text-orange-600 mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3 h-3 animate-spin" }), " Uploading..."]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-sm font-semibold mb-2 block",
								children: "Loader Logo"
							}), data.loaderLogo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-24 h-24 rounded-2xl overflow-hidden border group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: data.loaderLogo,
									alt: "",
									className: "w-full h-full object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => update("loaderLogo", ""),
										className: "w-7 h-7 rounded-full bg-red-500 flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5 text-white" })
									})
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropZone, {
								onFiles: (f) => handleUpload(f[0], "loaderLogo", "loader"),
								maxSize: 2,
								label: "Drop loader logo"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-sm font-semibold mb-2 block",
								children: "Favicon"
							}), data.favicon ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-14 h-14 rounded-xl overflow-hidden border group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: data.favicon,
									alt: "",
									className: "w-full h-full object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => update("favicon", ""),
										className: "w-6 h-6 rounded-full bg-red-500 flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3 h-3 text-white" })
									})
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropZone, {
								onFiles: (f) => handleUpload(f[0], "favicon", "favicon"),
								maxSize: 1,
								label: "Drop favicon (32x32)"
							})] })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Text & Typography"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Restaurant Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: data.restaurantName,
									onChange: (e) => update("restaurantName", e.target.value),
									placeholder: "Your Restaurant Name"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tagline" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: data.restaurantTagline,
									onChange: (e) => update("restaurantTagline", e.target.value),
									placeholder: "e.g. Taste the Tradition"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Short Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: data.shortDescription,
									onChange: (e) => update("shortDescription", e.target.value),
									rows: 3,
									placeholder: "Brief description..."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Primary Font" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: data.primaryFont,
										onChange: (e) => update("primaryFont", e.target.value),
										className: "w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm",
										children: [
											"Inter",
											"Sora",
											"Poppins",
											"Playfair Display",
											"DM Sans",
											"Space Grotesk"
										].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: f,
											children: f
										}, f))
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Secondary Font" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: data.secondaryFont,
										onChange: (e) => update("secondaryFont", e.target.value),
										className: "w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm",
										children: [
											"Inter",
											"Sora",
											"Poppins",
											"Playfair Display",
											"DM Sans",
											"Space Grotesk"
										].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: f,
											children: f
										}, f))
									})]
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Colors"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "Theme Color",
							value: data.themeColor,
							onChange: (v) => update("themeColor", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "Accent Color",
							value: data.accentColor,
							onChange: (v) => update("accentColor", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "Loader Color",
							value: data.loaderColor,
							onChange: (v) => update("loaderColor", v)
						})
					]
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Header & Animation"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-sm font-medium",
								children: "Enable Animated Header"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-400",
								children: "Scrolling header with restaurant name"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: data.enableAnimatedHeader,
								onCheckedChange: (v) => update("enableAnimatedHeader", v)
							})]
						}),
						data.enableAnimatedHeader && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-sm font-medium",
								children: "Animated Restaurant Name"
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: data.animatedRestaurantName,
								onCheckedChange: (v) => update("animatedRestaurantName", v)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Scrolling Speed (seconds)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									value: [data.scrollingSpeed],
									onValueChange: ([v]) => update("scrollingSpeed", v),
									min: 1,
									max: 10,
									step: .5,
									className: "flex-1"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-mono w-12 text-right",
									children: [data.scrollingSpeed, "s"]
								})]
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-sm font-medium",
								children: "Loader Animation"
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: data.loaderAnimation,
								onCheckedChange: (v) => update("loaderAnimation", v)
							})]
						}),
						data.loaderAnimation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Loader Speed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									value: [data.loaderSpeed],
									onValueChange: ([v]) => update("loaderSpeed", v),
									min: .5,
									max: 3,
									step: .1,
									className: "flex-1"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-mono w-12 text-right",
									children: [data.loaderSpeed, "x"]
								})]
							})]
						})
					]
				})]
			})
		]
	});
}
function DetailsSection({ shopId }) {
	const [data, setData] = (0, import_react.useState)({
		aboutRestaurant: "",
		story: "",
		establishedYear: (/* @__PURE__ */ new Date()).getFullYear(),
		founderName: "",
		ownerName: "",
		managerName: "",
		signatureQuote: "",
		mission: "",
		vision: "",
		cuisineType: "",
		vegNonVeg: "both",
		pureVeg: false,
		seatingCapacity: 0,
		acAvailable: false,
		parkingAvailable: false,
		freeWifi: false,
		homeDelivery: false,
		takeAway: false,
		outdoorSeating: false,
		headChefName: "",
		chefDescription: "",
		chefPhoto: "",
		awards: "",
		certifications: "",
		hygieneRating: 5,
		googleRating: 4.5,
		totalReviews: 0,
		totalCustomersServed: 0,
		openingTime: "09:00",
		closingTime: "22:00",
		weeklyHolidays: ""
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		(async () => {
			const snap = await getDoc(doc(getDb(), COL.details, shopId));
			if (snap.exists()) setData((p) => ({
				...p,
				...snap.data()
			}));
			setLoaded(true);
		})();
	}, [shopId]);
	const update = (k, v) => setData((p) => ({
		...p,
		[k]: v
	}));
	const save = async () => {
		setSaving(true);
		try {
			await setDoc(doc(getDb(), COL.details, shopId), {
				...data,
				updatedAt: serverTimestamp()
			}, { merge: true });
			toast.success("Details saved");
		} catch (e) {
			toast.error(e.message);
		} finally {
			setSaving(false);
		}
	};
	if (!loaded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 w-full" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold",
					children: "Restaurant Details"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: save,
					disabled: saving,
					className: "bg-orange-500 hover:bg-orange-600",
					children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4 mr-2" }), "Save"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-base flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-4 h-4" }), " Restaurant Profile"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "About Restaurant" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: data.aboutRestaurant,
								onChange: (e) => update("aboutRestaurant", e.target.value),
								rows: 4,
								placeholder: "Tell your story..."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Story" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: data.story,
								onChange: (e) => update("story", e.target.value),
								rows: 3,
								placeholder: "The story behind your restaurant..."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Established Year" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: data.establishedYear,
										onChange: (e) => update("establishedYear", parseInt(e.target.value) || (/* @__PURE__ */ new Date()).getFullYear())
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Founder Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: data.founderName,
										onChange: (e) => update("founderName", e.target.value),
										placeholder: "Founder name"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Owner Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: data.ownerName,
										onChange: (e) => update("ownerName", e.target.value),
										placeholder: "Owner name"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Manager Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: data.managerName,
										onChange: (e) => update("managerName", e.target.value),
										placeholder: "Manager name"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, { className: "w-4 h-4" }), " Signature Quote"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: data.signatureQuote,
								onChange: (e) => update("signatureQuote", e.target.value),
								placeholder: "e.g. Good food, good mood"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "w-4 h-4" }), " Mission"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: data.mission,
									onChange: (e) => update("mission", e.target.value),
									rows: 2,
									placeholder: "Our mission..."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-4 h-4" }), " Vision"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: data.vision,
									onChange: (e) => update("vision", e.target.value),
									rows: 2,
									placeholder: "Our vision..."
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-base flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "w-4 h-4" }), " Restaurant Information"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cuisine Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: data.cuisineType,
									onChange: (e) => update("cuisineType", e.target.value),
									placeholder: "e.g. Indian, Italian, Chinese"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Veg / Non-Veg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: data.vegNonVeg,
									onChange: (e) => update("vegNonVeg", e.target.value),
									className: "w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "both",
											children: "Both"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "veg",
											children: "Pure Veg"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "nonveg",
											children: "Non-Veg"
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-sm font-medium",
								children: "Pure Veg Restaurant"
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: data.pureVeg,
								onCheckedChange: (v) => update("pureVeg", v)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Seating Capacity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: data.seatingCapacity,
									onChange: (e) => update("seatingCapacity", parseInt(e.target.value) || 0)
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 sm:grid-cols-3 gap-3",
							children: [
								{
									key: "acAvailable",
									label: "AC Available",
									icon: Wind
								},
								{
									key: "parkingAvailable",
									label: "Parking",
									icon: Car
								},
								{
									key: "freeWifi",
									label: "Free WiFi",
									icon: Wifi
								},
								{
									key: "homeDelivery",
									label: "Home Delivery",
									icon: House
								},
								{
									key: "takeAway",
									label: "Take Away",
									icon: Bell
								},
								{
									key: "outdoorSeating",
									label: "Outdoor Seating",
									icon: MapPin
								}
							].map(({ key, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-4 h-4 text-slate-500" }), label]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: data[key],
									onCheckedChange: (v) => update(key, v)
								})]
							}, key))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-base flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChefHat, { className: "w-4 h-4" }), " Chef"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Head Chef Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: data.headChefName,
								onChange: (e) => update("headChefName", e.target.value),
								placeholder: "Chef name"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Chef Photo" }),
								data.chefPhoto ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative w-24 h-24 rounded-xl overflow-hidden border group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: data.chefPhoto,
										alt: "",
										className: "w-full h-full object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => update("chefPhoto", ""),
											className: "w-6 h-6 rounded-full bg-red-500 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3 h-3 text-white" })
										})
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropZone, {
									onFiles: async (f) => {
										setUploading(true);
										try {
											update("chefPhoto", await uploadToCloudinary(f[0]));
										} catch (e) {
											toast.error(e.message);
										}
										setUploading(false);
									},
									label: "Upload chef photo",
									maxSize: 2
								}),
								uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-orange-600",
									children: "Uploading..."
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Chef Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: data.chefDescription,
							onChange: (e) => update("chefDescription", e.target.value),
							rows: 2,
							placeholder: "About the chef..."
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-base flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "w-4 h-4" }), " Achievements"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Awards" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: data.awards,
								onChange: (e) => update("awards", e.target.value),
								rows: 2,
								placeholder: "List awards..."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Certifications" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: data.certifications,
								onChange: (e) => update("certifications", e.target.value),
								rows: 2,
								placeholder: "List certifications..."
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Hygiene Rating" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										value: [data.hygieneRating],
										onValueChange: ([v]) => update("hygieneRating", v),
										min: 0,
										max: 5,
										step: .5,
										className: "flex-1"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-bold w-8",
										children: data.hygieneRating
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Google Rating" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										value: [data.googleRating],
										onValueChange: ([v]) => update("googleRating", v),
										min: 0,
										max: 5,
										step: .1,
										className: "flex-1"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-sm font-bold w-8",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "w-3 h-3 inline text-yellow-500 fill-yellow-500" }), data.googleRating]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Total Reviews" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: data.totalReviews,
									onChange: (e) => update("totalReviews", parseInt(e.target.value) || 0)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Customers Served" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: data.totalCustomersServed,
									onChange: (e) => update("totalCustomersServed", parseInt(e.target.value) || 0)
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-base flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4" }), " Business Hours"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Opening Time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "time",
								value: data.openingTime,
								onChange: (e) => update("openingTime", e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Closing Time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "time",
								value: data.closingTime,
								onChange: (e) => update("closingTime", e.target.value)
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Weekly Holidays" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: data.weeklyHolidays,
							onChange: (e) => update("weeklyHolidays", e.target.value),
							placeholder: "e.g. Monday, Tuesday"
						})]
					})]
				})]
			})
		]
	});
}
function GallerySection({ shopId }) {
	const [galleryTab, setGalleryTab] = (0, import_react.useState)("restaurant");
	const [images, setImages] = (0, import_react.useState)({
		restaurant: [],
		food: [],
		interior: [],
		exterior: [],
		team: []
	});
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		(async () => {
			const snap = await getDoc(doc(getDb(), COL.gallery, shopId));
			if (snap.exists()) setImages((p) => ({
				...p,
				...snap.data()
			}));
			setLoaded(true);
		})();
	}, [shopId]);
	const saveImages = async (updated) => {
		await setDoc(doc(getDb(), COL.gallery, shopId), updated, { merge: true });
	};
	const handleUpload = async (files) => {
		setUploading(true);
		try {
			const urls = [];
			for (const file of files) urls.push(await uploadToCloudinary(file));
			const updated = {
				...images,
				[galleryTab]: [...images[galleryTab], ...urls]
			};
			setImages(updated);
			await saveImages(updated);
			toast.success(`${urls.length} image(s) uploaded`);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setUploading(false);
		}
	};
	const removeImage = async (tab, index) => {
		const updated = {
			...images,
			[tab]: images[tab].filter((_, i) => i !== index)
		};
		setImages(updated);
		await saveImages(updated);
	};
	const replaceImage = async (tab, index) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.onchange = async (e) => {
			const file = e.target.files?.[0];
			if (!file) return;
			try {
				const url = await uploadToCloudinary(file);
				const items = [...images[tab]];
				items[index] = url;
				const updated = {
					...images,
					[tab]: items
				};
				setImages(updated);
				await saveImages(updated);
			} catch (e) {
				toast.error(e.message);
			}
		};
		input.click();
	};
	if (!loaded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 w-full" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl font-bold",
			children: "Gallery"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			value: galleryTab,
			onValueChange: setGalleryTab,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
				className: "flex flex-wrap h-auto w-full justify-start mb-4 gap-1 bg-transparent",
				children: [
					{
						value: "restaurant",
						label: "Restaurant Photos",
						icon: Image
					},
					{
						value: "food",
						label: "Food Photos",
						icon: Utensils
					},
					{
						value: "interior",
						label: "Interior",
						icon: House
					},
					{
						value: "exterior",
						label: "Exterior",
						icon: MapPin
					},
					{
						value: "team",
						label: "Team Photos",
						icon: Users
					}
				].map(({ value, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
					value,
					className: "data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 rounded-xl px-3 py-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-3.5 h-3.5 mr-1.5" }), label]
				}, value))
			}), [
				"restaurant",
				"food",
				"interior",
				"exterior",
				"team"
			].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: tab,
				className: "space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "pt-6 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropZone, {
								onFiles: handleUpload,
								multiple: true,
								label: `Drop ${tab} photos here`
							}),
							uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm text-orange-600",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), " Uploading..."]
							}),
							images[tab].length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3",
								children: images[tab].map((url, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImgPreview, {
									src: url,
									onDelete: () => removeImage(tab, idx),
									onReplace: () => replaceImage(tab, idx)
								}, url))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center py-8 text-slate-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "w-12 h-12 mx-auto mb-2 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm",
									children: "No images yet."
								})]
							})
						]
					})
				})
			}, tab))]
		})]
	});
}
function ContactSection({ shopId }) {
	const [data, setData] = (0, import_react.useState)({
		phone: "",
		whatsapp: "",
		email: "",
		website: "",
		address: "",
		googleMapsLink: "",
		latitude: "",
		longitude: "",
		instagram: "",
		facebook: "",
		youtube: "",
		x: "",
		threads: ""
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		(async () => {
			const snap = await getDoc(doc(getDb(), COL.contact, shopId));
			if (snap.exists()) setData((p) => ({
				...p,
				...snap.data()
			}));
			setLoaded(true);
		})();
	}, [shopId]);
	const update = (k, v) => setData((p) => ({
		...p,
		[k]: v
	}));
	const save = async () => {
		setSaving(true);
		try {
			await setDoc(doc(getDb(), COL.contact, shopId), {
				...data,
				updatedAt: serverTimestamp()
			}, { merge: true });
			toast.success("Contact saved");
		} catch (e) {
			toast.error(e.message);
		} finally {
			setSaving(false);
		}
	};
	if (!loaded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 w-full" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold",
					children: "Contact & Social"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: save,
					disabled: saving,
					className: "bg-orange-500 hover:bg-orange-600",
					children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4 mr-2" }), "Save"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-base flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4" }), " Contact Information"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4 text-slate-400" }), " Phone"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: data.phone,
										onChange: (e) => update("phone", e.target.value),
										placeholder: "+1 234 567 890"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "w-4 h-4 text-green-500" }), " WhatsApp"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: data.whatsapp,
										onChange: (e) => update("whatsapp", e.target.value),
										placeholder: "+1 234 567 890"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-4 h-4 text-slate-400" }), " Email"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: data.email,
										onChange: (e) => update("email", e.target.value),
										placeholder: "contact@restaurant.com"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-4 h-4 text-slate-400" }), " Website"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: data.website,
										onChange: (e) => update("website", e.target.value),
										placeholder: "https://restaurant.com"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-4 h-4 text-slate-400" }), " Address"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: data.address,
								onChange: (e) => update("address", e.target.value),
								rows: 2,
								placeholder: "Full address"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map, { className: "w-4 h-4 text-red-500" }), " Google Maps URL"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: data.googleMapsLink,
										onChange: (e) => update("googleMapsLink", e.target.value),
										placeholder: "https://maps.google.com/?q=..."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "w-4 h-4 text-slate-400" }), " Latitude"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: data.latitude,
										onChange: (e) => update("latitude", e.target.value),
										placeholder: "28.6139"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "w-4 h-4 text-slate-400" }), " Longitude"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: data.longitude,
										onChange: (e) => update("longitude", e.target.value),
										placeholder: "77.2090"
									})]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-base flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-4 h-4" }), " Social Media"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "w-4 h-4 text-pink-500" }), " Instagram"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: data.instagram,
									onChange: (e) => update("instagram", e.target.value),
									placeholder: "https://instagram.com/yourpage"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "w-4 h-4 text-blue-600" }), " Facebook"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: data.facebook,
									onChange: (e) => update("facebook", e.target.value),
									placeholder: "https://facebook.com/yourpage"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "w-4 h-4 text-red-600" }), " YouTube"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: data.youtube,
									onChange: (e) => update("youtube", e.target.value),
									placeholder: "https://youtube.com/@channel"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { className: "w-4 h-4 text-slate-400" }), " X (Twitter)"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: data.x,
									onChange: (e) => update("x", e.target.value),
									placeholder: "https://x.com/profile"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music2, { className: "w-4 h-4 text-slate-400" }), " Threads"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: data.threads,
									onChange: (e) => update("threads", e.target.value),
									placeholder: "https://threads.net/@profile"
								})]
							})
						]
					})
				})]
			})
		]
	});
}
function ThemeSection({ shopId }) {
	const [data, setData] = (0, import_react.useState)({
		primaryColor: "#F97316",
		secondaryColor: "#1E293B",
		accentColor: "#10B981",
		background: "#FFFFFF",
		cards: "#FFFFFF",
		buttons: "#F97316",
		font: "Inter",
		borderRadius: 12,
		darkMode: false,
		glassEffect: false,
		animationSpeed: 1
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		(async () => {
			const snap = await getDoc(doc(getDb(), COL.theme, shopId));
			if (snap.exists()) setData((p) => ({
				...p,
				...snap.data()
			}));
			setLoaded(true);
		})();
	}, [shopId]);
	const update = (k, v) => setData((p) => ({
		...p,
		[k]: v
	}));
	const save = async () => {
		setSaving(true);
		try {
			await setDoc(doc(getDb(), COL.theme, shopId), {
				...data,
				updatedAt: serverTimestamp()
			}, { merge: true });
			toast.success("Theme saved");
		} catch (e) {
			toast.error(e.message);
		} finally {
			setSaving(false);
		}
	};
	if (!loaded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 w-full" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold",
					children: "Theme & Appearance"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: save,
					disabled: saving,
					className: "bg-orange-500 hover:bg-orange-600",
					children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4 mr-2" }), "Save"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-base flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "w-4 h-4" }), " Colors"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "Primary Color",
							value: data.primaryColor,
							onChange: (v) => update("primaryColor", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "Secondary Color",
							value: data.secondaryColor,
							onChange: (v) => update("secondaryColor", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "Accent Color",
							value: data.accentColor,
							onChange: (v) => update("accentColor", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "Background",
							value: data.background,
							onChange: (v) => update("background", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "Cards",
							value: data.cards,
							onChange: (v) => update("cards", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "Buttons",
							value: data.buttons,
							onChange: (v) => update("buttons", v)
						})
					]
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-base flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelsTopLeft, { className: "w-4 h-4" }), " Style Settings"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Font" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: data.font,
								onChange: (e) => update("font", e.target.value),
								className: "w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm",
								children: [
									"Inter",
									"Sora",
									"Poppins",
									"Playfair Display",
									"DM Sans",
									"Space Grotesk"
								].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: f,
									children: f
								}, f))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
								"Border Radius: ",
								data.borderRadius,
								"px"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								value: [data.borderRadius],
								onValueChange: ([v]) => update("borderRadius", v),
								min: 0,
								max: 32,
								step: 1
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Animation Speed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									value: [data.animationSpeed],
									onValueChange: ([v]) => update("animationSpeed", v),
									min: .5,
									max: 3,
									step: .1,
									className: "flex-1"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-mono w-12 text-right",
									children: [data.animationSpeed, "x"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-sm font-medium",
								children: "Dark Mode"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-400",
								children: "Enable dark theme"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: data.darkMode,
								onCheckedChange: (v) => update("darkMode", v)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-sm font-medium",
								children: "Glass Effect"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-400",
								children: "Frosted glass UI elements"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: data.glassEffect,
								onCheckedChange: (v) => update("glassEffect", v)
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-base flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-4 h-4" }), " Live Preview"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl overflow-hidden border shadow-sm",
					style: {
						fontFamily: data.font,
						background: data.background,
						borderRadius: data.borderRadius
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6 text-white text-center",
						style: { background: `linear-gradient(135deg, ${data.primaryColor}, ${data.secondaryColor})` },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xl font-bold",
							children: "Your Restaurant"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm opacity-80 mt-1",
							children: "Taste the Tradition"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 space-y-3",
						style: { background: data.cards },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "flex-1 py-2 text-sm font-semibold text-white",
								style: {
									background: data.buttons,
									borderRadius: data.borderRadius
								},
								children: "Order Now"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "flex-1 py-2 text-sm font-semibold",
								style: {
									border: `2px solid ${data.buttons}`,
									color: data.buttons,
									borderRadius: data.borderRadius
								},
								children: "View Menu"
							})]
						})
					})]
				}) })]
			})
		]
	});
}
function AnnouncementsSection({ shopId }) {
	const [announcements, setAnnouncements] = (0, import_react.useState)([]);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const unsub = onSnapshot(query(collection(getDb(), COL.announcements), where("shopId", "==", shopId), orderBy("createdAt", "desc")), (snap) => {
			setAnnouncements(snap.docs.map((d) => ({
				id: d.id,
				...d.data()
			})));
			setLoaded(true);
		});
		return () => unsub();
	}, [shopId]);
	const deleteItem = async (id) => {
		await deleteDoc(doc(getDb(), COL.announcements, id));
		toast.success("Deleted");
	};
	const toggleStatus = async (item) => {
		await updateDoc(doc(getDb(), COL.announcements, item.id), { active: !item.active });
	};
	if (!loaded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 w-full" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold",
					children: "Announcements"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						setEditing(null);
						setShowForm(true);
					},
					className: "bg-orange-500 hover:bg-orange-600",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), "New Announcement"]
				})]
			}),
			showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnnouncementForm, {
				shopId,
				edit: editing,
				onClose: () => {
					setShowForm(false);
					setEditing(null);
				},
				onSaved: () => {
					setShowForm(false);
					setEditing(null);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [announcements.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "py-12 text-center text-slate-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "w-12 h-12 mx-auto mb-2 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No announcements yet." })]
					})
				}), announcements.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: `shadow-soft ${item.active ? "" : "opacity-60"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "py-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mb-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-semibold text-sm",
												children: item.title
											}),
											item.pinned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "w-3 h-3 text-orange-500" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: item.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500",
												children: item.active ? "Active" : "Inactive"
											}),
											item.priority === "high" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: "bg-red-100 text-red-700",
												children: "High"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-slate-600 line-clamp-2",
										children: item.message
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 mt-2 text-xs text-slate-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3 h-3" }), item.startDate || "No date"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "w-3 h-3" }), item.display || "Both"]
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => toggleStatus(item),
										children: item.active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRight, { className: "w-4 h-4 text-green-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleLeft, { className: "w-4 h-4 text-slate-400" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => {
											setEditing(item);
											setShowForm(true);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-4 h-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => deleteItem(item.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-red-500" })
									})
								]
							})]
						})
					})
				}, item.id))]
			})
		]
	});
}
function AnnouncementForm({ shopId, edit, onClose, onSaved }) {
	const [form, setForm] = (0, import_react.useState)({
		title: edit?.title || "",
		message: edit?.message || "",
		bannerImage: edit?.bannerImage || "",
		priority: edit?.priority || "normal",
		startDate: edit?.startDate || "",
		endDate: edit?.endDate || "",
		buttonText: edit?.buttonText || "",
		buttonUrl: edit?.buttonUrl || "",
		backgroundColor: edit?.backgroundColor || "#F97316",
		active: edit?.active ?? true,
		pinned: edit?.pinned ?? false,
		display: edit?.display || "both"
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const update = (k, v) => setForm((p) => ({
		...p,
		[k]: v
	}));
	const save = async () => {
		setSaving(true);
		try {
			const p = {
				...form,
				shopId,
				updatedAt: serverTimestamp()
			};
			if (edit?.id) {
				await updateDoc(doc(getDb(), COL.announcements, edit.id), p);
				toast.success("Updated");
			} else {
				await addDoc(collection(getDb(), COL.announcements), {
					...p,
					createdAt: serverTimestamp()
				});
				toast.success("Created");
			}
			onSaved();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "shadow-soft border-orange-100",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "pt-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-semibold",
						children: [edit ? "Edit" : "New", " Announcement"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: onClose,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.title,
							onChange: (e) => update("title", e.target.value),
							placeholder: "Announcement title"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Priority" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: form.priority,
							onChange: (e) => update("priority", e.target.value),
							className: "w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "low",
									children: "Low"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "normal",
									children: "Normal"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "high",
									children: "High"
								})
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Message" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: form.message,
						onChange: (e) => update("message", e.target.value),
						rows: 3,
						placeholder: "Announcement message..."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Start Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: form.startDate,
								onChange: (e) => update("startDate", e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "End Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: form.endDate,
								onChange: (e) => update("endDate", e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Button Text" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.buttonText,
								onChange: (e) => update("buttonText", e.target.value),
								placeholder: "Learn More"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Button URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.buttonUrl,
								onChange: (e) => update("buttonUrl", e.target.value),
								placeholder: "https://..."
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
						label: "Background Color",
						value: form.backgroundColor,
						onChange: (v) => update("backgroundColor", v)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Display On" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: form.display,
							onChange: (e) => update("display", e.target.value),
							className: "w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "both",
									children: "Both"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "home",
									children: "Home"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "portal",
									children: "Portal"
								})
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Banner Image" }),
						form.bannerImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full h-32 rounded-xl overflow-hidden border group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: form.bannerImage,
								alt: "",
								className: "w-full h-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => update("bannerImage", ""),
									className: "w-7 h-7 rounded-full bg-red-500 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5 text-white" })
								})
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropZone, {
							onFiles: async (f) => {
								setUploading(true);
								try {
									update("bannerImage", await uploadToCloudinary(f[0]));
								} catch (e) {
									toast.error(e.message);
								}
								setUploading(false);
							},
							label: "Upload banner"
						}),
						uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-orange-600",
							children: "Uploading..."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: form.active,
							onCheckedChange: (v) => update("active", v)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-sm",
							children: "Active"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: form.pinned,
							onCheckedChange: (v) => update("pinned", v)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-sm",
							children: "Pinned"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: save,
					disabled: saving,
					className: "bg-orange-500 hover:bg-orange-600",
					children: [
						saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4 mr-2" }),
						edit ? "Update" : "Create",
						" Announcement"
					]
				})
			]
		})
	});
}
function ReviewsSection({ shopId }) {
	const [reviews, setReviews] = (0, import_react.useState)([]);
	const [filter, setFilter] = (0, import_react.useState)("pending");
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	const [replyText, setReplyText] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		const unsub = onSnapshot(query(collection(getDb(), COL.reviews), where("shopId", "==", shopId), orderBy("createdAt", "desc")), (snap) => {
			setReviews(snap.docs.map((d) => ({
				id: d.id,
				...d.data()
			})));
			setLoaded(true);
		});
		return () => unsub();
	}, [shopId]);
	const updateStatus = async (id, status) => {
		await updateDoc(doc(getDb(), COL.reviews, id), {
			status,
			updatedAt: serverTimestamp()
		});
		toast.success(`Review ${status}`);
	};
	const submitReply = async (id) => {
		const text = replyText[id]?.trim();
		if (!text) return;
		await updateDoc(doc(getDb(), COL.reviews, id), {
			reply: text,
			repliedAt: serverTimestamp()
		});
		setReplyText((p) => ({
			...p,
			[id]: ""
		}));
		toast.success("Reply posted");
	};
	const deleteReview = async (id) => {
		await deleteDoc(doc(getDb(), COL.reviews, id));
		toast.success("Deleted");
	};
	const togglePin = async (item) => {
		await updateDoc(doc(getDb(), COL.reviews, item.id), { pinned: !item.pinned });
	};
	if (!loaded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 w-full" });
	const filtered = reviews.filter((r) => filter === "all" || r.status === filter);
	const avg = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1) : "0.0";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold",
					children: "Reviews"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-slate-500",
							children: "Avg:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "w-4 h-4 text-yellow-500 fill-yellow-500" }), avg]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-slate-400",
							children: [
								"(",
								reviews.length,
								")"
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 flex-wrap",
				children: [
					"pending",
					"approved",
					"rejected",
					"all"
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setFilter(f),
					className: `px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${filter === f ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
					children: [
						f.charAt(0).toUpperCase() + f.slice(1),
						" ",
						f !== "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-1 opacity-70",
							children: [
								"(",
								reviews.filter((r) => r.status === f).length,
								")"
							]
						})
					]
				}, f))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "py-12 text-center text-slate-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-12 h-12 mx-auto mb-2 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No reviews found." })]
					})
				}), filtered.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: `shadow-soft ${item.pinned ? "border-orange-200 ring-1 ring-orange-100" : ""}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "py-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mb-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-semibold text-sm",
												children: item.name || "Anonymous"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-0.5",
												children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `w-3 h-3 ${i < (item.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-slate-200"}` }, i))
											}),
											item.pinned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "w-3 h-3 text-orange-500" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: item.status === "approved" ? "bg-green-100 text-green-700" : item.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700",
												children: item.status
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-slate-600",
										children: item.review
									}),
									item.photo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: item.photo,
										alt: "",
										className: "w-16 h-16 rounded-xl object-cover mt-2 border"
									}),
									item.reply && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-slate-500 mb-1",
											children: "Your Reply:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-slate-700",
											children: item.reply
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: replyText[item.id] || "",
											onChange: (e) => setReplyText((p) => ({
												...p,
												[item.id]: e.target.value
											})),
											placeholder: "Write a reply...",
											className: "h-8 text-xs rounded-lg"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => submitReply(item.id),
											className: "h-8 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reply, { className: "w-3 h-3 mr-1" }), "Reply"]
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 shrink-0",
								children: [
									item.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => updateStatus(item.id, "approved"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 text-green-600" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => updateStatus(item.id, "rejected"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4 text-red-500" })
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => togglePin(item),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: `w-4 h-4 ${item.pinned ? "text-orange-500" : "text-slate-400"}` })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => deleteReview(item.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-red-500" })
									})
								]
							})]
						})
					})
				}, item.id))]
			})
		]
	});
}
function FAQSection({ shopId }) {
	const [faqs, setFaqs] = (0, import_react.useState)([]);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const unsub = onSnapshot(query(collection(getDb(), COL.faqs), where("shopId", "==", shopId), orderBy("displayOrder", "asc")), (snap) => {
			setFaqs(snap.docs.map((d) => ({
				id: d.id,
				...d.data()
			})));
			setLoaded(true);
		});
		return () => unsub();
	}, [shopId]);
	const deleteFaq = async (id) => {
		await deleteDoc(doc(getDb(), COL.faqs, id));
		toast.success("Deleted");
	};
	const moveItem = async (index, dir) => {
		const items = [...faqs];
		const target = dir === "up" ? index - 1 : index + 1;
		if (target < 0 || target >= items.length) return;
		[items[index], items[target]] = [items[target], items[index]];
		for (let i = 0; i < items.length; i++) await updateDoc(doc(getDb(), COL.faqs, items[i].id), { displayOrder: i });
		setFaqs(items);
	};
	if (!loaded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 w-full" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold",
					children: "FAQ"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						setEditing(null);
						setShowForm(true);
					},
					className: "bg-orange-500 hover:bg-orange-600",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), "Add FAQ"]
				})]
			}),
			showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQForm, {
				shopId,
				edit: editing,
				onClose: () => {
					setShowForm(false);
					setEditing(null);
				},
				onSaved: () => {
					setShowForm(false);
					setEditing(null);
				},
				nextOrder: faqs.length
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [faqs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "py-12 text-center text-slate-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "w-12 h-12 mx-auto mb-2 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No FAQs yet." })]
					})
				}), faqs.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: `shadow-soft ${!item.active ? "opacity-60" : ""}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-slate-400 font-mono",
											children: ["#", idx + 1]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-medium text-sm",
											children: item.question
										}),
										item.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px]",
											children: item.category
										}),
										!item.active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-slate-100 text-slate-500 text-[10px]",
											children: "Hidden"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-slate-500 mt-1 line-clamp-2",
									children: item.answer
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => moveItem(idx, "up"),
										disabled: idx === 0,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChefHat, { className: "w-3 h-3 rotate-90" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => moveItem(idx, "down"),
										disabled: idx === faqs.length - 1,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChefHat, { className: "w-3 h-3 -rotate-90" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => {
											setEditing(item);
											setShowForm(true);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-4 h-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => deleteFaq(item.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-red-500" })
									})
								]
							})]
						})
					})
				}, item.id))]
			})
		]
	});
}
function FAQForm({ shopId, edit, onClose, onSaved, nextOrder }) {
	const [form, setForm] = (0, import_react.useState)({
		question: edit?.question || "",
		answer: edit?.answer || "",
		category: edit?.category || "",
		displayOrder: edit?.displayOrder ?? nextOrder,
		active: edit?.active ?? true
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const save = async () => {
		setSaving(true);
		try {
			const p = {
				...form,
				shopId,
				updatedAt: serverTimestamp()
			};
			if (edit?.id) {
				await updateDoc(doc(getDb(), COL.faqs, edit.id), p);
				toast.success("FAQ updated");
			} else {
				await addDoc(collection(getDb(), COL.faqs), {
					...p,
					createdAt: serverTimestamp()
				});
				toast.success("FAQ added");
			}
			onSaved();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "shadow-soft border-orange-100",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "pt-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-semibold",
						children: [edit ? "Edit" : "Add", " FAQ"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: onClose,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Question" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.question,
						onChange: (e) => setForm((p) => ({
							...p,
							question: e.target.value
						})),
						placeholder: "Frequently asked question"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Answer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: form.answer,
						onChange: (e) => setForm((p) => ({
							...p,
							answer: e.target.value
						})),
						rows: 3,
						placeholder: "Answer..."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.category,
							onChange: (e) => setForm((p) => ({
								...p,
								category: e.target.value
							})),
							placeholder: "e.g. Orders, Delivery"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Display Order" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: form.displayOrder,
							onChange: (e) => setForm((p) => ({
								...p,
								displayOrder: parseInt(e.target.value) || 0
							}))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: form.active,
						onCheckedChange: (v) => setForm((p) => ({
							...p,
							active: v
						}))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-sm",
						children: "Active"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: save,
					disabled: saving,
					className: "bg-orange-500 hover:bg-orange-600",
					children: [
						saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4 mr-2" }),
						edit ? "Update" : "Add",
						" FAQ"
					]
				})
			]
		})
	});
}
//#endregion
export { RestaurantCMSPage as component };
