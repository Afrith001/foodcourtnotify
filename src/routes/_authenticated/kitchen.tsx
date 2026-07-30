import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, updateDoc, where, limit } from "firebase/firestore";
import { getDb, COL } from "@/lib/firebase";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Clock3, CheckCircle2 } from "lucide-react";
import { notifyOrderStatusChange } from "@/lib/order-utils";

export const Route = createFileRoute("/_authenticated/kitchen")({
  component: KitchenPage,
});

type Order = {
  id: string;
  orderNumber: number;
  orderId?: string;
  status: string;
  items: Array<{ name: string; quantity: number }>;
  total: number;
  createdAt: any;
};

const stages = [
  { key: "pending", label: "Pending" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "completed", label: "Completed" },
];

function KitchenPage() {
  const { shop } = useShop();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!shop) return;
    const db = getDb();
    const q = query(collection(db, COL.orders), where("shopId", "==", shop.id), orderBy("createdAt", "desc"), limit(100));
    const unsub = onSnapshot(q, (snap) => setOrders(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Order, "id">) })).filter((o) => o.status !== "Waiting")));
    return () => unsub();
  }, [shop]);

  const advance = async (orderId: string, nextStatus: string) => {
    try {
      const order = orders.find((entry) => entry.id === orderId);
      await updateDoc(doc(getDb(), COL.orders, orderId), { status: nextStatus, updatedAt: new Date() });
      await notifyOrderStatusChange({ id: orderId, orderId: order?.orderId, customerName: order?.items?.[0]?.name }, nextStatus, shop?.id);
      toast.success(`Order moved to ${nextStatus}`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  if (!shop) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold">Kitchen workflow</h1>
        <p className="text-sm text-muted-foreground">Move orders through pending, preparing, ready and completed states in real time.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        {stages.map((stage) => {
          const stageOrders = orders.filter((order) => order.status === stage.key);
          return (
            <div key={stage.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{stage.label}</h3>
                <Badge variant="secondary">{stageOrders.length}</Badge>
              </div>
              {stageOrders.map((order) => (
                <Card key={order.id} className="shadow-soft">
                  <CardContent className="space-y-3 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{order.orderId || order.id}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock3 className="h-3 w-3" />{order.createdAt ? new Date(order.createdAt.toMillis()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")}</div>
                    <div className="font-semibold">₹{Number(order.total || 0).toFixed(0)}</div>
                    {stage.key !== "completed" ? <Button className="w-full" onClick={() => advance(order.id, stages[stages.findIndex((item) => item.key === stage.key) + 1]?.key ?? "completed")}>Mark {stages[stages.findIndex((item) => item.key === stage.key) + 1]?.label ?? "Completed"}</Button> : <div className="flex items-center gap-2 text-sm text-success"><CheckCircle2 className="h-4 w-4" /> Completed</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
