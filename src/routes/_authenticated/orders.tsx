import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { getDb, COL } from "@/lib/firebase";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { toast } from "sonner";
import { 
  Search, 
  Filter, 
  Receipt, 
  Clock, 
  Printer, 
  CheckCircle2, 
  ShoppingBag, 
  User, 
  Smartphone,
  ChevronRight
} from "lucide-react";
import { notifyOrderStatusChange } from "@/lib/order-utils";
import { 
  startOfDay, 
  subDays, 
  startOfMonth, 
  endOfDay, 
  format,
  isAfter,
  isBefore
} from "date-fns";
import { formatCurrency, buildReceiptText } from "@/lib/pos";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  taxRate?: number;
  discount?: number;
  veg?: boolean;
  notes?: string | null;
  variant?: string | null;
  imageUrl?: string | null;
};

type Order = {
  id: string;
  orderNumber: number;
  orderId?: string;
  status: string;
  total: number;
  subtotal?: number;
  tax?: number;
  discount?: number;
  customerName: string | null;
  customerMobile: string;
  items: OrderItem[];
  paymentMethod: string;
  payments?: Array<{ method: string; amount: number }>;
  createdAt: Timestamp | null;
};

const KANBAN_COLUMNS = [
  { key: "pending", label: "Pending", next: "preparing" },
  { key: "preparing", label: "Preparing", next: "ready" },
  { key: "ready", label: "Ready", next: "completed" },
  { key: "completed", label: "Completed" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  preparing: "bg-blue-100 text-blue-800 border-blue-200",
  ready: "bg-emerald-100 text-emerald-800 border-emerald-200",
  completed: "bg-gray-100 text-gray-800 border-gray-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-purple-100 text-purple-800 border-purple-200",
};

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({
    meta: [
      { title: `${i18n.t("common.orders")} · ${i18n.t("common.appName")}` },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const { shop } = useShop();
  const { t } = useTranslation();

  // Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<string>("kanban");

  // History Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<"today" | "yesterday" | "week" | "month" | "custom">("today");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  
  // Invoice Selection state
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    document.title = `${t("common.orders")} · ${t("common.appName")}`;
  }, [t]);

  // Load Real-time Orders
  useEffect(() => {
    if (!shop) return;
    const db = getDb();
    const q = query(
      collection(db, COL.orders),
      where("shopId", "==", shop.id),
      orderBy("createdAt", "desc"),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setOrders(
          snap.docs
            .map((d) => ({ id: d.id, ...(d.data() as Omit<Order, "id">) }))
            .filter((o) => o.status !== "Waiting")
        );
        setLoading(false);
      },
      (err) => {
        console.error("[orders] snapshot failed", err);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [shop]);

  // Handle Stage Advancement
  const advanceOrder = async (id: string, nextStatus: string) => {
    try {
      const order = orders.find((entry) => entry.id === id);
      await updateDoc(doc(getDb(), COL.orders, id), { status: nextStatus, updatedAt: new Date() });
      await notifyOrderStatusChange({ id, orderId: order?.orderId, customerName: order?.customerName, customerMobile: order?.customerMobile }, nextStatus, shop?.id);
      toast.success(`Order moved to ${nextStatus}`);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  // Date range filters logic
  const dateLimits = useMemo(() => {
    const now = new Date();
    return {
      today: startOfDay(now),
      yesterdayStart: startOfDay(subDays(now, 1)),
      yesterdayEnd: endOfDay(subDays(now, 1)),
      week: startOfDay(subDays(now, 7)),
      month: startOfDay(subDays(now, 30)),
    };
  }, []);

  // Filtered Orders for History table
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // 1. Search Query Filter
      const search = searchQuery.toLowerCase().trim();
      if (search) {
        const orderNumMatches = String(o.orderNumber).includes(search);
        const orderIdMatches = (o.orderId ?? "").toLowerCase().includes(search);
        const nameMatches = (o.customerName ?? "").toLowerCase().includes(search);
        const mobileMatches = (o.customerMobile ?? "").toLowerCase().includes(search);
        if (!orderNumMatches && !orderIdMatches && !nameMatches && !mobileMatches) {
          return false;
        }
      }

      // 2. Date Filter
      if (!o.createdAt) return false;
      const orderDate = new Date(o.createdAt.toMillis());

      if (dateRange === "today") {
        return orderDate >= dateLimits.today;
      } else if (dateRange === "yesterday") {
        return orderDate >= dateLimits.yesterdayStart && orderDate <= dateLimits.yesterdayEnd;
      } else if (dateRange === "week") {
        return orderDate >= dateLimits.week;
      } else if (dateRange === "month") {
        return orderDate >= dateLimits.month;
      } else if (dateRange === "custom") {
        if (customFrom) {
          const fromLimit = startOfDay(new Date(customFrom));
          if (isBefore(orderDate, fromLimit)) return false;
        }
        if (customTo) {
          const toLimit = endOfDay(new Date(customTo));
          if (isAfter(orderDate, toLimit)) return false;
        }
      }
      return true;
    });
  }, [orders, searchQuery, dateRange, customFrom, customTo, dateLimits]);

  // Selected Order Receipt object
  const selectedOrder = useMemo(() => {
    return orders.find((o) => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);

  // Receipt Printing Trigger
  const printReceipt = (o: Order) => {
    const sub = o.subtotal || o.total;
    const tax = o.tax || 0;
    const disc = o.discount || 0;
    const itemsConverted = o.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      taxRate: item.taxRate || 0,
      discount: item.discount || 0,
      preparationTime: 0,
      veg: item.veg || true,
      notes: item.notes || null,
      variant: item.variant || null,
    }));
    const paymentsConverted = o.payments || [{ method: o.paymentMethod as any, amount: o.total }];
    const text = buildReceiptText(
      o.orderNumber,
      o.customerName || "",
      itemsConverted,
      sub,
      tax,
      disc,
      o.total,
      paymentsConverted,
      shop?.currency ?? "INR",
      o.orderId
    );
    const receiptHtml = text.replace(
      `ORDER ID\n${o.orderId || o.id}`,
      `<section class="order-id"><div>ORDER ID</div><strong>${o.orderId || o.id}</strong></section>`,
    );

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt ${o.orderId || o.id}</title>
            <style>
              body {
                font-family: 'Courier New', Courier, monospace;
                padding: 20px;
                width: 280px;
                font-size: 13px;
                line-height: 1.4;
              }
              pre {
                white-space: pre-wrap;
              }
              .order-id { margin: 12px 0; padding: 10px; text-align: center; color: #000; background: #fff; border: 2px solid #000; font-weight: 900; }
              .order-id div { font-size: 14px; letter-spacing: 1px; }
              .order-id strong { display: block; font-size: 22px; letter-spacing: 1px; }
            </style>
          </head>
          <body>
            <pre>${receiptHtml}</pre>
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (!shop) return null;

  return (
    <div className="space-y-4">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 flex-shrink-0">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{t("common.orders")}</h1>
          <p className="text-sm text-muted-foreground">Manage active kitchen prep queues and view sales history details.</p>
        </div>
      </div>

      {/* Main Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 w-[340px]">
          <TabsTrigger value="kanban" className="font-semibold text-xs">Live Kanban Board</TabsTrigger>
          <TabsTrigger value="history" className="font-semibold text-xs">Order History & Search</TabsTrigger>
        </TabsList>

        {/* TAB 1: Live Kanban Board */}
        <TabsContent value="kanban" className="space-y-4 outline-none">
          {loading ? (
            <div className="text-sm text-muted-foreground py-8">Loading prep queues...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {KANBAN_COLUMNS.map((col) => {
                const colOrders = orders.filter((o) => o.status === col.key);
                return (
                  <div key={col.key} className="space-y-3 bg-muted/20 border rounded-xl p-3 flex flex-col min-h-[480px]">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                        {t("orders." + col.key)}
                      </h3>
                      <Badge variant="secondary" className="font-semibold text-[10px]">{colOrders.length}</Badge>
                    </div>
                    
                    <div className="space-y-2 flex-1 overflow-y-auto">
                      {colOrders.map((o) => (
                        <Card key={o.id} className="shadow-soft hover:shadow-md transition border-border/80 bg-background overflow-hidden">
                          <CardContent className="p-3 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm text-primary font-display">{o.orderId || o.id}</span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {o.createdAt
                                  ? new Date(o.createdAt.toMillis()).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : ""}
                              </span>
                            </div>
                            
                            <div className="border-t border-dashed pt-2 space-y-1">
                              <div className="text-xs font-bold truncate">{o.customerName ?? "Walk-in"}</div>
                              {o.customerMobile && (
                                <div className="text-[10px] text-muted-foreground">{o.customerMobile}</div>
                              )}
                            </div>

                            {/* Kanban list items with images */}
                            <div className="space-y-1">
                              {(o.items ?? []).map((item, idx) => (
                                <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1.5 min-w-0">
                                  {item.imageUrl ? (
                                    <img src={item.imageUrl} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
                                  ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                                  )}
                                  <span className="truncate flex-1">
                                    {item.quantity}x {item.name}
                                    {item.variant ? ` [${item.variant}]` : ""}
                                  </span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between pt-2 border-t border-dashed mt-1.5 flex-shrink-0">
                              <span className="text-xs font-bold text-gray-800">
                                {formatCurrency(o.total, shop.currency ?? "INR")}
                              </span>
                              {col.next && (
                                <Button 
                                  size="sm" 
                                  variant="default"
                                  onClick={() => advanceOrder(o.id, col.next!)}
                                  className="h-7 text-[10px] font-semibold px-2.5 rounded-lg"
                                >
                                  Mark {t("orders." + col.next)}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {!colOrders.length && (
                        <div className="text-center text-[10px] py-16 text-muted-foreground/70">
                          Queue empty
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* TAB 2: Order History & Search */}
        <TabsContent value="history" className="outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-4 min-h-[500px]">
            
            {/* Left Side: Filter bar + Orders Table */}
            <Card className="shadow-soft border-border/80 flex flex-col overflow-hidden">
              <CardHeader className="p-3 border-b flex-shrink-0 bg-background/50 space-y-3">
                <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
                  <div className="relative w-full md:w-[260px]">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search order #, customer..."
                      className="pl-8 h-9 text-xs"
                    />
                  </div>
                  
                  {/* Date preset selector buttons */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {[
                      { id: "today", label: "Today" },
                      { id: "yesterday", label: "Yesterday" },
                      { id: "week", label: "7 Days" },
                      { id: "month", label: "Month" },
                      { id: "custom", label: "Custom" },
                    ].map((btn) => (
                      <Button
                        key={btn.id}
                        size="sm"
                        variant={dateRange === btn.id ? "default" : "outline"}
                        onClick={() => setDateRange(btn.id as any)}
                        className="h-8 text-[11px] px-2.5 rounded-full"
                      >
                        {btn.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom date range fields */}
                {dateRange === "custom" && (
                  <div className="grid grid-cols-2 gap-3 pt-2 animate-fade-in border-t border-dashed border-border/50">
                    <div>
                      <Label className="text-[10px] text-muted-foreground font-semibold">From Date</Label>
                      <Input
                        type="date"
                        value={customFrom}
                        onChange={(e) => setCustomFrom(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground font-semibold">To Date</Label>
                      <Input
                        type="date"
                        value={customTo}
                        onChange={(e) => setCustomTo(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-0 overflow-auto flex-1 max-h-[460px]">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="w-[90px] text-xs font-bold">Order ID</TableHead>
                      <TableHead className="text-xs font-bold">Date & Time</TableHead>
                      <TableHead className="text-xs font-bold">Customer Info</TableHead>
                      <TableHead className="text-xs font-bold">Payment</TableHead>
                      <TableHead className="text-xs font-bold text-right">Total</TableHead>
                      <TableHead className="text-xs font-bold text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((o) => (
                      <TableRow 
                        key={o.id}
                        onClick={() => setSelectedOrderId(o.id)}
                        className={`cursor-pointer hover:bg-muted/40 transition select-none ${
                          selectedOrderId === o.id ? "bg-muted/70 font-semibold" : ""
                        }`}
                      >
                        <TableCell className="font-bold text-primary font-display text-xs">{o.orderId || o.id}</TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {o.createdAt ? format(new Date(o.createdAt.toMillis()), "dd MMM yyyy, hh:mm a") : "—"}
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="truncate font-semibold max-w-[120px]">{o.customerName || "Walk-in"}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{o.customerMobile || "—"}</div>
                        </TableCell>
                        <TableCell className="text-xs capitalize font-medium">{o.paymentMethod}</TableCell>
                        <TableCell className="text-xs font-bold text-right font-display">{formatCurrency(o.total, shop.currency ?? "INR")}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={`text-[9px] py-0 px-2 border font-bold capitalize shadow-none ${STATUS_COLORS[o.status] || "bg-gray-100"}`}>
                            {o.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!filteredOrders.length && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-16 text-xs text-muted-foreground">
                          No history records found matching criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Right Side: Selected Order Invoice Preview (Slip Style) */}
            <div className="space-y-4">
              {selectedOrder ? (
                <Card className="shadow-soft border-border/80 flex flex-col overflow-hidden animate-slide-up h-full">
                  <CardHeader className="p-4 border-b flex-shrink-0 bg-background/50 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                        <Receipt className="w-4 h-4 text-primary" /> Invoice Summary
                      </CardTitle>
                      <CardDescription className="text-[10px]">Order ID: {selectedOrder.id.slice(0,8)}...</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => printReceipt(selectedOrder)}
                      className="h-8 text-xs font-semibold px-2.5 rounded-lg border-border"
                    >
                      <Printer className="w-3.5 h-3.5 mr-1" /> Print Slip
                    </Button>
                  </CardHeader>
                  
                  <CardContent className="p-4 overflow-y-auto space-y-4 flex-1">
                    {/* Customer and Date Block */}
                    <div className="space-y-2 text-xs border-b border-dashed pb-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Date & Time</span>
                        <span className="font-medium">{selectedOrder.createdAt ? format(new Date(selectedOrder.createdAt.toMillis()), "dd MMM yyyy, hh:mm a") : "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1"><User className="w-3.5 h-3.5" /> Customer</span>
                        <span className="font-semibold">{selectedOrder.customerName || "Walk-in Customer"}</span>
                      </div>
                      {selectedOrder.customerMobile && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> Mobile</span>
                          <span className="font-medium">{selectedOrder.customerMobile}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1"><Filter className="w-3.5 h-3.5" /> Payment</span>
                        <span className="font-bold uppercase text-primary">{selectedOrder.paymentMethod}</span>
                      </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="space-y-2">
                      <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Ordered Items</div>
                      <div className="space-y-1.5">
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start text-xs border-b border-border/40 pb-1.5">
                            <div className="min-w-0">
                              <div className="font-medium truncate">{item.name}</div>
                              {item.variant && (
                                <Badge variant="secondary" className="text-[9px] py-0 px-1 mt-0.5">{item.variant}</Badge>
                              )}
                              {item.notes && (
                                <div className="text-[10px] text-amber-600 font-medium italic mt-0.5">Note: {item.notes}</div>
                              )}
                            </div>
                            <div className="text-right whitespace-nowrap">
                              <div className="font-semibold">{item.quantity}x {formatCurrency(item.price, shop.currency ?? "INR")}</div>
                              <div className="text-[10px] text-muted-foreground">{formatCurrency(item.price * item.quantity, shop.currency ?? "INR")}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Totals Breakdown */}
                    <div className="space-y-1.5 text-xs pt-3 border-t border-dashed border-border/80">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(selectedOrder.subtotal || selectedOrder.total, shop.currency ?? "INR")}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>GST Tax:</span>
                        <span>{formatCurrency(selectedOrder.tax || 0, shop.currency ?? "INR")}</span>
                      </div>
                      {selectedOrder.discount && selectedOrder.discount > 0 ? (
                        <div className="flex justify-between text-red-600">
                          <span>Discount:</span>
                          <span>-{formatCurrency(selectedOrder.discount, shop.currency ?? "INR")}</span>
                        </div>
                      ) : null}
                      <div className="flex justify-between font-bold text-sm border-t border-dashed pt-2 mt-2">
                        <span>Grand Total:</span>
                        <span className="text-primary font-display">{formatCurrency(selectedOrder.total, shop.currency ?? "INR")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-soft border-border/80 flex flex-col justify-center items-center p-12 text-center text-muted-foreground h-full min-h-[300px]">
                  <Receipt className="w-8 h-8 text-border mb-2" />
                  <p className="text-xs">No invoice selected.</p>
                  <p className="text-[10px] mt-1 text-muted-foreground/80">Click any row in the order history list on the left to review billing details.</p>
                </Card>
              )}
            </div>

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
