import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, updateDoc, where, limit } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { getDb, COL, getFirebaseAuth } from "@/lib/firebase";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CalendarDays, CheckCircle2, Sparkles } from "lucide-react";
import { notifyOrderStatusChange } from "@/lib/order-utils";
import { endOfDay, format, isSameDay, startOfDay, subDays } from "date-fns";

export const Route = createFileRoute("/_authenticated/kitchen")({
  component: KitchenPage,
});

type Order = {
  id: string;
  orderNumber: number;
  orderId?: string;
  status: string;
  items: Array<{ name: string; quantity: number; variant?: string | null; notes?: string | null }>;
  total: number;
  createdAt: any;
  orderType?: string | null;
  tableNumber?: string | null;
};

const stages = [
  { key: "pending", label: "Pending" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "completed", label: "Completed" },
];

function KitchenPage() {
  const navigate = useNavigate();
  const { shop } = useShop();
  const [orders, setOrders] = useState<Order[]>([]);
  const [flashingOrderIds, setFlashingOrderIds] = useState<string[]>([]);
  const [tick, setTick] = useState(Date.now());
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [filterMode, setFilterMode] = useState<"today" | "yesterday" | "custom">("today");
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});
  const seenOrderIdsRef = useRef(new Set<string>());
  const audioContextRef = useRef<AudioContext | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!shop) return;
    const db = getDb();
    const q = query(collection(db, COL.orders), where("shopId", "==", shop.id), orderBy("createdAt", "desc"), limit(100));
    const unsub = onSnapshot(q, (snap) => {
      const nextOrders = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<Order, "id">) }))
        .filter((order) => order.status !== "Waiting" && order.status !== "cancelled")
        .sort((a, b) => Number(b.createdAt?.seconds ?? 0) - Number(a.createdAt?.seconds ?? 0));

      const incomingIds = nextOrders.filter((order) => !seenOrderIdsRef.current.has(order.id)).map((order) => order.id);
      if (incomingIds.length > 0) {
        incomingIds.forEach((id) => seenOrderIdsRef.current.add(id));
        setFlashingOrderIds((prev) => Array.from(new Set([...prev, ...incomingIds])));
        playArrivalChime();
      }

      setOrders(nextOrders);
    });
    return () => unsub();
  }, [shop]);

  useEffect(() => {
    if (!flashingOrderIds.length) return;
    const timeoutId = window.setTimeout(() => setFlashingOrderIds([]), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [flashingOrderIds]);

  useEffect(() => {
    const timerId = window.setInterval(() => setTick(Date.now()), 15000);
    return () => window.clearInterval(timerId);
  }, []);

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

  const handleLogout = async () => {
    try {
      await signOut(getFirebaseAuth());
      navigate({ to: "/auth" });
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const formatElapsed = (createdAt: any) => {
    if (!createdAt?.toDate) return "Just now";
    const created = createdAt.toDate();
    const diffMs = Date.now() - created.getTime();
    const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return `${hours}h ${mins}m ago`;
  };

  const getSelectedDateValue = () => {
    const [year, month, day] = selectedDate.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const isOrderOnSelectedDate = (createdAt: any) => {
    const value = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
    const start = startOfDay(getSelectedDateValue());
    const end = endOfDay(getSelectedDateValue());
    return value >= start && value <= end;
  };

  const handleQuickFilter = (mode: "today" | "yesterday" | "custom", value?: string) => {
    setFilterMode(mode);
    if (value) {
      setSelectedDate(value);
      return;
    }

    if (mode === "today") {
      setSelectedDate(format(new Date(), "yyyy-MM-dd"));
    } else if (mode === "yesterday") {
      setSelectedDate(format(subDays(new Date(), 1), "yyyy-MM-dd"));
    }
  };

  const openDatePicker = () => {
    dateInputRef.current?.showPicker?.();
    dateInputRef.current?.click();
  };

  const playArrivalChime = () => {
    if (typeof window === "undefined") return;
    const AudioCtor = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    const ctx = audioContextRef.current ?? new AudioCtor();
    audioContextRef.current = ctx;
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.16);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  };

  if (!shop) return null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(182,124,47,0.16),_transparent_28%),_linear-gradient(135deg,_rgba(255,250,243,0.98),_rgba(248,239,228,0.95))] p-2 sm:p-4 lg:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3 rounded-[28px] border border-border/70 bg-card/90 p-4 shadow-soft sm:p-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-700">
              <Sparkles className="h-3.5 w-3.5" /> Kitchen display
            </div>
            <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Live kitchen workflow</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">New orders appear instantly, flash for staff attention, and stay easy to read from a distance.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-2xl border border-border/70 bg-muted/70 px-4 py-3 text-sm text-muted-foreground">
              <div className="font-semibold text-foreground">{orders.length} active orders</div>
              <div className="mt-1">Updated {new Date(tick).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        <div className="rounded-[24px] border border-border/70 border-b-[3px] border-b-[#d8b46b]/50 bg-[linear-gradient(135deg,_rgba(255,250,243,0.98),_rgba(248,239,228,0.95))] p-3 shadow-soft sm:p-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex min-h-[44px] items-center gap-2 rounded-full border border-[#d8b46b]/50 bg-[#fffaf3]/90 px-3 py-2 text-sm font-medium text-[#6b1d1d]">
              <CalendarDays className="h-4 w-4" />
              <span>Filter by date</span>
            </div>
            <button
              type="button"
              className={`min-h-[44px] rounded-full border px-4 py-2 text-sm font-semibold transition-all ${filterMode === "today" ? "border-[#6b1d1d] bg-[#6b1d1d] text-[#fffaf3] shadow-sm" : "border-[#d8b46b]/60 bg-transparent text-[#6b1d1d] hover:bg-[#fff7e8]"}`}
              onClick={() => handleQuickFilter("today")}
            >
              Today
            </button>
            <button
              type="button"
              className={`min-h-[44px] rounded-full border px-4 py-2 text-sm font-semibold transition-all ${filterMode === "yesterday" ? "border-[#6b1d1d] bg-[#6b1d1d] text-[#fffaf3] shadow-sm" : "border-[#d8b46b]/60 bg-transparent text-[#6b1d1d] hover:bg-[#fff7e8]"}`}
              onClick={() => handleQuickFilter("yesterday")}
            >
              Yesterday
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={openDatePicker}
                className={`flex min-h-[44px] items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-all ${filterMode === "custom" ? "border-[#6b1d1d] bg-[#6b1d1d] text-[#fffaf3] shadow-sm" : "border-[#d8b46b]/60 bg-[#fffaf3] text-[#6b1d1d] hover:bg-[#fff7e8]"}`}
              >
                <CalendarDays className="h-4 w-4" />
                <span>{filterMode === "custom" ? format(getSelectedDateValue(), "d MMM yyyy") : "Custom date"}</span>
              </button>
              <input
                ref={dateInputRef}
                type="date"
                value={selectedDate}
                onChange={(event) => {
                  setSelectedDate(event.target.value);
                  setFilterMode("custom");
                }}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>
          </div>
          <div className="mt-3 text-sm font-medium text-[#7c5f48]">
            Showing orders for {format(getSelectedDateValue(), "d MMM yyyy")}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {stages.map((stage) => {
            const stageOrders = orders.filter((order) => order.status === stage.key && isOrderOnSelectedDate(order.createdAt));
            const isExpanded = expandedStages[stage.key] ?? false;
            const visibleOrders = isExpanded ? stageOrders : stageOrders.slice(0, 6);
            const showMoreControl = stageOrders.length > 6;

            return (
              <div key={stage.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{stage.label}</h3>
                  <Badge variant="secondary">{stageOrders.length}</Badge>
                </div>

                <div className="space-y-2">
                  {visibleOrders.map((order) => {
                    const isFlashing = flashingOrderIds.includes(order.id);
                    const nextStage = stages[stages.findIndex((item) => item.key === stage.key) + 1];
                    return (
                      <Card key={order.id} className={isFlashing ? "border-amber-500 bg-amber-50/80 shadow-[0_0_0_4px_rgba(245,158,11,0.2)]" : "border-border/70 bg-card/95 shadow-soft"}>
                        <CardContent className="space-y-4 p-4 sm:p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">Order #{order.orderNumber || order.orderId || order.id}</div>
                              <div className="mt-1 text-xl font-semibold text-foreground">{order.orderId || order.id}</div>
                            </div>
                            <div className="rounded-2xl bg-muted/80 px-3 py-2 text-right text-sm text-muted-foreground">
                              <div className="font-semibold text-foreground">{formatElapsed(order.createdAt)}</div>
                              <div className="text-[11px] uppercase tracking-[0.2em]">Placed</div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{order.orderType || "Dine-In"}</Badge>
                            {order.tableNumber ? <Badge variant="secondary">Table {order.tableNumber}</Badge> : null}
                            <Badge className="bg-amber-500/10 text-amber-800">{stage.label}</Badge>
                          </div>

                          <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Items</div>
                            <ul className="mt-2 space-y-2">
                              {order.items.map((item, index) => (
                                <li key={`${order.id}-${index}`} className="rounded-xl bg-card px-3 py-2 text-sm font-semibold text-foreground">
                                  <div className="flex items-start justify-between gap-3">
                                    <span>{item.quantity} × {item.name}</span>
                                    {item.variant ? <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.variant}</span> : null}
                                  </div>
                                  {item.notes ? <div className="mt-1 text-sm text-muted-foreground">Note: {item.notes}</div> : null}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/60 px-3 py-2 text-sm">
                            <span className="font-semibold text-foreground">Total</span>
                            <span className="text-lg font-semibold text-foreground">₹{Number(order.total || 0).toFixed(0)}</span>
                          </div>

                          {stage.key !== "completed" ? (
                            <Button className="h-12 w-full text-base" onClick={() => advance(order.id, nextStage?.key ?? "completed")}>Mark {nextStage?.label ?? "Completed"}</Button>
                          ) : (
                            <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-3 py-3 text-sm font-semibold text-emerald-700">
                              <CheckCircle2 className="h-4 w-4" /> Completed
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}

                  {showMoreControl ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-sm"
                      onClick={() =>
                        setExpandedStages((prev) => ({
                          ...prev,
                          [stage.key]: !prev[stage.key],
                        }))
                      }
                    >
                      {isExpanded ? "Show less" : "Show more"}
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
