import { o as __toESM } from "../_runtime.mjs";
import { C as onSnapshot, D as setDoc, M as doc, O as updateDoc, P as serverTimestamp, T as query, g as deleteDoc, j as collection, k as where } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { r as getDb, t as COL } from "./firebase-jX9Hxz-N.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-oa7pWA7o.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-ZV2o_Ft7.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Input } from "./input-B-tDUnPX.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Button } from "./button-ufo6MiTZ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { It as CirclePlus, N as Search, g as Trash2, jt as CloudUpload, k as ShoppingBag, q as PencilLine } from "../_libs/lucide-react.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-BJOz5u59.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductsPage() {
	const { shop } = useShop();
	const [products, setProducts] = (0, import_react.useState)([]);
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [search, setSearch] = (0, import_react.useState)("");
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [uploadProgress, setUploadProgress] = (0, import_react.useState)(0);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		description: "",
		price: "0",
		costPrice: "0",
		taxRate: "0",
		discount: "0",
		stock: "0",
		lowStockThreshold: "5",
		preparationTime: "10",
		veg: true,
		available: true,
		categoryId: "",
		sku: "",
		barcode: "",
		imageUrl: ""
	});
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		const db = getDb();
		const productsQ = query(collection(db, COL.products), where("shopId", "==", shop.id));
		const categoriesQ = query(collection(db, COL.categories), where("shopId", "==", shop.id));
		const unsubProducts = onSnapshot(productsQ, (snap) => setProducts(snap.docs.map((d) => ({
			id: d.id,
			...d.data()
		}))));
		const unsubCategories = onSnapshot(categoriesQ, (snap) => setCategories(snap.docs.map((d) => ({
			id: d.id,
			...d.data()
		}))));
		return () => {
			unsubProducts();
			unsubCategories();
		};
	}, [shop]);
	const filtered = (0, import_react.useMemo)(() => {
		const term = search.toLowerCase().trim();
		if (!term) return products;
		return products.filter((product) => [
			product.name,
			product.sku,
			product.barcode,
			product.description
		].filter(Boolean).some((value) => (value ?? "").toLowerCase().includes(term)));
	}, [products, search]);
	const resetForm = () => {
		setEditingId(null);
		setForm({
			name: "",
			description: "",
			price: "0",
			costPrice: "0",
			taxRate: "0",
			discount: "0",
			stock: "0",
			lowStockThreshold: "5",
			preparationTime: "10",
			veg: true,
			available: true,
			categoryId: categories[0]?.id ?? "",
			sku: "",
			barcode: "",
			imageUrl: ""
		});
	};
	(0, import_react.useEffect)(() => {
		if (!form.categoryId && categories[0]?.id) setForm((current) => ({
			...current,
			categoryId: current.categoryId || categories[0].id
		}));
	}, [categories, form.categoryId]);
	const handleUpload = (event) => {
		const file = event.target.files?.[0];
		if (!file || !shop) return;
		const cloudName = "dicpzzwgw";
		const uploadPreset = "nexavo-products";
		setUploading(true);
		setUploadProgress(0);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("upload_preset", uploadPreset);
		const xhr = new XMLHttpRequest();
		xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, true);
		xhr.upload.onprogress = (e) => {
			if (e.lengthComputable) setUploadProgress(Math.round(e.loaded / e.total * 100));
		};
		xhr.onload = () => {
			setUploading(false);
			if (xhr.status >= 200 && xhr.status < 300) try {
				const secureUrl = JSON.parse(xhr.responseText).secure_url;
				if (secureUrl) {
					setForm((current) => ({
						...current,
						imageUrl: secureUrl
					}));
					toast.success("Image uploaded to Cloudinary successfully");
				} else toast.error("Failed to retrieve secure URL from Cloudinary response.");
			} catch (e) {
				toast.error("Failed to parse Cloudinary response.");
			}
			else {
				let errMsg = "Upload to Cloudinary failed";
				try {
					const errResponse = JSON.parse(xhr.responseText);
					if (errResponse.error?.message) errMsg = errResponse.error.message;
				} catch (e) {}
				toast.error(errMsg);
			}
		};
		xhr.onerror = () => {
			setUploading(false);
			toast.error("Network error occurred during image upload.");
		};
		xhr.send(formData);
	};
	const saveProduct = async (event) => {
		event.preventDefault();
		if (!shop) return;
		const db = getDb();
		const payload = {
			shopId: shop.id,
			name: form.name.trim(),
			description: form.description.trim() || null,
			price: Number(form.price) || 0,
			costPrice: Number(form.costPrice) || 0,
			taxRate: Number(form.taxRate) || 0,
			discount: Number(form.discount) || 0,
			stock: Number(form.stock) || 0,
			lowStockThreshold: Number(form.lowStockThreshold) || 0,
			preparationTime: Number(form.preparationTime) || 0,
			veg: form.veg,
			available: form.available,
			categoryId: form.categoryId || null,
			sku: form.sku.trim() || null,
			barcode: form.barcode.trim() || null,
			imageUrl: form.imageUrl || null
		};
		try {
			if (editingId) {
				payload.updatedAt = serverTimestamp();
				await updateDoc(doc(db, COL.products, editingId), payload);
				toast.success("Product updated");
			} else {
				payload.createdAt = serverTimestamp();
				await setDoc(doc(collection(db, COL.products)), payload);
				toast.success("Product created");
			}
			resetForm();
		} catch (error) {
			toast.error(error.message);
		}
	};
	const editProduct = (product) => {
		setEditingId(product.id);
		setForm({
			name: product.name,
			description: product.description ?? "",
			price: String(product.price ?? 0),
			costPrice: String(product.costPrice ?? 0),
			taxRate: String(product.taxRate ?? 0),
			discount: String(product.discount ?? 0),
			stock: String(product.stock ?? 0),
			lowStockThreshold: String(product.lowStockThreshold ?? 0),
			preparationTime: String(product.preparationTime ?? 0),
			veg: product.veg ?? true,
			available: product.available ?? true,
			categoryId: product.categoryId ?? "",
			sku: product.sku ?? "",
			barcode: product.barcode ?? "",
			imageUrl: product.imageUrl ?? ""
		});
	};
	const deleteProduct = async (productId) => {
		if (!shop) return;
		try {
			await deleteDoc(doc(getDb(), COL.products, productId));
			toast.success("Product deleted");
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
				children: "Product Management"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Create, edit and manage your catalog, images, stock and pricing in Firebase."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 xl:grid-cols-[0.95fr_1.05fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "w-4 h-4" }),
						" ",
						editingId ? "Edit product" : "Add product"
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-4",
					onSubmit: saveProduct,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 md:grid-cols-2",
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
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "SKU" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.sku,
										onChange: (e) => setForm({
											...form,
											sku: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Barcode" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.barcode,
										onChange: (e) => setForm({
											...form,
											barcode: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.categoryId,
										onValueChange: (value) => setForm({
											...form,
											categoryId: value
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Category" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: category.id,
											children: category.name
										}, category.id)) })]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: form.description,
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 md:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Price" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: form.price,
										onChange: (e) => setForm({
											...form,
											price: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cost Price" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: form.costPrice,
										onChange: (e) => setForm({
											...form,
											costPrice: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tax (%)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: form.taxRate,
										onChange: (e) => setForm({
											...form,
											taxRate: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Discount (%)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: form.discount,
										onChange: (e) => setForm({
											...form,
											discount: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Stock" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: form.stock,
										onChange: (e) => setForm({
											...form,
											stock: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Low Stock" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: form.lowStockThreshold,
										onChange: (e) => setForm({
											...form,
											lowStockThreshold: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Prep Time (min)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: form.preparationTime,
										onChange: (e) => setForm({
											...form,
											preparationTime: e.target.value
										})
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: form.veg,
									onCheckedChange: (checked) => setForm({
										...form,
										veg: checked
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Veg" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: form.available,
									onCheckedChange: (checked) => setForm({
										...form,
										available: checked
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Available" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Product image" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col gap-3",
								children: form.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative group w-24 h-24",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: form.imageUrl,
											alt: "product preview",
											className: "h-24 w-24 rounded-lg object-cover border border-border"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setForm((current) => ({
												...current,
												imageUrl: ""
											})),
											className: "absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-1 shadow hover:bg-destructive/90 transition",
											title: "Delete image",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40 transition",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-4 w-4" }),
											uploading ? `Uploading (${uploadProgress}%)` : "Replace Image",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												accept: "image/*",
												className: "hidden",
												onChange: handleUpload,
												disabled: uploading
											})
										]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground hover:bg-muted/40 transition",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-5 w-5 animate-pulse" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: uploading ? `Uploading (${uploadProgress}%)...` : "Upload product image" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: "image/*",
											className: "hidden",
											onChange: handleUpload,
											disabled: uploading
										})
									]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: editingId ? "Save changes" : "Create product"
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Catalog" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Search products",
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: filtered.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border p-3 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0",
							children: [product.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: product.imageUrl,
								alt: product.name,
								className: "h-12 w-12 rounded-lg object-cover border border-border flex-shrink-0"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 border border-border text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold truncate",
										children: product.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-0.5 text-xs text-muted-foreground truncate",
										children: [
											product.sku || "—",
											" • ",
											product.barcode || "—"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1.5 flex flex-wrap gap-2 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "secondary",
												children: ["₹", product.price]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "outline",
												children: ["Stock ", product.stock]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: product.available ? "secondary" : "outline",
												children: product.available ? "Available" : "Hidden"
											})
										]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1.5 flex-shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "icon",
								variant: "outline",
								onClick: () => editProduct(product),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PencilLine, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "icon",
								variant: "ghost",
								onClick: () => deleteProduct(product.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						})]
					}, product.id))
				})] })]
			})]
		})]
	});
}
//#endregion
export { ProductsPage as component };
