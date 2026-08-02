import { o as __toESM } from "../_runtime.mjs";
import { M as doc, O as updateDoc, T as query, b as getDoc, j as collection, k as where, x as getDocs } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { l as updatePassword } from "../_libs/firebase__auth.mjs";
import { i as getDb, o as getFirebaseAuth, t as COL } from "./firebase-BQC3oBr4.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useAuth, r as useShop } from "./useShop-CjUebW4j.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-C8W-HuJg.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Input } from "./input-DgSC1K2-.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Button } from "./button-l9FdWCHm.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-5nmLeuF4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-C2R0qf2g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { t } = useTranslation();
	(0, import_react.useEffect)(() => {
		document.title = `${t("common.settings")} · ${t("common.appName")}`;
	}, [t]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-bold",
			children: t("common.settings")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "profile",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "flex flex-wrap h-auto w-full justify-start mb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "profile",
							children: "Shop profile"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "branding",
							children: "Branding"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "notifications",
							children: "Notifications"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "staff",
							children: "Staff"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "security",
							children: "Security"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "data",
							children: "Data"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "profile",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopProfile, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "branding",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Branding, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "notifications",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotifPrefs, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "staff",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffMgmt, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "security",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Security, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "data",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataExport, {})
				})
			]
		})]
	});
}
function ShopProfile() {
	const { shop } = useShop();
	const [f, setF] = (0, import_react.useState)({
		name: "",
		address: "",
		phone: "",
		email: "",
		dailyResetMode: "auto"
	});
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		(async () => {
			const d = (await getDoc(doc(getDb(), COL.shops, shop.id))).data();
			if (d) setF({
				name: d.name ?? "",
				address: d.address ?? "",
				phone: d.phone ?? "",
				email: d.email ?? "",
				dailyResetMode: d.dailyResetMode === "manual" ? "manual" : "auto"
			});
		})();
	}, [shop]);
	const save = async () => {
		if (!shop) return;
		try {
			await updateDoc(doc(getDb(), COL.shops, shop.id), f);
			toast.success("Saved");
		} catch (e) {
			toast.error(e.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "shadow-soft mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Shop profile" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: f.name,
						onChange: (e) => setF({
							...f,
							name: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: f.address,
						onChange: (e) => setF({
							...f,
							address: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: f.phone,
							onChange: (e) => setF({
								...f,
								phone: e.target.value
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: f.email,
							onChange: (e) => setF({
								...f,
								email: e.target.value
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 rounded-3xl border border-border bg-slate-50 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: "Daily Sales Reset"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: cn("rounded-2xl border p-4 text-sm font-semibold", f.dailyResetMode === "auto" ? "border-orange-500 bg-orange-50 text-orange-900" : "border-slate-200 bg-white text-slate-700"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "radio",
										name: "dailyResetMode",
										checked: f.dailyResetMode === "auto",
										onChange: () => setF({
											...f,
											dailyResetMode: "auto"
										}),
										className: "mr-2"
									}),
									"Auto reset at 12:00 AM",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs font-normal text-slate-500",
										children: "Sales and order counters reset automatically at midnight."
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: cn("rounded-2xl border p-4 text-sm font-semibold", f.dailyResetMode === "manual" ? "border-orange-500 bg-orange-50 text-orange-900" : "border-slate-200 bg-white text-slate-700"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "radio",
										name: "dailyResetMode",
										checked: f.dailyResetMode === "manual",
										onChange: () => setF({
											...f,
											dailyResetMode: "manual"
										}),
										className: "mr-2"
									}),
									"Manual reset (End of Day)",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs font-normal text-slate-500",
										children: "Use the End of Day button to close the current day and start fresh."
									})
								]
							})]
						}),
						f.dailyResetMode === "manual" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							onClick: async () => {
								if (!shop) return;
								try {
									await updateDoc(doc(getDb(), COL.shops, shop.id), { lastManualResetAt: /* @__PURE__ */ new Date() });
									toast.success("End of Day reset saved.");
								} catch (e) {
									toast.error(e.message);
								}
							},
							children: "End of Day"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: save,
					children: "Save"
				})
			]
		})]
	});
}
function Branding() {
	const { shop } = useShop();
	const [color, setColor] = (0, import_react.useState)("#10b981");
	const [logo, setLogo] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		(async () => {
			const d = (await getDoc(doc(getDb(), COL.shops, shop.id))).data();
			if (d) {
				setColor(d.themeColor ?? "#10b981");
				setLogo(d.logoUrl ?? "");
			}
		})();
	}, [shop]);
	const save = async () => {
		if (!shop) return;
		await updateDoc(doc(getDb(), COL.shops, shop.id), {
			themeColor: color,
			logoUrl: logo || null
		});
		toast.success("Branding saved");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "shadow-soft mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Branding" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Customize your customer portal." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Theme color" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "color",
						value: color,
						onChange: (e) => setColor(e.target.value),
						className: "h-12 w-24"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Logo URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: logo,
						onChange: (e) => setLogo(e.target.value),
						placeholder: "https://…"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: save,
					children: "Save"
				})
			]
		})]
	});
}
function NotifPrefs() {
	const { user } = useAuth();
	const [push, setPush] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		getDoc(doc(getDb(), COL.users, user.uid)).then((snap) => {
			setPush(snap.data()?.notificationPrefs?.push ?? true);
		});
	}, [user]);
	const save = async () => {
		if (!user) return;
		await updateDoc(doc(getDb(), COL.users, user.uid), { notificationPrefs: { push } });
		toast.success("Saved");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "shadow-soft mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Notifications" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Browser push" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: push,
					onCheckedChange: setPush
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: save,
				children: "Save"
			})]
		})]
	});
}
function StaffMgmt() {
	const { shop } = useShop();
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		(async () => {
			setRows((await getDocs(query(collection(getDb(), COL.staff), where("shopId", "==", shop.id)))).docs.map((d) => ({
				id: d.id,
				...d.data()
			})));
		})();
	}, [shop]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "shadow-soft mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Staff" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Manage shop team members. Invite flow coming soon." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "space-y-2",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-center border-b border-border last:border-0 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: r.fullName ?? r.email
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: r.email
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs px-2 py-0.5 rounded bg-secondary capitalize",
					children: r.role
				})]
			}, r.id))
		})]
	});
}
function Security() {
	const [pass, setPass] = (0, import_react.useState)("");
	const change = async () => {
		const auth = getFirebaseAuth();
		if (!auth.currentUser) {
			toast.error("Not signed in.");
			return;
		}
		if (pass.length < 6) {
			toast.error("Password must be at least 6 characters.");
			return;
		}
		try {
			await updatePassword(auth.currentUser, pass);
			toast.success("Password updated");
			setPass("");
		} catch (e) {
			toast.error(e.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "shadow-soft mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Security" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "New password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					value: pass,
					onChange: (e) => setPass(e.target.value)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: change,
				children: "Update password"
			})]
		})]
	});
}
function DataExport() {
	const { shop } = useShop();
	const exp = async (table) => {
		if (!shop) return;
		const rows = (await getDocs(query(collection(getDb(), COL[table]), where("shopId", "==", shop.id)))).docs.map((d) => ({
			id: d.id,
			...d.data()
		}));
		if (!rows.length) {
			toast.info("No rows to export");
			return;
		}
		const cols = Object.keys(rows[0]);
		const csv = [cols.join(",")].concat(rows.map((r) => cols.map((c) => JSON.stringify(r[c] ?? "")).join(","))).join("\n");
		const a = document.createElement("a");
		a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
		a.download = `${table}.csv`;
		a.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "shadow-soft mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Data export" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "flex flex-col sm:flex-row gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => exp("orders"),
				className: "w-full sm:w-auto",
				children: "Export orders CSV"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => exp("customers"),
				className: "w-full sm:w-auto",
				children: "Export customers CSV"
			})]
		})]
	});
}
//#endregion
export { SettingsPage as component };
