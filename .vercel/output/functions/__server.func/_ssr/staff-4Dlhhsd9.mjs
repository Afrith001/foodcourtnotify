import { o as __toESM } from "../_runtime.mjs";
import { C as onSnapshot, D as setDoc, M as doc, O as updateDoc, T as query, j as collection, k as where } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { r as getDb, t as COL } from "./firebase-jX9Hxz-N.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-oa7pWA7o.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-ZV2o_Ft7.mjs";
import { t as Input } from "./input-B-tDUnPX.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Button } from "./button-ufo6MiTZ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/staff-4Dlhhsd9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StaffPage() {
	const { shop } = useShop();
	const [members, setMembers] = (0, import_react.useState)([]);
	const [form, setForm] = (0, import_react.useState)({
		fullName: "",
		email: "",
		role: "cashier",
		active: true
	});
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
		try {
			await setDoc(doc(collection(getDb(), COL.staff)), {
				shopId: shop.id,
				fullName: form.fullName.trim(),
				email: form.email.trim(),
				role: form.role,
				active: form.active,
				createdAt: /* @__PURE__ */ new Date()
			});
			toast.success("Staff member added");
			setForm({
				fullName: "",
				email: "",
				role: "cashier",
				active: true
			});
		} catch (error) {
			toast.error(error.message);
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
				children: "Assign roles such as admin, manager, cashier, kitchen and waiter."
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
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.role,
								onValueChange: (value) => setForm({
									...form,
									role: value
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "admin",
										children: "Admin"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "manager",
										children: "Manager"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "cashier",
										children: "Cashier"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "kitchen",
										children: "Kitchen"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "waiter",
										children: "Waiter"
									})
								] })]
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
