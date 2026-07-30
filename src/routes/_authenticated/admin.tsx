import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { getDb, COL } from "@/lib/firebase";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { shop } = useShop();
  const [stats, setStats] = useState({ products: 0, orders: 0, customers: 0, staff: 0 });

  useEffect(() => {
    if (!shop) return;
    const db = getDb();
    const productsQ = query(collection(db, COL.products), where("shopId", "==", shop.id));
    const ordersQ = query(collection(db, COL.orders), where("shopId", "==", shop.id));
    const customersQ = query(collection(db, COL.customers), where("shopId", "==", shop.id));
    const staffQ = query(collection(db, COL.staff), where("shopId", "==", shop.id));
    const unsubProducts = onSnapshot(productsQ, (snap) => setStats((current) => ({ ...current, products: snap.size })));
    const unsubOrders = onSnapshot(ordersQ, (snap) => setStats((current) => ({ ...current, orders: snap.size })));
    const unsubCustomers = onSnapshot(customersQ, (snap) => setStats((current) => ({ ...current, customers: snap.size })));
    const unsubStaff = onSnapshot(staffQ, (snap) => setStats((current) => ({ ...current, staff: snap.size })));
    return () => {
      unsubProducts();
      unsubOrders();
      unsubCustomers();
      unsubStaff();
    };
  }, [shop]);

  if (!shop) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold">Admin</h1>
        <p className="text-sm text-muted-foreground">High-level overview of your Nexavo POS workspace.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Products", value: stats.products },
          { label: "Orders", value: stats.orders },
          { label: "Customers", value: stats.customers },
          { label: "Staff", value: stats.staff },
        ].map((item) => (
          <Card key={item.label} className="shadow-soft">
            <CardHeader><CardTitle>{item.label}</CardTitle></CardHeader>
            <CardContent><div className="font-display text-3xl font-bold">{item.value}</div></CardContent>
          </Card>
        ))}
      </div>
      <Card className="shadow-soft"><CardHeader><CardTitle>System status</CardTitle></CardHeader><CardContent><div className="flex flex-wrap gap-2"><Badge variant="secondary">Firebase connected</Badge><Badge variant="secondary">Realtime sync enabled</Badge><Badge variant="secondary">POS modules live</Badge></div></CardContent></Card>
    </div>
  );
}
