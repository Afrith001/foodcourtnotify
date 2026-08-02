import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { doc, onSnapshot, runTransaction, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDb, COL } from "@/lib/firebase";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, PackageCheck, ChefHat, Clock3, CheckCircle2, CircleDashed, ShoppingBag, TimerReset, ReceiptText } from "lucide-react";
import { findOrderByPublicId, isOrderArchived, normalizeMobile } from "@/lib/order-utils";

export const Route = createFileRoute("/_authenticated/tracking")({
  component: TrackingPage,
});

type Order = {
  id: string;
  orderId?: string;
  orderNumber: number;
  status: string;
  customerMobile?: string | null;
  customerName?: string | null;
  items?: Array<{ name: string; quantity: number; preparationTime?: number }>; 
  total?: number;
  createdAt?: any;
  completedAt?: any;
  archivedAt?: any;
};

const STATUS_STEPS = [
  { key: "pending", label: "Preparing", icon: CircleDashed },
  { key: "preparing", label: "Cooking", icon: ChefHat },
  { key: "ready", label: "Ready", icon: PackageCheck },
  { key: "completed", label: "Completed", icon: CheckCircle2 },
];

function TrackingPage() {
  const { shop } = useShop();
  const [mobile, setMobile] = useState("");
  const [orderIdInput, setOrderIdInput] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    if (!order?.id) return;
    const unsub = onSnapshot(doc(getDb(), COL.orders, order.id), (snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as Partial<Order>;
      setOrder((current) => (current ? { ...current, ...data, id: snap.id } as Order : null));
    }, (error) => {
      if (import.meta.env.DEV) console.error("[tracking] order listener failed", error);
      setLookupError("Live updates are temporarily unavailable. Please refresh and try again.");
    });
    return () => unsub();
  }, [order?.id]);

  useEffect(() => {
    if (!order) return;
    const index = STATUS_STEPS.findIndex((step) => step.key === order.status);
    setActiveStep(index >= 0 ? index : 0);
  }, [order?.status]);

  const trackOrder = async () => {
    if (!shop) return;
    if (!mobile.trim() || !orderIdInput.trim()) {
      toast.error("Please enter the order ID and mobile number.");
      return;
    }

    setLoading(true);
    setLookupError(null);
    try {
      const db = getDb();
      const matched = await findOrderByPublicId(db, shop.id, orderIdInput);

      if (!matched) {
        setOrder(null);
        toast.error("No matching order was found for that Order ID.");
        return;
      }

      const data = matched.data() as Partial<Order>;
      const normalizedMobile = normalizeMobile(mobile);
      const storedMobile = normalizeMobile(String(data.customerMobile || ""));
      if (storedMobile && storedMobile !== normalizedMobile) {
        setOrder(null);
        toast.error("No matching order was found for those details.");
        return;
      }
      if (!storedMobile) await updateDoc(doc(db, COL.orders, matched.id), { customerMobile: normalizedMobile, updatedAt: serverTimestamp() });

      const customerId = `${shop.id}_${normalizedMobile}`;
      const customerRef = doc(db, COL.customers, customerId);
      await runTransaction(db, async (tx) => {
        const existing = await tx.get(customerRef);
        if (existing.exists()) {
          tx.update(customerRef, {
            name: data.customerName || existing.data().name || "Customer",
            mobile: normalizedMobile,
            lastVisit: serverTimestamp(),
          });
        } else {
          tx.set(customerRef, {
            shopId: shop.id,
            mobile: normalizedMobile,
            name: data.customerName || "Customer",
            totalOrders: 1,
            totalSpending: data.total || 0,
            loyaltyPoints: Math.max(1, Math.floor((data.total || 0) / 100)),
            createdAt: serverTimestamp(),
            lastVisit: serverTimestamp(),
          });
        }
      });

      setOrder({ id: matched.id, ...data, orderNumber: data.orderNumber ?? 0, customerMobile: normalizedMobile } as Order);
      toast.success("Order found. Live tracking is now active.");
    } catch (error) {
      if (import.meta.env.DEV) console.error("[tracking] lookup failed", error);
      const message = "We could not look up that order right now. Please try again shortly.";
      setLookupError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const archived = useMemo(() => (order ? isOrderArchived(order) : false), [order]);
  const estimatedMinutes = useMemo(() => {
    if (!order?.items?.length) return 15;
    const computed = order.items.reduce((sum, item) => sum + (item.preparationTime ?? 10) * (item.quantity ?? 1), 0);
    return Math.max(15, Math.round(computed / 60));
  }, [order?.items]);

  return (
    <div className="space-y-5 p-2 lg:p-4">
      <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-5">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Customer Tracking</h1>
            <p className="text-sm text-slate-500">Track the current kitchen progress with your order ID and mobile number.</p>
          </div>
          <Badge className="w-fit rounded-full bg-orange-500 px-3 py-1 text-[11px] font-semibold text-white">Live status updates</Badge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <div>
            <Label className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Order ID</Label>
            <Input value={orderIdInput} onChange={(e) => setOrderIdInput(e.target.value.toUpperCase())} placeholder="NX-8F4K2Q9M7Z" className="h-10 rounded-2xl border-slate-200" />
          </div>
          <div>
            <Label className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Mobile Number</Label>
            <Input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Enter mobile number" className="h-10 rounded-2xl border-slate-200" />
          </div>
          <Button onClick={trackOrder} disabled={loading} className="h-10 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-700">
            <Search className="mr-2 h-4 w-4" /> Track Order
          </Button>
        </div>
        {lookupError && <p role="alert" className="mt-3 text-sm font-medium text-rose-600">{lookupError}</p>}
      </div>

      {!order ? (
        <Card className="border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center text-sm text-slate-500">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <PackageCheck className="h-6 w-6" />
          </div>
          <div className="mt-3 font-semibold text-slate-700">No active tracking session</div>
          <div className="mt-1">Enter the order ID and mobile number to see the live kitchen progress for that order.</div>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-0 bg-white p-0 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <CardHeader className="border-b border-slate-100 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">Live Progress Timeline</CardTitle>
                  <CardDescription className="mt-1 text-sm text-slate-500">Order {order.orderId || order.id}</CardDescription>
                </div>
                <Badge className={`rounded-full px-3 py-1 text-[11px] font-semibold ${order.status === "completed" ? "bg-emerald-600 text-white" : order.status === "cancelled" ? "bg-rose-600 text-white" : "bg-slate-900 text-white"}`}>
                  {order.status || "pending"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-4">
                {STATUS_STEPS.map((step, index) => {
                  const isActive = index <= activeStep;
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="flex gap-3">
                      <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isActive ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 rounded-[16px] border border-slate-100 bg-slate-50/80 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-semibold text-slate-900">{step.label}</div>
                          {index === activeStep && <Badge className="rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-semibold text-orange-700">Current</Badge>}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">{step.key === "pending" ? "Order received and queued in the kitchen" : step.key === "preparing" ? "Kitchen is actively cooking your order" : step.key === "ready" ? "Your food is ready for pickup" : "Your order has been completed successfully"}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white p-0 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <CardHeader className="border-b border-slate-100 p-5">
              <CardTitle className="text-lg font-semibold text-slate-900">Order Snapshot</CardTitle>
              <CardDescription className="mt-1 text-sm text-slate-500">Current order details and kitchen timing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <div className="rounded-[18px] border border-slate-100 bg-slate-50/70 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Customer</div>
                <div className="mt-2 font-semibold text-slate-900">{order.customerName || "Guest"}</div>
                <div className="mt-1 text-sm text-slate-500">{order.customerMobile || "No mobile captured yet"}</div>
              </div>

              <div className="rounded-[18px] border border-slate-100 bg-slate-50/70 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Order Details</div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-700">
                  <span>Order ID</span>
                  <span className="font-semibold text-slate-900">{order.orderId || order.id}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-700">
                  <span>Items</span>
                  <span className="font-semibold text-slate-900">{order.items?.length || 0}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-700">
                  <span>Total</span>
                  <span className="font-semibold text-slate-900">₹{Number(order.total || 0).toFixed(0)}</span>
                </div>
              </div>

              <div className="rounded-[18px] border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Clock3 className="h-4 w-4 text-orange-500" /> Estimated time
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-700">
                  <span>Ready in</span>
                  <span className="font-semibold text-slate-900">~{estimatedMinutes} min</span>
                </div>
              </div>

              <div className="rounded-[18px] border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <ShoppingBag className="h-4 w-4 text-orange-500" /> Ordered items
                </div>
                <div className="mt-3 space-y-2">
                  {(order.items || []).map((item, index) => (
                    <div key={`${item.name}-${index}`} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2 text-sm">
                      <div>
                        <div className="font-semibold text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-500">Qty {item.quantity}</div>
                      </div>
                      <div className="text-xs font-semibold text-slate-500">{item.quantity} ×</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[18px] border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <ReceiptText className="h-4 w-4 text-orange-500" /> Order timing
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-700">
                  <span>Order time</span>
                  <span className="font-semibold text-slate-900">{order.createdAt ? new Date(order.createdAt.toMillis()).toLocaleString() : "—"}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-700">
                  <span>Status</span>
                  <span className="font-semibold text-slate-900">{archived ? "Archived" : order.status || "pending"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
