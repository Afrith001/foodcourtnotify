import { o as __toESM } from "../_runtime.mjs";
import { D as setDoc, M as doc, O as updateDoc, P as serverTimestamp, S as limit, T as query, b as getDoc, j as collection, k as where, x as getDocs } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { a as signOut, i as signInWithEmailAndPassword, t as createUserWithEmailAndPassword } from "../_libs/firebase__auth.mjs";
import { a as getFirebaseAuth, n as firebaseConfigured, r as getDb, t as COL } from "./firebase-jX9Hxz-N.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-ZV2o_Ft7.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./auth-DlKPnlM9.mjs";
import { t as Input } from "./input-B-tDUnPX.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Button } from "./button-ufo6MiTZ.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-WFFmfsjP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Toaster$1 } from "./sonner-DoFKumIW.mjs";
import { Ut as ChefHat, mt as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BNIjZ3LV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function generateShopCode(len = 6) {
	let out = "";
	for (let i = 0; i < len; i++) out += ALPHABET[Math.floor(Math.random() * 32)];
	return out;
}
/** Pick a shop code that isn't taken yet. Best-effort uniqueness check. */
async function pickUniqueShopCode() {
	const db = getDb();
	for (let attempt = 0; attempt < 8; attempt++) {
		const code = generateShopCode(6);
		doc(db, COL.shops, `code_${code}`);
		const { query, where, collection, getDocs, limit } = await import("../_libs/firebase.mjs").then((n) => n.t);
		if ((await getDocs(query(collection(db, COL.shops), where("shopCode", "==", code), limit(1)))).empty) return code;
	}
	return generateShopCode(8);
}
function describeAuthError(err) {
	switch (err?.code ?? "") {
		case "auth/invalid-credential":
		case "auth/wrong-password":
		case "auth/user-not-found": return "Incorrect email or password.";
		case "auth/invalid-email": return "That email address is invalid.";
		case "auth/email-already-in-use": return "An account with this email already exists. Please sign in.";
		case "auth/weak-password": return "Password must be at least 6 characters.";
		case "auth/network-request-failed": return "Network error — check your internet connection.";
		case "auth/too-many-requests": return "Too many attempts. Please wait a minute and try again.";
		case "auth/api-key-not-valid":
		case "auth/invalid-api-key": return "Firebase API key is missing. Add VITE_FIREBASE_API_KEY to .env.";
		default: return err?.message || "Something went wrong. Please try again.";
	}
}
function AuthPage() {
	const { mode } = Route.useSearch();
	const navigate = useNavigate();
	const [tab, setTab] = (0, import_react.useState)(mode ?? "signin");
	(0, import_react.useEffect)(() => {
		if (!firebaseConfigured) return;
		const auth = getFirebaseAuth();
		const db = getDb();
		const unsub = auth.onAuthStateChanged(async (u) => {
			if (u) try {
				if (!(await getDocs(query(collection(db, COL.staff), where("userId", "==", u.uid), where("active", "==", true), limit(1)))).empty) {
					navigate({ to: "/dashboard" });
					return;
				}
				if (u.email) try {
					if (!(await getDocs(query(collection(db, COL.staff), where("email", "==", u.email), where("active", "==", true), limit(1)))).empty) {
						navigate({ to: "/dashboard" });
						return;
					}
				} catch (e) {
					console.warn("[AuthPage] Querying staff by email failed. If you need email-based auto-linking, update Firestore Security Rules.", e);
				}
				let shopsSnap = await getDocs(query(collection(db, COL.shops), where("ownerId", "==", u.uid), limit(1)));
				if (shopsSnap.empty && u.email) try {
					shopsSnap = await getDocs(query(collection(db, COL.shops), where("email", "==", u.email), limit(1)));
				} catch (e) {
					console.warn("[AuthPage] Querying shops by email failed. If you need email-based auto-linking, update Firestore Security Rules.", e);
				}
				if (!shopsSnap.empty) navigate({ to: "/dashboard" });
				else navigate({
					to: "/auth",
					search: { mode: "signup" }
				});
			} catch (err) {
				console.error("[AuthPage] Error checking shop status on auth change:", err);
				navigate({
					to: "/auth",
					search: { mode: "signup" }
				});
			}
		});
		return () => unsub();
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex bg-[linear-gradient(135deg,_rgba(255,250,243,0.98),_rgba(248,239,228,0.95))]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden lg:flex flex-1 gradient-hero p-12 text-primary-foreground flex-col justify-between shadow-[inset_-4px_0_40px_rgba(0,0,0,0.16)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-9 h-9 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChefHat, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display font-bold text-lg",
							children: "FoodCourtNotify"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-4xl font-bold leading-tight max-w-md",
						children: "One platform. Every shop. Zero confusion."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-primary-foreground/80 max-w-md",
						children: "QR portals, real-time order alerts, customer CRM, coupons and campaigns — isolated per shop on Firebase."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-primary-foreground/70",
						children: "© FoodCourtNotify"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_left,_rgba(182,124,47,0.16),_transparent_28%)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md",
					children: [
						!firebaseConfigured && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive",
							children: [
								"Firebase API key is missing. Add ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "VITE_FIREBASE_API_KEY" }),
								" to your",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: ".env" }),
								" file and reload."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
							value: tab,
							onValueChange: (v) => setTab(v),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
									className: "grid grid-cols-2 w-full mb-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "signin",
										children: "Sign in"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "signup",
										children: "Create shop"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "signin",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInCard, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "signup",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignUpCard, { onDone: () => setTab("signin") })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center mt-6 text-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "text-muted-foreground hover:text-foreground",
								children: "← Back home"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
				richColors: true,
				position: "top-right"
			})
		]
	});
}
function SignInCard() {
	const navigate = useNavigate();
	const [shopName, setShopName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const submit = async (e) => {
		e.preventDefault();
		if (!shopName.trim()) {
			toast.error("Please enter your shop name.");
			return;
		}
		if (!email.trim() || !password) {
			toast.error("Email and password are required.");
			return;
		}
		setBusy(true);
		try {
			const auth = getFirebaseAuth();
			const db = getDb();
			const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
			let staffSnap = await getDocs(query(collection(db, COL.staff), where("userId", "==", cred.user.uid), where("active", "==", true)));
			if (staffSnap.empty && cred.user.email) try {
				const staffEmailSnap = await getDocs(query(collection(db, COL.staff), where("email", "==", cred.user.email), where("active", "==", true)));
				if (!staffEmailSnap.empty) {
					for (const docSnap of staffEmailSnap.docs) await updateDoc(docSnap.ref, { userId: cred.user.uid });
					staffSnap = await getDocs(query(collection(db, COL.staff), where("userId", "==", cred.user.uid), where("active", "==", true)));
				}
			} catch (e) {
				console.warn("[SignInCard] Fallback staff query/update by email failed due to permissions.", e);
			}
			if (staffSnap.empty) {
				let shopsSnap = await getDocs(query(collection(db, COL.shops), where("ownerId", "==", cred.user.uid), limit(1)));
				if (shopsSnap.empty && cred.user.email) try {
					shopsSnap = await getDocs(query(collection(db, COL.shops), where("email", "==", cred.user.email), limit(1)));
				} catch (e) {
					console.warn("[SignInCard] Fallback shops query by email failed due to permissions.", e);
				}
				if (!shopsSnap.empty) {
					const shopDoc = shopsSnap.docs[0];
					const shopId = shopDoc.id;
					try {
						if (shopDoc.data().ownerId !== cred.user.uid) await updateDoc(doc(db, COL.shops, shopId), { ownerId: cred.user.uid });
					} catch (e) {
						console.warn("[SignInCard] Fallback shop updateDoc ownerId failed due to permissions.", e);
					}
					const userDoc = await getDoc(doc(db, COL.users, cred.user.uid));
					const userData = userDoc.exists() ? userDoc.data() : null;
					const fullName = userData?.fullName || cred.user.displayName || "Owner";
					const emailVal = userData?.email || cred.user.email || "";
					await setDoc(doc(collection(db, COL.staff)), {
						shopId,
						userId: cred.user.uid,
						role: "owner",
						fullName,
						email: emailVal,
						active: true,
						createdAt: serverTimestamp()
					});
					staffSnap = await getDocs(query(collection(db, COL.staff), where("userId", "==", cred.user.uid), where("active", "==", true)));
				}
			}
			if (staffSnap.empty) {
				await signOut(auth);
				toast.error("This account is not linked to any shop.");
				return;
			}
			const shopIds = staffSnap.docs.map((d) => d.data().shopId);
			const target = shopName.trim().toLowerCase();
			let matched = false;
			for (const sid of shopIds) {
				const sd = await getDoc(doc(db, COL.shops, sid));
				if (sd.exists() && (sd.data().name ?? "").toLowerCase().trim() === target) {
					matched = true;
					break;
				}
			}
			if (!matched) {
				const existsSnap = await getDocs(query(collection(db, COL.shops), where("name", "==", shopName.trim()), limit(1)));
				await signOut(auth);
				toast.error(existsSnap.empty ? "Shop not found." : "This account does not belong to the selected shop.");
				return;
			}
			toast.success("Welcome back!");
			navigate({ to: "/dashboard" });
		} catch (err) {
			toast.error(describeAuthError(err));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "font-display",
			children: "Welcome back"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Sign in to your shop dashboard." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-4",
			onSubmit: submit,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "si-shop",
						children: "Shop name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "si-shop",
						value: shopName,
						onChange: (e) => setShopName(e.target.value),
						placeholder: "e.g. Spice Hut"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "si-email",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "si-email",
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "si-pass",
						children: "Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "si-pass",
						type: "password",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "w-full",
					disabled: busy,
					children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }), "Sign in"]
				})
			]
		}) })]
	});
}
function SignUpCard({ onDone }) {
	const navigate = useNavigate();
	const auth = getFirebaseAuth();
	const [currentUser, setCurrentUser] = (0, import_react.useState)(auth.currentUser);
	const [form, setForm] = (0, import_react.useState)({
		shopName: "",
		ownerName: "",
		email: "",
		password: "",
		mobile: "",
		category: "Food"
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const unsub = auth.onAuthStateChanged((u) => {
			setCurrentUser(u);
			if (u?.email) setForm((prev) => ({
				...prev,
				email: u.email || ""
			}));
		});
		return () => unsub();
	}, [auth]);
	const set = (k) => (e) => setForm({
		...form,
		[k]: e.target.value
	});
	const submit = async (e) => {
		e.preventDefault();
		if (!form.shopName.trim()) {
			toast.error("Shop name is required.");
			return;
		}
		if (!currentUser && (!form.email.trim() || !form.password)) {
			toast.error("Email and password are required.");
			return;
		}
		if (!currentUser && form.password.length < 6) {
			toast.error("Password must be at least 6 characters.");
			return;
		}
		setBusy(true);
		try {
			const db = getDb();
			let uid = "";
			let email = "";
			if (currentUser) {
				uid = currentUser.uid;
				email = currentUser.email || form.email.trim();
				const userDocRef = doc(db, COL.users, uid);
				if (!(await getDoc(userDocRef)).exists()) await setDoc(userDocRef, {
					uid,
					fullName: form.ownerName || currentUser.displayName || null,
					email,
					mobile: form.mobile || null,
					createdAt: serverTimestamp()
				});
			} else {
				const cred = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
				uid = cred.user.uid;
				email = cred.user.email || form.email.trim();
				await setDoc(doc(db, COL.users, uid), {
					uid,
					fullName: form.ownerName || null,
					email,
					mobile: form.mobile || null,
					createdAt: serverTimestamp()
				});
			}
			const shopCode = await pickUniqueShopCode();
			const shopRef = doc(collection(db, COL.shops));
			await setDoc(shopRef, {
				shopCode,
				name: form.shopName.trim(),
				category: form.category || null,
				themeColor: "#10b981",
				logoUrl: null,
				bannerUrl: null,
				address: null,
				phone: form.mobile || null,
				email,
				ownerId: uid,
				createdAt: serverTimestamp()
			});
			await setDoc(doc(collection(db, COL.staff)), {
				shopId: shopRef.id,
				userId: uid,
				role: "owner",
				fullName: form.ownerName || (currentUser ? currentUser.displayName : null) || null,
				email,
				active: true,
				createdAt: serverTimestamp()
			});
			const expires = /* @__PURE__ */ new Date();
			expires.setDate(expires.getDate() + 30);
			await setDoc(doc(db, COL.subscriptions, shopRef.id), {
				shopId: shopRef.id,
				plan: "free",
				ordersUsedThisMonth: 0,
				renewedAt: serverTimestamp(),
				expiresAt: expires.toISOString()
			});
			await setDoc(doc(db, COL.shopCounters, shopRef.id), { orderNumber: 0 });
			if (currentUser) {
				toast.success(`Shop created! Code: ${shopCode}.`);
				navigate({ to: "/dashboard" });
			} else {
				toast.success(`Shop created! Code: ${shopCode}. Please sign in.`);
				await signOut(auth);
				onDone();
			}
		} catch (err) {
			toast.error(describeAuthError(err));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "font-display",
			children: "Open your shop"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Get your QR portal and dashboard in seconds." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3",
			onSubmit: submit,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Shop name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.shopName,
							onChange: set("shopName"),
							required: true
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Owner name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.ownerName,
							onChange: set("ownerName")
						})]
					})]
				}),
				currentUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5 bg-muted/40 p-3 rounded-md border border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-muted-foreground",
						children: "Linked Account"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: currentUser.email
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						value: form.email,
						onChange: set("email"),
						required: true
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Password *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						value: form.password,
						onChange: set("password"),
						required: true,
						minLength: 6
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mobile" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.mobile,
							onChange: set("mobile")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.category,
							onChange: set("category")
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "w-full",
					disabled: busy,
					children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }), "Create shop"]
				})
			]
		}) })]
	});
}
//#endregion
export { AuthPage as component };
