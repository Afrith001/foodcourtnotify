import { o as __toESM } from "../_runtime.mjs";
import { D as setDoc, M as doc, P as serverTimestamp, S as limit, T as query, b as getDoc, j as collection, k as where, x as getDocs } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { a as sendPasswordResetEmail, c as signOut, n as createUserWithEmailAndPassword, s as signInWithEmailAndPassword } from "../_libs/firebase__auth.mjs";
import { i as getDb, n as ensureSessionPersistence, o as getFirebaseAuth, r as firebaseConfigured, t as COL } from "./firebase-BQC3oBr4.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-C8W-HuJg.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./auth-COFleP6j.mjs";
import { t as Input } from "./input-DgSC1K2-.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Button } from "./button-l9FdWCHm.mjs";
import { n as pickUniqueShopCode } from "./shop-code-BIK_cGVV.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-5nmLeuF4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Toaster$1 } from "./sonner-DoFKumIW.mjs";
import { It as ChefHat, st as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DgQVWcu6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function resolveSignedInRoute(db, uid, email, shopName, mode) {
	let staffSnap = await getDocs(query(collection(db, COL.staff), where("userId", "==", uid), where("active", "==", true), limit(1)));
	if (staffSnap.empty && email) try {
		staffSnap = await getDocs(query(collection(db, COL.staff), where("email", "==", email), where("active", "==", true), limit(1)));
	} catch (error) {}
	if (!staffSnap.empty) {
		const staff = staffSnap.docs[0].data();
		const targetRole = (staff.role || "").toLowerCase();
		if (staff.shopId) {
			const shopDoc = await getDoc(doc(db, COL.shops, staff.shopId));
			if (shopDoc.exists()) {
				const selectedShop = (shopDoc.data().name ?? "").trim().toLowerCase();
				if (shopName.trim() && selectedShop && selectedShop !== shopName.trim().toLowerCase()) return {
					route: null,
					error: "This account does not belong to the selected shop."
				};
			}
		}
		if (mode === "kitchen") {
			if (targetRole !== "kitchen") return {
				route: null,
				error: "This account is not registered as kitchen staff."
			};
			return {
				route: "/kitchen",
				error: null
			};
		}
		if (targetRole === "kitchen") return {
			route: null,
			error: "This account is for kitchen access. Please use Kitchen Login."
		};
		if (targetRole === "cashier") return {
			route: "/billing",
			error: null
		};
		return {
			route: "/dashboard",
			error: null
		};
	}
	let shopsSnap = await getDocs(query(collection(db, COL.shops), where("ownerId", "==", uid), limit(1)));
	if (shopsSnap.empty && email) try {
		shopsSnap = await getDocs(query(collection(db, COL.shops), where("email", "==", email), limit(1)));
	} catch (error) {}
	if (!shopsSnap.empty) {
		const shopNameValue = (shopsSnap.docs[0].data().name ?? "").trim().toLowerCase();
		if (shopName.trim() && shopNameValue && shopNameValue !== shopName.trim().toLowerCase()) return {
			route: null,
			error: "This account does not belong to the selected shop."
		};
		if (mode === "kitchen") return {
			route: null,
			error: "This account is not registered as kitchen staff."
		};
		return {
			route: "/dashboard",
			error: null
		};
	}
	return {
		route: null,
		error: "This account is not linked to any shop."
	};
}
function describeAuthError(err) {
	switch (err?.code ?? "") {
		case "auth/invalid-credential":
		case "auth/wrong-password": return "Incorrect email or password.";
		case "auth/user-not-found": return "No account was found for that email address.";
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
	useNavigate();
	const [tab, setTab] = (0, import_react.useState)(mode ?? "signin");
	(0, import_react.useEffect)(() => {
		if (mode && mode !== tab) setTab(mode);
	}, [mode, tab]);
	(0, import_react.useEffect)(() => {
		if (!firebaseConfigured) return;
		const unsub = getFirebaseAuth().onAuthStateChanged(() => {});
		return () => unsub();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(182,124,47,0.16),_transparent_28%)] p-3 sm:p-4 lg:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-7xl flex-col overflow-hidden rounded-[32px] border border-border/70 bg-card/70 shadow-soft backdrop-blur-xl lg:min-h-[calc(100vh-3rem)] lg:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex flex-1 flex-col justify-between overflow-hidden gradient-hero p-8 text-primary-foreground sm:p-10 lg:p-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_30%)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChefHat, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg font-semibold",
							children: "FoodCourtNotify"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-primary-foreground/75",
							children: "A calmer way to run your kitchen"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative max-w-lg",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-[0.35em] text-primary-foreground/70",
								children: "Freshly brewed operations"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl",
								children: "One porch light for orders, staff, and every shop story."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-md text-base text-primary-foreground/80",
								children: "Welcome guests faster, keep the kitchen aligned, and give each shop a dedicated QR portal with real-time updates."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-wrap gap-2 text-sm text-primary-foreground/80",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full border border-white/20 bg-white/10 px-3 py-1",
										children: "QR portals"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full border border-white/20 bg-white/10 px-3 py-1",
										children: "Kitchen alerts"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full border border-white/20 bg-white/10 px-3 py-1",
										children: "Customer CRM"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative text-sm text-primary-foreground/70",
						children: "© FoodCourtNotify"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-1 items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(182,124,47,0.16),_transparent_28%)] p-5 sm:p-8 lg:p-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md",
					children: [
						!firebaseConfigured && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 rounded-2xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive",
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
									className: "mb-6 grid w-full grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "signin",
											children: "Sign in"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "kitchen",
											children: "Kitchen Login"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "signup",
											children: "Create shop"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "signin",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInCard, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "kitchen",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KitchenSignInCard, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "signup",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignUpCard, { onDone: () => setTab("signin") })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 text-center text-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									children: "←"
								}), "Back home"]
							})
						})
					]
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-right"
		})]
	});
}
function SignInCard() {
	const navigate = useNavigate();
	const [shopName, setShopName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [forgotMode, setForgotMode] = (0, import_react.useState)(false);
	const [forgotEmail, setForgotEmail] = (0, import_react.useState)("");
	const [forgotBusy, setForgotBusy] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [authError, setAuthError] = (0, import_react.useState)(null);
	const submit = async (e) => {
		e.preventDefault();
		if (!shopName.trim()) {
			setAuthError("Please enter your shop name.");
			toast.error("Please enter your shop name.");
			return;
		}
		if (!email.trim() || !password) {
			setAuthError("Email and password are required.");
			toast.error("Email and password are required.");
			return;
		}
		setBusy(true);
		setAuthError(null);
		let cancelled = false;
		const timeoutId = window.setTimeout(() => {
			if (cancelled) return;
			cancelled = true;
			setBusy(false);
			setAuthError("Login is taking too long. Please check your connection and try again.");
			toast.error("Login timed out. Please try again.");
		}, 12e3);
		try {
			const auth = await ensureSessionPersistence();
			const db = getDb();
			const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
			if (cancelled) return;
			const target = await resolveSignedInRoute(db, cred.user.uid, cred.user.email, shopName, "signin");
			if (cancelled) return;
			if (target.error) {
				await signOut(auth);
				setAuthError(target.error);
				toast.error(target.error);
				return;
			}
			if (target.route) {
				const successMessage = target.route === "/kitchen" ? "Welcome to Kitchen" : target.route === "/billing" ? "Welcome to Billing" : "Welcome back!";
				toast.success(successMessage);
				navigate({ to: target.route });
			}
		} catch (err) {
			if (!cancelled) {
				const message = describeAuthError(err);
				setAuthError(message);
				toast.error(message);
			}
		} finally {
			if (!cancelled) {
				window.clearTimeout(timeoutId);
				setBusy(false);
			}
		}
	};
	const sendReset = async () => {
		if (!forgotEmail.trim()) {
			toast.error("Please enter your email.");
			return;
		}
		setForgotBusy(true);
		try {
			await sendPasswordResetEmail(getFirebaseAuth(), forgotEmail.trim());
			toast.success("Password reset link sent to your email — check your inbox");
			setForgotMode(false);
			setForgotEmail("");
		} catch (err) {
			toast.error(describeAuthError(err));
		} finally {
			setForgotBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-border/70 bg-background/95 shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "inline-flex w-fit rounded-full border border-border/70 bg-muted/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground",
					children: "Morning service"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "font-display text-2xl",
					children: "Welcome back"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Shop owner or staff member? Sign in below with your email." })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
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
				authError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
					children: authError
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary/90 hover:underline",
						onClick: () => {
							setForgotMode((s) => !s);
							setForgotEmail(email);
						},
						children: "Forgot password?"
					})]
				}),
				forgotMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 rounded-2xl border border-border/70 bg-muted/40 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email for reset" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: forgotEmail,
							onChange: (e) => setForgotEmail(e.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: sendReset,
							disabled: forgotBusy,
							children: forgotBusy ? "Sending..." : "Send reset link"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setForgotMode(false),
							children: "Cancel"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "w-full",
					disabled: busy,
					children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Sign in"]
				})
			]
		}) })]
	});
}
function KitchenSignInCard() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const submit = async (e) => {
		e.preventDefault();
		if (!email.trim() || !password) {
			setError("Email and password are required.");
			toast.error("Email and password are required.");
			return;
		}
		setBusy(true);
		setError(null);
		try {
			const auth = await ensureSessionPersistence();
			const db = getDb();
			const user = (await signInWithEmailAndPassword(auth, email.trim(), password)).user;
			const target = await resolveSignedInRoute(db, user.uid, user.email, "", "kitchen");
			if (target.error) {
				await signOut(auth);
				setError(target.error);
				toast.error(target.error);
				return;
			}
			if (target.route) {
				toast.success("Welcome to Kitchen");
				navigate({ to: target.route });
			}
		} catch (err) {
			const message = describeAuthError(err);
			setError(message);
			toast.error(message);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-border/70 bg-background/95 shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "inline-flex w-fit rounded-full border border-border/70 bg-muted/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground",
					children: "Kitchen staff"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "font-display text-2xl",
					children: "Kitchen Login"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Enter your kitchen account credentials to access the full-screen kitchen display." })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-4",
			onSubmit: submit,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "ki-email",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "ki-email",
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "ki-pass",
						children: "Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "ki-pass",
						type: "password",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						required: true
					})]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "w-full",
					disabled: busy,
					children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Kitchen Login"]
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
			const auth = await ensureSessionPersistence();
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
		className: "border-border/70 bg-background/95 shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "inline-flex w-fit rounded-full border border-border/70 bg-muted/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground",
					children: "New shop setup"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "font-display text-2xl",
					children: "Open your shop"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Get your QR portal and dashboard in seconds." })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3",
			onSubmit: submit,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
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
					className: "space-y-1.5 rounded-2xl border border-border/70 bg-muted/40 p-3",
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
					className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
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
					children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Create shop"]
				})
			]
		}) })]
	});
}
//#endregion
export { AuthPage as component };
