import { o as __toESM } from "../_runtime.mjs";
import { C as onSnapshot, D as setDoc, M as doc, O as updateDoc, T as query, j as collection, k as where } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { i as getDb, t as COL } from "./firebase-BQC3oBr4.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-CjUebW4j.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-C8W-HuJg.mjs";
import { t as Input } from "./input-DgSC1K2-.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Button } from "./button-l9FdWCHm.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/staff-EZFcvDD7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StaffPage() {
	const { shop } = useShop();
	const [members, setMembers] = (0, import_react.useState)([]);
	const [form, setForm] = (0, import_react.useState)({
		fullName: "",
		email: "",
		password: "",
		role: "kitchen",
		active: true
	});
	const [formError, setFormError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		const unsub = onSnapshot(query(collection(getDb(), COL.staff), where("shopId", "==", shop.id)), (snap) => setMembers(snap.docs.map((d) => ({
			id: d.id,
			...d.data()
		}))));
		return () => unsub();
	}, [shop]);
	const saveMember = async (event) => {
		event.preventDefault();
		if (!shop) return;
		setFormError(null);
		const email = form.email.trim();
		const password = form.password;
		if (!email) {
			setFormError("Email is required.");
			return;
		}
		if (!password || password.length < 6) {
			setFormError("Password must be at least 6 characters.");
			return;
		}
		try {
			const resp = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBcLE70kKib2B2ZjDPVaT7HyPY3wa65nww`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					password,
					returnSecureToken: true
				})
			});
			const body = await resp.json();
			if (!resp.ok) {
				const errorMessage = body?.error?.message || "Could not create staff account.";
				throw new Error(errorMessage.replace(/_/g, " ").toLowerCase());
			}
			const uid = body.localId;
			await setDoc(doc(collection(getDb(), COL.staff)), {
				shopId: shop.id,
				userId: uid,
				fullName: form.fullName.trim(),
				email,
				role: form.role,
				active: form.active,
				createdAt: /* @__PURE__ */ new Date()
			});
			toast.success(`Kitchen account created — share these login details: ${email} + password`);
			setForm({
				fullName: "",
				email: "",
				password: "",
				role: "kitchen",
				active: true
			});
		} catch (error) {
			setFormError(error.message);
		}
	};
	const toggleActive = async (memberId, active) => {
		try {
			await updateDoc(doc(getDb(), COL.staff, memberId), { active });
			toast.success(active ? "Staff member activated" : "Staff member deactivated");
		} catch (error) {
			toast.error(error.message);
		}
	};
	if (!shop) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold",
				children: "Staff"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Assign roles for owner/admin, cashier, and kitchen access."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 xl:grid-cols-[0.9fr_1.1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Add staff" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-4",
					onSubmit: saveMember,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.fullName,
								onChange: (e) => setForm({
									...form,
									fullName: e.target.value
								}),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: form.email,
								onChange: (e) => setForm({
									...form,
									email: e.target.value
								}),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Set temporary password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								value: form.password,
								onChange: (e) => setForm({
									...form,
									password: e.target.value
								}),
								required: true,
								minLength: 6
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-md border border-border/70 bg-muted/40 px-3 py-2 text-sm",
								children: "Kitchen"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: form.active,
								onCheckedChange: (checked) => setForm({
									...form,
									active: checked
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Active" })]
						}),
						formError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
							children: formError
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Save member"
						})
					]
				}) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Team roster" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-3",
					children: members.map((member) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold",
							children: member.fullName || member.email || "Staff"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: member.email || "—"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-secondary px-2 py-1 text-xs capitalize",
								children: member.role
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: member.active,
								onCheckedChange: (checked) => toggleActive(member.id, checked)
							})]
						})]
					}, member.id))
				})]
			})]
		})]
	});
}
//#endregion
export { StaffPage as component };
