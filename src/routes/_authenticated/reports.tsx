import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { getDb, COL } from "@/lib/firebase";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Printer, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Calendar, 
  PieChart as PieIcon, 
  Award,
  ChevronRight
} from "lucide-react";
import { 
  startOfDay, 
  subDays, 
  startOfMonth, 
  startOfYear, 
  format 
} from "date-fns";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from "recharts";
import { formatCurrency } from "@/lib/pos";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/reports")({
  component: ReportsPage,
});

type Order = {
  orderId?: string;
  total: number;
  status: string;
  paymentMethod: string;
  payments?: Array<{ method: string; amount: number }>;
  items: Array<{ name: string; quantity: number; price: number; categoryId?: string }>;
  customerMobile?: string | null;
  createdAt?: any;
};

type Category = {
  id: string;
  name: string;
};

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

function ReportsPage() {
  const { shop } = useShop();
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Date and Chart filters
  const [dateFilter, setDateFilter] = useState<"week" | "month" | "year">("week");

  // Load orders & categories
  useEffect(() => {
    if (!shop) return;
    const db = getDb();
    
    // Load orders
    const q = query(collection(db, COL.orders), where("shopId", "==", shop.id));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => d.data() as Order));
    });

    // Load categories
    const catQ = query(collection(db, COL.categories), where("shopId", "==", shop.id));
    const unsubCat = onSnapshot(catQ, (snap) => {
      setCategories(snap.docs.map((d) => ({ id: d.id, name: d.data().name })));
    });

    return () => {
      unsub();
      unsubCat();
    };
  }, [shop]);

  // Convert categories array to a lookup map
  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat.id] = cat.name;
    });
    return map;
  }, [categories]);

  // Parse Orders Dates
  const parsedOrders = useMemo(() => {
    return orders.map((o) => {
      const date = o.createdAt ? new Date(o.createdAt.toMillis()) : new Date();
      return {
        ...o,
        date,
        total: Number(o.total || 0),
      };
    });
  }, [orders]);

  // Date starts
  const todayStart = useMemo(() => startOfDay(new Date()), []);
  const yesterdayStart = useMemo(() => startOfDay(subDays(new Date(), 1)), []);
  const weekStart = useMemo(() => startOfDay(subDays(new Date(), 7)), []);
  const monthStart = useMemo(() => startOfMonth(new Date()), []);
  const yearStart = useMemo(() => startOfYear(new Date()), []);

  // Compute Metrics Dashboard
  const stats = useMemo(() => {
    let todaySales = 0;
    let yesterdaySales = 0;
    let weekSales = 0;
    let monthSales = 0;
    let yearSales = 0;

    let cashSales = 0;
    let upiSales = 0;
    let cardSales = 0;

    let pendingCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;
    let refundCount = 0;

    const uniqueMobiles = new Set<string>();
    let totalCompletedRevenue = 0;
    let totalCompletedCount = 0;

    const itemCounts: Record<string, { quantity: number; totalSales: number }> = {};
    const catCounts: Record<string, number> = {};

    parsedOrders.forEach((o) => {
      const isCancelled = o.status === "cancelled";
      const isRefunded = o.status === "refunded";

      // Basic count splits
      if (o.status === "pending") pendingCount++;
      else if (o.status === "completed" || o.status === "ready" || o.status === "preparing") completedCount++;
      else if (o.status === "cancelled") cancelledCount++;
      else if (o.status === "refunded") refundCount++;

      if (o.customerMobile) {
        uniqueMobiles.add(o.customerMobile);
      }

      if (!isCancelled && !isRefunded) {
        const orderDate = o.date;
        const totalVal = o.total;

        // Sales aggregate ranges
        if (orderDate >= todayStart) todaySales += totalVal;
        if (orderDate >= yesterdayStart && orderDate < todayStart) yesterdaySales += totalVal;
        if (orderDate >= weekStart) weekSales += totalVal;
        if (orderDate >= monthStart) monthSales += totalVal;
        if (orderDate >= yearStart) yearSales += totalVal;

        // Payment type breakdown
        if (o.payments && Array.isArray(o.payments)) {
          o.payments.forEach((p) => {
            if (p.method === "cash") cashSales += Number(p.amount || 0);
            else if (p.method === "upi") upiSales += Number(p.amount || 0);
            else if (p.method === "card") cardSales += Number(p.amount || 0);
          });
        } else {
          if (o.paymentMethod === "cash") cashSales += totalVal;
          else if (o.paymentMethod === "upi") upiSales += totalVal;
          else if (o.paymentMethod === "card") cardSales += totalVal;
        }

        totalCompletedRevenue += totalVal;
        totalCompletedCount++;

        // Popular products
        if (Array.isArray(o.items)) {
          o.items.forEach((item) => {
            const qty = Number(item.quantity || 1);
            if (!itemCounts[item.name]) {
              itemCounts[item.name] = { quantity: 0, totalSales: 0 };
            }
            itemCounts[item.name].quantity += qty;
            itemCounts[item.name].totalSales += (Number(item.price || 0) * qty);

            // Top categories
            const catName = categoryMap[item.categoryId || ""] || "General";
            catCounts[catName] = (catCounts[catName] || 0) + qty;
          });
        }
      }
    });

    const averageBill = totalCompletedCount > 0 ? totalCompletedRevenue / totalCompletedCount : 0;

    const topItems = Object.entries(itemCounts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity);

    const topCats = Object.entries(catCounts)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity);

    return {
      todaySales,
      yesterdaySales,
      weekSales,
      monthSales,
      yearSales,
      cashSales,
      upiSales,
      cardSales,
      pendingCount,
      completedCount,
      cancelledCount,
      refundCount,
      averageBill,
      totalCustomers: uniqueMobiles.size,
      topItems: topItems.slice(0, 5),
      topCats: topCats.slice(0, 5),
    };
  }, [parsedOrders, todayStart, yesterdayStart, weekStart, monthStart, yearStart, categoryMap]);

  // Compute Daily Sales Chart values
  const chartData = useMemo(() => {
    const dataMap: Record<string, number> = {};
    const now = new Date();

    if (dateFilter === "week") {
      for (let i = 6; i >= 0; i--) {
        const d = subDays(now, i);
        dataMap[format(d, "EEE dd MMM")] = 0;
      }
      parsedOrders.forEach((o) => {
        if (o.status !== "cancelled" && o.status !== "refunded" && o.date >= weekStart) {
          const key = format(o.date, "EEE dd MMM");
          if (key in dataMap) dataMap[key] += o.total;
        }
      });
    } else if (dateFilter === "month") {
      for (let i = 29; i >= 0; i--) {
        const d = subDays(now, i);
        dataMap[format(d, "dd MMM")] = 0;
      }
      parsedOrders.forEach((o) => {
        const month30Days = startOfDay(subDays(now, 30));
        if (o.status !== "cancelled" && o.status !== "refunded" && o.date >= month30Days) {
          const key = format(o.date, "dd MMM");
          if (key in dataMap) dataMap[key] += o.total;
        }
      });
    } else {
      for (let i = 11; i >= 0; i--) {
        const d = subDays(now, i * 30);
        dataMap[format(d, "MMM yyyy")] = 0;
      }
      parsedOrders.forEach((o) => {
        if (o.status !== "cancelled" && o.status !== "refunded" && o.date >= yearStart) {
          const key = format(o.date, "MMM yyyy");
          if (key in dataMap) dataMap[key] += o.total;
        }
      });
    }

    return Object.entries(dataMap).map(([name, sales]) => ({ name, sales }));
  }, [parsedOrders, dateFilter, weekStart, yearStart]);

  // Payment Breakdown Pie Chart Data
  const paymentPieData = useMemo(() => {
    return [
      { name: "Cash", value: stats.cashSales },
      { name: "UPI", value: stats.upiSales },
      { name: "Card", value: stats.cardSales },
    ].filter((item) => item.value > 0);
  }, [stats]);

  // CSV Export
  const exportCsv = () => {
    const headers = "Date,OrderId,Status,PaymentMethod,ItemsCount,TotalRevenue\n";
    const rows = parsedOrders.map((o) => {
      const dateStr = o.createdAt ? format(new Date(o.createdAt.toMillis()), "yyyy-MM-dd HH:mm") : "—";
      const itemsCount = o.items ? o.items.reduce((s, i) => s + (i.quantity || 1), 0) : 0;
      return `"${dateStr}","${o.orderId || ""}","${o.status}","${o.paymentMethod}",${itemsCount},${o.total}`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `sales_report_${format(new Date(), "yyyy_MM_dd")}.csv`;
    link.click();
    toast.success("CSV export downloaded successfully");
  };

  if (!shop) return null;

  return (
    <div className="space-y-6 print-content">
      {/* Dynamic Styling to block page items on PDF Print */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            padding: 0 !important;
          }
          .print-content {
            margin: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Sales Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground">Comprehensive real-time financial reporting for {shop.name}.</p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <Button variant="outline" size="sm" onClick={exportCsv} className="h-9">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button variant="default" size="sm" onClick={() => window.print()} className="h-9">
            <Printer className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Sales Ranges aggregate cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { title: "Today's Sales", amount: stats.todaySales, tone: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          { title: "Yesterday's Sales", amount: stats.yesterdaySales, tone: "text-blue-600 bg-blue-50 border-blue-100" },
          { title: "Weekly Sales", amount: stats.weekSales, tone: "text-amber-600 bg-amber-50 border-amber-100" },
          { title: "Monthly Sales", amount: stats.monthSales, tone: "text-indigo-600 bg-indigo-50 border-indigo-100" },
          { title: "Yearly Sales", amount: stats.yearSales, tone: "text-rose-600 bg-rose-50 border-rose-100" },
        ].map((range, i) => (
          <Card key={i} className={`border ${range.tone} shadow-soft`}>
            <CardHeader className="p-3 pb-0">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-85">{range.title}</span>
            </CardHeader>
            <CardContent className="p-3 pt-1">
              <div className="text-xl font-bold font-display">{formatCurrency(range.amount, shop.currency ?? "INR")}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mid row KPI stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Average Bill", value: formatCurrency(stats.averageBill, shop.currency ?? "INR"), desc: "Per order average spending", icon: DollarSign },
          { title: "Total Customers", value: stats.totalCustomers, desc: "Unique mobile check-ins", icon: Users },
          { title: "Popular Item", value: stats.topItems[0]?.name || "—", desc: "Most orders containing", icon: Award },
          { title: "Completed Orders", value: stats.completedCount, desc: "Successful checkouts", icon: ShoppingBag },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card key={i} className="shadow-soft border-border/70">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">{kpi.title}</span>
                  <div className="text-xl font-bold leading-none">{kpi.value}</div>
                  <span className="text-[10px] text-muted-foreground block">{kpi.desc}</span>
                </div>
                <div className="p-2 rounded-xl bg-primary/5 text-primary">
                  <Icon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart and payment breakdown sections */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        
        {/* Main Sales Over Time Chart */}
        <Card className="shadow-soft border-border/80">
          <CardHeader className="p-4 flex flex-row items-center justify-between border-b pb-3">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-primary" /> Sales Over Time
              </CardTitle>
              <CardDescription className="text-xs">Select range interval for chart summary.</CardDescription>
            </div>
            
            {/* Chart intervals */}
            <div className="flex gap-1 no-print">
              {[
                { id: "week", label: "7 Days" },
                { id: "month", label: "30 Days" },
                { id: "year", label: "12 Months" },
              ].map((pill) => (
                <Button
                  key={pill.id}
                  size="sm"
                  variant={dateFilter === pill.id ? "default" : "outline"}
                  onClick={() => setDateFilter(pill.id as any)}
                  className="h-8 text-xs px-2.5 rounded-full"
                >
                  {pill.label}
                </Button>
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="p-4 pt-6">
            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis fontSize={9} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip 
                    formatter={(val) => [formatCurrency(Number(val), shop.currency ?? "INR"), "Sales"]} 
                    contentStyle={{ borderRadius: "10px", fontSize: "11px" }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#ea580c" strokeWidth={2} fillOpacity={1} fill="url(#salesGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Breakdowns */}
        <Card className="shadow-soft border-border/80 flex flex-col justify-between">
          <CardHeader className="p-4 border-b pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
              <PieIcon className="w-4 h-4 text-primary" /> Revenue by Payment Method
            </CardTitle>
            <CardDescription className="text-xs">Comparison of Cash, Card, and UPI.</CardDescription>
          </CardHeader>
          
          <CardContent className="p-4 flex-1 flex flex-col items-center justify-center min-h-[220px]">
            {paymentPieData.length > 0 ? (
              <div className="w-full h-[220px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {paymentPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => formatCurrency(Number(val), shop.currency ?? "INR")} />
                    <Legend verticalAlign="bottom" fontSize={10} iconSize={8} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground py-12">No recorded sales data.</div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Top Sellers and Order Status Splits layout */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Top Selling Products List with progress bars */}
        <Card className="shadow-soft border-border/80">
          <CardHeader className="p-4 border-b pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-primary" /> Top 5 Selling Products
            </CardTitle>
            <CardDescription className="text-xs">Based on total item quantity sold.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3.5">
            {stats.topItems.map((item, i) => {
              const maxQty = stats.topItems[0]?.quantity || 1;
              const percent = (item.quantity / maxQty) * 100;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground">#{i+1}</span>
                      {item.name}
                    </span>
                    <span className="text-muted-foreground">{item.quantity} units · <span className="font-medium text-emerald-600">{formatCurrency(item.totalSales, shop.currency ?? "INR")}</span></span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
            {!stats.topItems.length && (
              <div className="text-center text-xs text-muted-foreground py-10">No items sold.</div>
            )}
          </CardContent>
        </Card>

        {/* Order Status metrics */}
        <Card className="shadow-soft border-border/80">
          <CardHeader className="p-4 border-b pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-primary" /> Order Status Breakdown
            </CardTitle>
            <CardDescription className="text-xs">Aggregated counts of order statuses.</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Completed / Prep", count: stats.completedCount, color: "bg-emerald-500", textClass: "text-emerald-700 bg-emerald-50" },
                { label: "Pending", count: stats.pendingCount, color: "bg-amber-500", textClass: "text-amber-700 bg-amber-50" },
                { label: "Cancelled", count: stats.cancelledCount, color: "bg-red-500", textClass: "text-red-700 bg-red-50" },
                { label: "Refunded", count: stats.refundCount, color: "bg-indigo-500", textClass: "text-indigo-700 bg-indigo-50" },
              ].map((status, i) => (
                <div key={i} className={`flex flex-col p-3 rounded-xl border border-border/60 ${status.textClass}`}>
                  <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{status.label}</span>
                  <span className="text-2xl font-bold font-display mt-0.5">{status.count}</span>
                </div>
              ))}
            </div>

            {/* Top Categories splits */}
            <div className="mt-5 border-t pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Top Selling Categories</h4>
              <div className="flex flex-wrap gap-2">
                {stats.topCats.map((cat, i) => (
                  <Badge key={i} variant="outline" className="px-3 py-1 font-semibold flex items-center gap-1 bg-background">
                    {cat.name} <span className="text-primary font-bold">({cat.quantity})</span>
                  </Badge>
                ))}
                {!stats.topCats.length && (
                  <span className="text-xs text-muted-foreground">No categories data.</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
