import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, updateDoc, where, serverTimestamp } from "firebase/firestore";
import { getDb, COL } from "@/lib/firebase";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, PlusCircle, UploadCloud, Trash2, PencilLine, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/_authenticated/products")({
  component: ProductsPage,
});

type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  costPrice: number;
  taxRate: number;
  discount: number;
  stock: number;
  lowStockThreshold: number;
  preparationTime: number;
  veg: boolean;
  available: boolean;
  categoryId?: string | null;
  sku?: string | null;
  barcode?: string | null;
  imageUrl?: string | null;
};

type Category = { id: string; name: string; sortOrder?: number };

function ProductsPage() {
  const { shop } = useShop();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form, setForm] = useState({
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
    imageUrl: "",
  });

  useEffect(() => {
    if (!shop) return;
    const db = getDb();
    const productsQ = query(collection(db, COL.products), where("shopId", "==", shop.id));
    const categoriesQ = query(collection(db, COL.categories), where("shopId", "==", shop.id));
    const unsubProducts = onSnapshot(productsQ, (snap) => setProducts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, "id">) }))));
    const unsubCategories = onSnapshot(categoriesQ, (snap) => setCategories(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Category, "id">) }))));
    return () => {
      unsubProducts();
      unsubCategories();
    };
  }, [shop]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return products;
    return products.filter((product) => [product.name, product.sku, product.barcode, product.description].filter(Boolean).some((value) => (value ?? "").toLowerCase().includes(term)));
  }, [products, search]);

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", description: "", price: "0", costPrice: "0", taxRate: "0", discount: "0", stock: "0", lowStockThreshold: "5", preparationTime: "10", veg: true, available: true, categoryId: categories[0]?.id ?? "", sku: "", barcode: "", imageUrl: "" });
  };

  useEffect(() => {
    if (!form.categoryId && categories[0]?.id) {
      setForm((current) => ({ ...current, categoryId: current.categoryId || categories[0].id }));
    }
  }, [categories, form.categoryId]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !shop) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (import.meta.env.DEV) console.debug("[products] Cloudinary upload configured", { cloudName: Boolean(cloudName), uploadPreset: Boolean(uploadPreset) });

    if (!cloudName || !uploadPreset) {
      toast.error("Cloudinary configurations are missing in .env file.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          const secureUrl = response.secure_url;
          if (secureUrl) {
            setForm((current) => ({ ...current, imageUrl: secureUrl }));
            toast.success("Image uploaded to Cloudinary successfully");
          } else {
            toast.error("Failed to retrieve secure URL from Cloudinary response.");
          }
        } catch (e) {
          toast.error("Failed to parse Cloudinary response.");
        }
      } else {
        let errMsg = "Upload to Cloudinary failed";
        try {
          const errResponse = JSON.parse(xhr.responseText);
          if (errResponse.error?.message) {
            errMsg = errResponse.error.message;
          }
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

  const saveProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!shop) return;
    const db = getDb();
    const payload: any = {
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
      imageUrl: form.imageUrl || null,
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
      toast.error((error as Error).message);
    }
  };

  const editProduct = (product: Product) => {
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
      imageUrl: product.imageUrl ?? "",
    });
  };

  const deleteProduct = async (productId: string) => {
    if (!shop) return;
    try {
      await deleteDoc(doc(getDb(), COL.products, productId));
      toast.success("Product deleted");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  if (!shop) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold">Product Management</h1>
        <p className="text-sm text-muted-foreground">Create, edit and manage your catalog, images, stock and pricing in Firebase.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PlusCircle className="w-4 h-4" /> {editingId ? "Edit product" : "Add product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={saveProduct}>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="space-y-1.5"><Label>SKU</Label><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Barcode</Label><Input value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Category</Label><Select value={form.categoryId} onValueChange={(value) => setForm({ ...form, categoryId: value })}><SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger><SelectContent>{categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5"><Label>Price</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Cost Price</Label><Input type="number" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Tax (%)</Label><Input type="number" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Discount (%)</Label><Input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Low Stock</Label><Input type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Prep Time (min)</Label><Input type="number" value={form.preparationTime} onChange={(e) => setForm({ ...form, preparationTime: e.target.value })} /></div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2"><Switch checked={form.veg} onCheckedChange={(checked) => setForm({ ...form, veg: checked })} /><Label>Veg</Label></div>
                <div className="flex items-center gap-2"><Switch checked={form.available} onCheckedChange={(checked) => setForm({ ...form, available: checked })} /><Label>Available</Label></div>
              </div>
              <div className="space-y-2">
                <Label>Product image</Label>
                <div className="flex flex-col gap-3">
                  {form.imageUrl ? (
                    <div className="flex items-center gap-3">
                      <div className="relative group w-24 h-24">
                        <img src={form.imageUrl} alt="product preview" className="h-24 w-24 rounded-lg object-cover border border-border" />
                        <button
                          type="button"
                          onClick={() => setForm(current => ({ ...current, imageUrl: "" }))}
                          className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-1 shadow hover:bg-destructive/90 transition"
                          title="Delete image"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40 transition">
                        <UploadCloud className="h-4 w-4" />
                        {uploading ? `Uploading (${uploadProgress}%)` : "Replace Image"}
                        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                      </label>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground hover:bg-muted/40 transition">
                      <UploadCloud className="h-5 w-5 animate-pulse" />
                      <span>{uploading ? `Uploading (${uploadProgress}%)...` : "Upload product image"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                    </label>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingId ? "Save changes" : "Create product"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Reset</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Catalog</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" className="pl-9" />
            </div>
            <div className="space-y-3">
              {filtered.map((product) => (
                <div key={product.id} className="flex items-center justify-between rounded-xl border border-border p-3 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="h-12 w-12 rounded-lg object-cover border border-border flex-shrink-0" />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 border border-border text-muted-foreground">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{product.name}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground truncate">{product.sku || "—"} • {product.barcode || "—"}</div>
                      <div className="mt-1.5 flex flex-wrap gap-2 text-xs">
                        <Badge variant="secondary">₹{product.price}</Badge>
                        <Badge variant="outline">Stock {product.stock}</Badge>
                        <Badge variant={product.available ? "secondary" : "outline"}>{product.available ? "Available" : "Hidden"}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Button type="button" size="icon" variant="outline" onClick={() => editProduct(product)}><PencilLine className="h-4 w-4" /></Button>
                    <Button type="button" size="icon" variant="ghost" onClick={() => deleteProduct(product.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
