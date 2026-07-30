import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { getDb, COL } from "@/lib/firebase";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Search, PlusCircle, Trash2, PencilLine } from "lucide-react";

export const Route = createFileRoute("/_authenticated/categories")({
  component: CategoriesPage,
});

type Category = { id: string; name: string; description?: string | null; sortOrder?: number; parentId?: string | null };

function CategoriesPage() {
  const { shop } = useShop();
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", sortOrder: "0" });

  useEffect(() => {
    if (!shop) return;
    const db = getDb();
    const q = query(collection(db, COL.categories), where("shopId", "==", shop.id));
    const unsub = onSnapshot(q, (snap) => setCategories(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Category, "id">) }))));
    return () => unsub();
  }, [shop]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return categories;
    return categories.filter((category) => [category.name, category.description].filter(Boolean).some((value) => (value ?? "").toLowerCase().includes(term)));
  }, [categories, search]);

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", description: "", sortOrder: "0" });
  };

  const saveCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!shop) return;
    try {
      const db = getDb();
      const payload = {
        shopId: shop.id,
        name: form.name.trim(),
        description: form.description.trim() || null,
        sortOrder: Number(form.sortOrder) || 0,
        createdAt: serverTimestamp(),
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
      toast.error((error as Error).message);
    }
  };

  const editCategory = (category: Category) => {
    setEditingId(category.id);
    setForm({ name: category.name, description: category.description ?? "", sortOrder: String(category.sortOrder ?? 0) });
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await deleteDoc(doc(getDb(), COL.categories, categoryId));
      toast.success("Category deleted");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  if (!shop) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold">Categories</h1>
        <p className="text-sm text-muted-foreground">Organize products into categories and sub-categories for a cleaner POS workflow.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="shadow-soft">
          <CardHeader><CardTitle className="flex items-center gap-2"><PlusCircle className="w-4 h-4" /> {editingId ? "Edit category" : "Create category"}</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={saveCategory}>
              <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="space-y-1.5"><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Sort order</Label><Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} /></div>
              <div className="flex gap-2"><Button type="submit">{editingId ? "Save changes" : "Create category"}</Button><Button type="button" variant="outline" onClick={resetForm}>Reset</Button></div>
            </form>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader><CardTitle>Category list</CardTitle></CardHeader>
          <CardContent>
            <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories" className="pl-9" /></div>
            <div className="space-y-3">
              {filtered.map((category) => (
                <div key={category.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div>
                    <div className="font-semibold">{category.name}</div>
                    {category.description ? <div className="text-xs text-muted-foreground">{category.description}</div> : null}
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" onClick={() => editCategory(category)}><PencilLine className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteCategory(category.id)}><Trash2 className="h-4 w-4" /></Button>
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
