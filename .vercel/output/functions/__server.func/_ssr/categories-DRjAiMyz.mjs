import { o as __toESM } from "../_runtime.mjs";
import { C as onSnapshot, D as setDoc, M as doc, O as updateDoc, P as serverTimestamp, T as query, g as deleteDoc, j as collection, k as where } from "../_libs/@firebase/firestore+[...].mjs";
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
import { U as PencilLine, g as Trash2, j as Search, kt as CirclePlus } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/categories-DRjAiMyz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CategoriesPage() {
	const { shop } = useShop();
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [search, setSearch] = (0, import_react.useState)("");
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		description: "",
		sortOrder: "0"
	});
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		const unsub = onSnapshot(query(collection(getDb(), COL.categories), where("shopId", "==", shop.id)), (snap) => setCategories(snap.docs.map((d) => ({
			id: d.id,
			...d.data()
		}))));
		return () => unsub();
	}, [shop]);
	const filtered = (0, import_react.useMemo)(() => {
		const term = search.toLowerCase().trim();
		if (!term) return categories;
		return categories.filter((category) => [category.name, category.description].filter(Boolean).some((value) => (value ?? "").toLowerCase().includes(term)));
	}, [categories, search]);
	const resetForm = () => {
		setEditingId(null);
		setForm({
			name: "",
			description: "",
			sortOrder: "0"
		});
	};
	const saveCategory = async (event) => {
		event.preventDefault();
		if (!shop) return;
		try {
			const db = getDb();
			const payload = {
				shopId: shop.id,
				name: form.name.trim(),
				description: form.description.trim() || null,
				sortOrder: Number(form.sortOrder) || 0,
				createdAt: serverTimestamp()
			};
			if (editingId) {
				await updateDoc(doc(db, COL.categories, editingId), payload);
				toast.success("Category updated");
			} else {
				await setDoc(doc(collection(db, COL.categories)), payload);
				toast.success("Category created");
			}
			resetForm();
		} catch (error) {
			toast.error(error.message);
		}
	};
	const editCategory = (category) => {
		setEditingId(category.id);
		setForm({
			name: category.name,
			description: category.description ?? "",
			sortOrder: String(category.sortOrder ?? 0)
		});
	};
	const deleteCategory = async (categoryId) => {
		try {
			await deleteDoc(doc(getDb(), COL.categories, categoryId));
			toast.success("Category deleted");
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
				children: "Categories"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Organize products into categories and sub-categories for a cleaner POS workflow."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 xl:grid-cols-[0.8fr_1.2fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "w-4 h-4" }),
						" ",
						editingId ? "Edit category" : "Create category"
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-4",
					onSubmit: saveCategory,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								}),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.description,
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sort order" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: form.sortOrder,
								onChange: (e) => setForm({
									...form,
									sortOrder: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: editingId ? "Save changes" : "Create category"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: resetForm,
								children: "Reset"
							})]
						})
					]
				}) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Category list" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Search categories",
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: filtered.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold",
							children: category.name
						}), category.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: category.description
						}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "outline",
								onClick: () => editCategory(category),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PencilLine, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: () => deleteCategory(category.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						})]
					}, category.id))
				})] })]
			})]
		})]
	});
}
//#endregion
export { CategoriesPage as component };
