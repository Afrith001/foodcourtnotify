import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  getCountFromServer,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { getDb, COL } from "@/lib/firebase";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Download,
  QrCode,
  ListOrdered,
  Users,
  IndianRupee,
  TrendingUp,
  Loader2,
  Watch,
  ShoppingBag,
  Check,
  CreditCard,
  Settings,
} from "lucide-react";
import { generateQrDataUrl, buildPortalUrl } from "@/lib/qr";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{ title: `${i18n.t("common.dashboard")} · ${i18n.t("common.appName")}` }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { shop } = useShop();
  const [qr, setQr] = useState<string>("");
  const { t } = useTranslation();
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
    preparing: 0,
    ready: 0,
    completed: 0,
    customers: 0,
    revenue: 0,
  });

  useEffect(() => {
    document.title = `${t("common.dashboard")} · ${t("common.appName")}`;
  }, [t]);

  useEffect(() => {
    if (!shop) return;
    const url = buildPortalUrl(shop.shopCode);
    generateQrDataUrl(url, shop.themeColor).then(setQr);
  }, [shop]);

  useEffect(() => {
    if (!shop) return;
    const db = getDb();

    let activeUnsub: () => void = () => {};
    let todayUnsub: () => void = () => {};
    let isCancelled = false;

    const resetStart = () => {
      if (shop.dailyResetMode === "manual" && shop.lastManualResetAt) {
        return shop.lastManualResetAt;
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    };

    (async () => {
      try {
        setLoadingStats(true);
        const startTime = resetStart();

        const customersCountSnap = await getCountFromServer(
          query(collection(db, COL.customers), where("shopId", "==", shop.id)),
        );
        if (isCancelled) return;
        const totalCustomers = customersCountSnap.data().count;

        const allOrdersSnap = await getDocs(
          query(collection(db, COL.orders), where("shopId", "==", shop.id)),
        );
        if (isCancelled) return;

        const allOrdersList = allOrdersSnap.docs.map((d) => d.data());

        const histOrders = allOrdersList.filter((o) => {
          const t = o.createdAt?.toMillis?.() ?? 0;
          return t < startTime.getTime() && o.status !== "Waiting";
        });

        const histOrdersCount = histOrders.length;
        const histRevenue = histOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
        const periodOrders = allOrdersList.filter((o) => {
          const t = o.createdAt?.toMillis?.() ?? 0;
          return t >= startTime.getTime() && o.status !== "Waiting";
        });

        setStats({
          total: allOrdersList.filter((o) => o.status !== "Waiting").length,
          today: periodOrders.length,
          pending: allOrdersList.filter((o) => o.status === "pending").length,
          preparing: allOrdersList.filter((o) => o.status === "preparing").length,
          ready: allOrdersList.filter((o) => o.status === "ready").length,
          completed: allOrdersList.filter((o) => o.status === "completed" && (o.createdAt?.toMillis?.() ?? 0) >= startTime.getTime()).length,
          customers: totalCustomers,
          revenue: periodOrders.reduce((sum, o) => sum + Number(o.total || 0), 0),
        });
        setLoadingStats(false);

        const todayQ = query(
          collection(db, COL.orders),
          where("shopId", "==", shop.id),
          where("createdAt", ">=", startTime),
        );

        const activeQ = query(
          collection(db, COL.orders),
          where("shopId", "==", shop.id),
          where("status", "in", ["pending", "preparing", "ready"]),
        );

        const todayOrdersMap = new Map();
        const activeOrdersMap = new Map();

        const updateLiveStats = () => {
          const merged = new Map();
          todayOrdersMap.forEach((v, k) => merged.set(k, v));
          activeOrdersMap.forEach((v, k) => merged.set(k, v));

          const orderRows = Array.from(merged.values());

const cutoff = startTime.getTime();
        const liveTodayOrders = orderRows.filter((r) => {
          const t = r.createdAt?.toMillis?.() ?? 0;
          return t >= cutoff && r.status !== "Waiting";
          });

          const liveTodayOrdersCount = liveTodayOrders.length;
          const liveTodayRevenue = liveTodayOrders.reduce(
            (sum, o) => sum + Number(o.total || 0),
            0,
          );

          setStats((prev) => ({
            ...prev,
            total: histOrdersCount + liveTodayOrdersCount,
            today: liveTodayOrdersCount,
            revenue: histRevenue + liveTodayRevenue,
            pending: orderRows.filter((r) => r.status === "pending").length,
            preparing: orderRows.filter((r) => r.status === "preparing").length,
            ready: orderRows.filter((r) => r.status === "ready").length,
            completed: orderRows.filter(
              (r) =>
                r.status === "completed" && (r.createdAt?.toMillis?.() ?? 0) >= cutoff,
            ).length,
          }));
        };

        todayUnsub = onSnapshot(
          todayQ,
          (snap) => {
            snap.docChanges().forEach((change) => {
              if (change.type === "removed") {
                todayOrdersMap.delete(change.doc.id);
              } else {
                todayOrdersMap.set(change.doc.id, change.doc.data());
              }
            });
            updateLiveStats();
          },
          (err) => {
            if (import.meta.env.DEV) console.error("todayQ listener error:", err);
          },
        );

        activeUnsub = onSnapshot(
          activeQ,
          (snap) => {
            snap.docChanges().forEach((change) => {
              if (change.type === "removed") {
                activeOrdersMap.delete(change.doc.id);
              } else {
                activeOrdersMap.set(change.doc.id, change.doc.data());
              }
            });
            updateLiveStats();
          },
          (err) => {
            if (import.meta.env.DEV) console.error("activeQ listener error:", err);
          },
        );
      } catch (err) {
        if (import.meta.env.DEV) console.error("Error loading dashboard statistics:", err);
        if (!isCancelled) setLoadingStats(false);
      }
    })();

    return () => {
      isCancelled = true;
      activeUnsub();
      todayUnsub();
    };
  }, [shop]);

  if (!shop) return null;
  const portalUrl = buildPortalUrl(shop.shopCode);
  const isManualReset = shop.dailyResetMode === "manual";

  const copyUrl = async () => {
    await navigator.clipboard.writeText(portalUrl);
    toast.success("Portal URL copied");
  };
  const downloadQr = () => {
    const a = document.createElement("a");
    a.href = qr;
    a.download = `${shop.shopCode}-qr.png`;
    a.click();
  };

  const resetEndOfDay = async () => {
    try {
      await updateDoc(doc(getDb(), COL.shops, shop.id), {
        lastManualResetAt: serverTimestamp(),
      });
      setStats((prev) => ({ ...prev, today: 0, revenue: 0, pending: 0, preparing: 0, ready: 0, completed: 0 }));
      toast.success("End of day reset saved.");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const cards = [
    { label: "Total orders", value: stats.total, icon: ListOrdered },
    { label: "Today's orders", value: stats.today, icon: TrendingUp },
    { label: "Customers", value: stats.customers, icon: Users },
    { label: "Revenue", value: `₹${stats.revenue.toFixed(0)}`, icon: IndianRupee },
  ];

  const statusStages = [
    { key: "pending", label: "Pending", icon: Watch, color: "amber" },
    { key: "preparing", label: "Preparing", icon: ShoppingBag, color: "sky" },
    { key: "ready", label: "Ready for Pickup", icon: ShoppingBag, color: "orange" },
    { key: "completed", label: "Completed", icon: Check, color: "emerald" },
  ];

  const stageCounts = {
    pending: stats.pending,
    preparing: stats.preparing,
    ready: stats.ready,
    completed: stats.completed,
  };

  const activeStage = statusStages.reduce<number>((index, stage, idx) => {
    if (stageCounts[stage.key as keyof typeof stageCounts] > 0) return idx;
    return index;
  }, -1);

  return (
    <div className="min-h-screen bg-[#FDF6E9] p-4 lg:p-8">
      <main className="space-y-8">
        <section className="rounded-[2rem] bg-white/90 p-8 shadow-[0_24px_60px_rgba(111,65,54,0.12)]">
          <p className="text-sm uppercase tracking-[0.3em] text-[#8B5E58]">Good morning</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-serif font-semibold leading-tight text-[#2B0F12]">
            Good Morning, {shop.name}
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-[#6F4A44]">
            Welcome back. Here is your warm bistro dashboard with the latest insight into orders,
            revenue, and customer activity.
          </p>
        </section>

        <section className="rounded-[2rem] bg-white/90 p-6 shadow-[0_16px_45px_rgba(111,65,54,0.1)]">
          <div className="relative">
            <div className="absolute inset-x-6 top-1/2 h-[2px] bg-[#E8D7C3]" />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
              {statusStages.map((stage, idx) => {
                const filled = idx <= activeStage;
                return (
                  <div key={stage.key} className="flex flex-col items-center text-center">
                    <div
                      className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 ${
                        filled ? "border-[#B96A24] bg-[#F5E0C7]" : "border-[#E8D7C3] bg-white"
                      } shadow-sm`}
                    >
                      <stage.icon
                        className={`w-7 h-7 ${filled ? "text-[#B96A24]" : "text-[#A37A6E]"}`}
                      />
                    </div>
                    <span className="mt-4 text-sm font-medium text-[#5A2C2C]">{stage.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#F3D9A5] via-[#EACB94] to-[#F7E2C0] p-6 shadow-[0_18px_50px_rgba(202,138,93,0.18)]">
              <div className="absolute right-4 top-4 text-[5rem] font-serif text-[#F5E1C2] opacity-40">
                ₹
              </div>
              <div className="relative z-10">
                <p className="text-sm text-[#6A3B24]">Revenue</p>
                <div className="mt-10 text-5xl font-serif font-semibold text-[#3E1D10]">
                  ₹{stats.revenue.toFixed(0)}
                </div>
                <div className="mt-4 text-xs uppercase tracking-[0.24em] text-[#6A3B24]/80 flex items-center justify-between">
                  <span>Last 7 days</span>
                  <span className="rounded-full bg-white/90 px-3 py-1 text-[#6A3B24]">Trend</span>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#F2D6DE] to-[#E8D6E0] p-6 shadow-[0_18px_50px_rgba(180,109,142,0.14)]">
              <div className="absolute right-4 top-4 text-[5rem] text-[#F6D5E0] opacity-40">🛒</div>
              <div className="relative z-10">
                <p className="text-sm text-[#5B2E3C]">Total Orders</p>
                <div className="mt-8 text-4xl font-semibold text-[#3D1F27]">{stats.total}</div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#F9E7D9] to-[#F2D8C2] p-6 shadow-[0_18px_50px_rgba(204,145,101,0.12)]">
              <div className="absolute right-6 top-6 w-32 h-32 rounded-3xl bg-white/90 blur-2xl" />
              <div className="relative z-10">
                <p className="text-sm text-[#6A4A39]">QR Code</p>
                <div className="mt-6 flex items-center justify-center rounded-3xl bg-white p-4 shadow-inner">
                  {qr ? (
                    <img src={qr} alt="QR" className="w-32 h-32 rounded-2xl" />
                  ) : (
                    <div className="w-32 h-32 rounded-2xl bg-slate-100 animate-pulse" />
                  )}
                </div>
                <p className="mt-4 text-sm text-[#5B3F30]">Scan as QR code</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#D7ECF7] to-[#E8F3FB] p-6 shadow-[0_18px_50px_rgba(119,153,183,0.14)]">
              <div className="absolute right-6 top-4 text-[4.5rem] text-[#B7D6EB] opacity-40">
                👥
              </div>
              <div className="relative z-10">
                <p className="text-sm text-[#38607A]">New Customers</p>
                <div className="mt-8 text-4xl font-semibold text-[#1D3A4D]">{stats.customers}</div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#DCEFD8] to-[#E9F6E9] p-6 shadow-[0_18px_50px_rgba(107,151,118,0.14)]">
              <div className="absolute right-6 top-4 text-[4.5rem] text-[#CFE7D1] opacity-40">
                📋
              </div>
              <div className="relative z-10">
                <p className="text-sm text-[#3F5B3E]">Today's Orders</p>
                <div className="mt-8 text-4xl font-semibold text-[#2A4330]">{stats.today}</div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#F5F0E0] to-[#EDE2CB] p-6 shadow-[0_18px_50px_rgba(175,133,97,0.12)]">
              <div className="absolute left-4 top-4 rounded-full bg-white/90 p-3 text-[#A67A4D]">
                💠
              </div>
              <div className="relative z-10">
                <p className="text-sm text-[#69543E]">Customer portal</p>
                <div className="mt-4 rounded-3xl bg-white p-4 text-sm text-[#5F4A3B] break-all">
                  {portalUrl}
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button onClick={copyUrl} variant="outline" size="sm">
                    Copy
                  </Button>
                  <Button onClick={downloadQr} size="sm" disabled={!qr}>
                    Download
                  </Button>
                  {isManualReset && (
                    <Button onClick={resetEndOfDay} variant="secondary" size="sm">
                      End of Day
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
