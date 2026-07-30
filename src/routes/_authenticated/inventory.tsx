import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { getDb, COL } from "@/lib/firebase";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/inventory")({
  component: InventoryPage,
});

type InventoryProduct = {
  id: string;
  name: string;
  stock: number;
  lowStockThreshold: number;
  price: number;
  available: boolean;
};

function InventoryPage() {
  const { shop } = useShop();
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!shop) return;
    const db = getDb();
    const q = query(collection(db, COL.products), where("shopId", "==", shop.id));
    const unsub = onSnapshot(q, (snap) => setProducts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<InventoryProduct, "id">) }))));
    return () => unsub();
  }, [shop]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return products;
    return products.filter((product) => product.name.toLowerCase().includes(term));
  }, [products, search]);

  if (!shop) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold">Inventory</h1>
        <p className="text-sm text-muted-foreground">Track low stock, stock levels and availability for every product.</p>
      </div>
      <Card className="shadow-soft">
        <CardHeader><CardTitle>Stock overview</CardTitle></CardHeader>
        <CardContent>
          <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search inventory" className="pl-9" /></div>
          <div className="space-y-3">
            {filtered.map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <div className="font-semibold">{product.name}</div>
                  <div className="text-xs text-muted-foreground">Price ₹{product.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={product.stock <= (product.lowStockThreshold ?? 0) ? "destructive" : "secondary"}>Stock {product.stock}</Badge>
                  <Badge variant={product.available ? "secondary" : "outline"}>{product.available ? "Available" : "Hidden"}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
