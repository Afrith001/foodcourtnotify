import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { memo, useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { getDb, COL } from "@/lib/firebase";
import { useShop } from "@/hooks/useShop";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatCurrency, buildReceiptText, type CartItem, type PaymentSplit } from "@/lib/pos";
import { generateUniqueOrderId, notifyOrderStatusChange } from "@/lib/order-utils";
import { optimizedImageUrl } from "@/lib/images";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  CreditCard,
  Wallet,
  Smartphone,
  Tag,
  User,
  ScanLine,
  FileText,
  Navigation,
  ChevronDown,
  Percent,
  Users as UsersIcon,
  QrCode,
  Calendar,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/billing")({
  component: BillingPage,
});

type Product = {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  taxRate: number;
  discount: number;
  stock: number;
  lowStockThreshold: number;
  categoryId?: string | null;
  preparationTime: number;
  veg: boolean;
  available: boolean;
  imageUrl?: string | null;
  sku?: string | null;
  barcode?: string | null;
};

type Category = {
  id: string;
  name: string;
};

const dummyProducts: Product[] = [];

function optimizedProductImage(url?: string | null) {
  if (!url) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=75&w=480";
  return optimizedImageUrl(url, 480, 240);
}

const MobileProductCard = memo(function MobileProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) {
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock <= product.lowStockThreshold;
  return (
    <article className="mobile-product-card rounded-3xl border border-slate-100 bg-white p-3 shadow-sm">
      <img src={optimizedProductImage(product.imageUrl)} alt={product.name} loading="lazy" decoding="async" width="480" height="240" className="h-36 w-full rounded-2xl object-cover bg-slate-100" />
      <div className="mt-3 space-y-2">
        <h2 className="text-sm font-bold leading-5 text-slate-900">{product.name}</h2>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${product.veg ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{product.veg ? "Veg" : "Non-Veg"}</span>
          <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${outOfStock ? "bg-rose-50 text-rose-700" : lowStock ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{outOfStock ? "Out of stock" : `${product.stock} in stock`}</span>
        </div>
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-base font-extrabold text-slate-900">₹{product.price}</span>
          <button type="button" disabled={outOfStock} onClick={() => onAdd(product)} className="min-h-12 rounded-2xl bg-orange-500 px-5 text-sm font-bold text-white transition-transform active:scale-95 disabled:bg-slate-200">Add</button>
        </div>
      </div>
    </article>
  );
});

function MobileBilling({
  shop, products, categories, search, setSearch, selectedCategoryId, setSelectedCategoryId, addToCart,
  cart, changeQuantity, updateCartItemField, removeItem, subtotal, tax, discountValue, setDiscountValue,
  total, paymentMethod, setPaymentMethod, cashAmount, setCashAmount, upiAmount, setUpiAmount, cardAmount,
  setCardAmount, splitSumMatches, saving, onCheckout,
}: any) {
  const [cartOpen, setCartOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const currency = shop?.currency ?? "INR";
  return <section className="touch-manipulation pb-28 md:hidden">
    <header className="sticky top-0 z-20 -mx-3 mb-4 border-b border-slate-100 bg-white/95 px-3 pb-3 pt-2 backdrop-blur">
      <div className="mb-3 flex min-h-12 items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-500 text-lg font-black text-white">{shop?.name?.slice(0, 1) ?? "N"}</div>
        <div className="min-w-0"><p className="text-xs font-medium text-slate-400">Point of sale</p><h1 className="truncate text-base font-extrabold text-slate-900">{shop?.name}</h1></div>
      </div>
      <label className="relative block"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-base outline-none focus:border-orange-400 focus:bg-white" /></label>
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
        <button type="button" onClick={() => setSelectedCategoryId(null)} className={`min-h-12 shrink-0 rounded-full px-4 text-sm font-bold ${selectedCategoryId === null ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700"}`}>All</button>
        {categories.map((category: Category) => <button type="button" key={category.id} onClick={() => setSelectedCategoryId(category.id)} className={`min-h-12 shrink-0 rounded-full px-4 text-sm font-bold ${selectedCategoryId === category.id ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700"}`}>{category.name}</button>)}
      </div>
    </header>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{products.map((product: Product) => <MobileProductCard key={product.id} product={product} onAdd={addToCart} />)}</div>
    {!products.length && <div className="rounded-3xl bg-slate-100 p-8 text-center text-sm text-slate-500">No products match this filter.</div>}
    <button type="button" onClick={() => setCartOpen(true)} className="fixed bottom-5 right-4 z-30 flex min-h-14 items-center gap-3 rounded-2xl bg-slate-900 px-5 text-left text-white shadow-xl shadow-slate-900/25 active:scale-95"><ShoppingBag className="h-5 w-5" /><span><b className="block text-sm">Cart ({cart.reduce((count: number, item: CartItem) => count + item.quantity, 0)})</b><span className="text-xs text-slate-300">{formatCurrency(total, currency)}</span></span></button>
    {cartOpen && <div className="fixed inset-0 z-50 bg-slate-950/35" onClick={() => setCartOpen(false)}><section className="absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-[32px] bg-white p-5 pb-8" onClick={(event) => event.stopPropagation()}>
      <div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-orange-600">Current order</p><h2 className="text-xl font-extrabold text-slate-900">Your cart</h2></div><button type="button" aria-label="Close cart" onClick={() => setCartOpen(false)} className="grid h-12 w-12 min-h-12 min-w-12 place-items-center rounded-2xl bg-slate-100"><X /></button></div>
      <div className="space-y-3">{cart.map((item: CartItem, index: number) => <div key={`${item.id}-${index}`} className="rounded-2xl border border-slate-100 p-3"><div className="flex gap-3"><img src={optimizedProductImage(item.imageUrl)} alt="" loading="lazy" className="h-16 w-16 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="font-bold text-slate-900">{item.name}</p><p className="text-sm text-slate-500">{formatCurrency(item.price, currency)}</p><div className="mt-2 flex items-center gap-2"><button onClick={() => changeQuantity(index, -1)} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100"><Minus className="h-4 w-4" /></button><b className="w-6 text-center">{item.quantity}</b><button onClick={() => changeQuantity(index, 1)} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100"><Plus className="h-4 w-4" /></button><button onClick={() => removeItem(index)} className="ml-auto grid h-10 w-10 place-items-center text-rose-600"><Trash2 className="h-4 w-4" /></button></div></div></div><input value={item.notes ?? ""} onChange={(event) => updateCartItemField(index, "notes", event.target.value)} placeholder="Add a note" className="mt-3 h-11 w-full rounded-xl bg-slate-50 px-3 text-sm outline-none" /></div>)}</div>
      <div className="mt-5 space-y-3 rounded-3xl bg-slate-50 p-4"><label className="flex items-center justify-between text-sm font-bold text-slate-700">Discount <input type="number" value={discountValue} onChange={(event) => setDiscountValue(event.target.value)} className="h-11 w-28 rounded-xl bg-white px-3 text-right outline-none" /></label><div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>{formatCurrency(subtotal, currency)}</span></div><div className="flex justify-between text-sm text-slate-600"><span>GST</span><span>{formatCurrency(tax, currency)}</span></div><div className="flex justify-between border-t pt-3 text-lg font-extrabold text-slate-900"><span>Grand total</span><span>{formatCurrency(total, currency)}</span></div></div>
      <button disabled={!cart.length} onClick={() => { setCartOpen(false); setPaymentOpen(true); }} className="mt-5 min-h-14 w-full rounded-2xl bg-orange-500 text-base font-extrabold text-white disabled:bg-slate-200">Continue to payment</button>
    </section></div>}
    {paymentOpen && <section className="fixed inset-0 z-[60] overflow-y-auto bg-white p-5"><header className="flex min-h-12 items-center justify-between"><button onClick={() => setPaymentOpen(false)} className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100"><X /></button><h2 className="text-lg font-extrabold">Payment</h2><span className="w-12" /></header><div className="mt-8"><p className="text-sm font-bold text-slate-500">Grand total</p><p className="text-4xl font-black text-slate-900">{formatCurrency(total, currency)}</p></div><div className="mt-8 grid grid-cols-2 gap-3">{(["cash", "upi", "card", "split"] as const).map((method) => <button key={method} onClick={() => setPaymentMethod(method)} className={`min-h-24 rounded-3xl border text-base font-extrabold capitalize ${paymentMethod === method ? "border-orange-500 bg-orange-50 text-orange-700" : "border-slate-200 text-slate-700"}`}>{method}</button>)}</div>{paymentMethod === "split" && <div className="mt-5 grid grid-cols-3 gap-2"><input type="number" value={cashAmount} onChange={(event) => setCashAmount(event.target.value)} placeholder="Cash" className="h-12 rounded-xl bg-slate-100 px-2" /><input type="number" value={upiAmount} onChange={(event) => setUpiAmount(event.target.value)} placeholder="UPI" className="h-12 rounded-xl bg-slate-100 px-2" /><input type="number" value={cardAmount} onChange={(event) => setCardAmount(event.target.value)} placeholder="Card" className="h-12 rounded-xl bg-slate-100 px-2" /></div>}<button disabled={saving || !splitSumMatches} onClick={onCheckout} className="fixed bottom-5 left-5 right-5 min-h-14 rounded-2xl bg-orange-500 text-base font-extrabold text-white disabled:bg-slate-200">{saving ? "Saving…" : "Checkout & print bill"}</button></section>}
  </section>;
}

function BillingPage() {
  const { shop } = useShop();
  const navigate = useNavigate();

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filter & Search State
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Checkout & Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "card" | "split">("cash");

  // Split Payment Inputs
  const [cashAmount, setCashAmount] = useState<string>("0");
  const [upiAmount, setUpiAmount] = useState<string>("0");
  const [cardAmount, setCardAmount] = useState<string>("0");

  // Discount States
  const [discountValue, setDiscountValue] = useState<string>("0");
  const [tableNumber, setTableNumber] = useState("");
  const [orderType, setOrderType] = useState("Dine-In");

  const [saving, setSaving] = useState(false);
  const [showNotes, setShowNotes] = useState<{ [key: number]: boolean }>({});

  const [customerMobile, setCustomerMobile] = useState<string>("");

  // Load Products & Categories
  useEffect(() => {
    if (!shop) return;
    const db = getDb();

    // Load products
    const productsQ = query(collection(db, COL.products), where("shopId", "==", shop.id));
    const unsubProducts = onSnapshot(productsQ, (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, "id">) })));
    });

    // Load categories
    const categoriesQ = query(collection(db, COL.categories), where("shopId", "==", shop.id));
    const unsubCategories = onSnapshot(categoriesQ, (snap) => {
      setCategories(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Category, "id">) })));
    });

    return () => {
      unsubProducts();
      unsubCategories();
    };
  }, [shop]);

  // Filter Products
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => p.available !== false);

    if (selectedCategoryId) {
      list = list.filter((p) => p.categoryId === selectedCategoryId);
    }

    const term = deferredSearch.toLowerCase().trim();
    if (term) {
      list = list.filter((p) =>
        [p.name, p.sku, p.barcode]
          .filter(Boolean)
          .some((val) => (val ?? "").toLowerCase().includes(term))
      );
    }
    return list;
  }, [products, deferredSearch, selectedCategoryId]);

  const displayedProducts = useMemo(() => filteredProducts, [filteredProducts]);

  const displayedCategories = useMemo(() => categories, [categories]);

  // Cart Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = cart.reduce((sum, item) => sum + (item.price * item.quantity * (item.taxRate ?? 0)) / 100, 0);
  const cgst = tax / 2;
  const sgst = tax / 2;

  const calculatedDiscount = useMemo(() => {
    const val = Number(discountValue) || 0;
    return val; // Flat discount
  }, [discountValue]);

  const total = Math.max(0, subtotal + tax - calculatedDiscount);

  // Auto-allocate Split payments when total changes or payment method changes
  useEffect(() => {
    if (paymentMethod !== "split") {
      setCashAmount("0");
      setUpiAmount("0");
      setCardAmount("0");
    }
  }, [paymentMethod, total]);

  // Cart Handlers
  const addToCart = useCallback((product: Product) => {
    if (!product.available) {
      toast.error("Product is unavailable");
      return;
    }
    setCart((current) => {
      const existingIndex = current.findIndex(
        (item) => item.id === product.id && item.variant === "Regular" && !item.notes
      );
      if (existingIndex > -1) {
        const updated = [...current];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          taxRate: product.taxRate ?? 0,
          discount: product.discount ?? 0,
          preparationTime: product.preparationTime ?? 0,
          veg: product.veg ?? true,
          imageUrl: product.imageUrl ?? null,
          variant: "Regular",
          notes: "",
        },
      ];
    });
  }, []);

  const changeQuantity = useCallback((index: number, delta: number) => {
    setCart((current) =>
      current.flatMap((item, idx) => {
        if (idx !== index) return [item];
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? [{ ...item, quantity: nextQty }] : [];
      })
    );
  }, []);

  const updateCartItemField = useCallback((index: number, field: "variant" | "notes", value: string) => {
    setCart((current) =>
      current.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  }, []);

  const removeItem = useCallback((index: number) => {
    setCart((current) => current.filter((_, idx) => idx !== index));
  }, []);

  const toggleNotesInput = (index: number) => {
    setShowNotes((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Generate Receipt Payload
  const finalPayments = useMemo<PaymentSplit[]>(() => {
    if (paymentMethod === "split") {
      const cash = Number(cashAmount) || 0;
      const upi = Number(upiAmount) || 0;
      const card = Number(cardAmount) || 0;
      const splits: PaymentSplit[] = [];
      if (cash > 0) splits.push({ method: "cash", amount: cash });
      if (upi > 0) splits.push({ method: "upi", amount: upi });
      if (card > 0) splits.push({ method: "card", amount: card });
      return splits;
    }
    return [{ method: paymentMethod as PaymentSplit["method"], amount: total }];
  }, [paymentMethod, total, cashAmount, upiAmount, cardAmount]);

  const splitSumMatches = useMemo(() => {
    if (paymentMethod !== "split") return true;
    const sum = (Number(cashAmount) || 0) + (Number(upiAmount) || 0) + (Number(cardAmount) || 0);
    return Math.abs(sum - total) < 0.1;
  }, [paymentMethod, total, cashAmount, upiAmount, cardAmount]);

  // POS Checkout Submit
  const handleCheckout = async () => {
    if (!shop) return;
    if (!cart.length) {
      toast.error("Cart is empty.");
      return;
    }
    if (paymentMethod === "split" && !splitSumMatches) {
      const sum = (Number(cashAmount) || 0) + (Number(upiAmount) || 0) + (Number(cardAmount) || 0);
      toast.error(`Split payments sum (₹${sum}) does not match grand total (₹${total})`);
      return;
    }
    setSaving(true);
    try {
      const db = getDb();
      const todayStr = new Date().toLocaleDateString("en-CA");
      const counterRef = doc(db, COL.shopCounters, shop.id);

      const nextCounter = await runTransaction(db, async (tx) => {
        const c = await tx.get(counterRef);
        let current = 0;
        let lastDate = "";
        if (c.exists()) {
          const data = c.data();
          current = data.orderNumber || 0;
          lastDate = data.date || "";
        }
        const next = lastDate === todayStr ? current + 1 : 1;
        tx.set(counterRef, { orderNumber: next, date: todayStr }, { merge: true });
        return next;
      });

      // The public order/document ID is generated at checkout and checked in
      // Firestore so it is never sequential or predictable.
      const checkoutOrderId = await generateUniqueOrderId(db);
      const orderRef = doc(db, COL.orders, checkoutOrderId);

      const orderPayload: any = {
        shopId: shop.id,
        shopCode: shop.shopCode,
        orderNumber: nextCounter,
        orderId: checkoutOrderId,
        status: "pending",
        total,
        subtotal,
        tax,
        discount: calculatedDiscount,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          taxRate: item.taxRate,
          discount: item.discount,
          preparationTime: item.preparationTime,
          veg: item.veg,
          imageUrl: item.imageUrl || null,
          notes: item.notes || null,
          variant: item.variant || null,
        })),
        tableNumber: tableNumber.trim() || null,
        orderType: orderType || "Dine-In",
        paymentMethod: paymentMethod === "split" ? "split" : paymentMethod,
        payments: finalPayments,
        paymentStatus: "Paid",
        updatedAt: serverTimestamp(),
        checkoutTime: serverTimestamp(),
        completedAt: null,
        archivedAt: null,
        isPlaceholder: false,
      };

      orderPayload.customerName = customerName.trim() || "Walk-in";
      orderPayload.customerMobile = customerMobile.trim() || null;
      orderPayload.createdAt = serverTimestamp();
      await setDoc(orderRef, orderPayload);

      await notifyOrderStatusChange(
        { id: orderRef.id, orderId: checkoutOrderId, customerName: customerName || "Walk-in" },
        "pending",
        shop.id
      );
      triggerReceiptPrint(nextCounter, checkoutOrderId);

      // Save/upsert customer CRM on checkout if mobile is captured
      const finalMobile = customerMobile.trim() || null;
      if (finalMobile) {
        const finalName = customerName.trim() || "Customer";
        const customerId = `${shop.id}_${finalMobile}`;
        const customerRef = doc(db, COL.customers, customerId);
        await runTransaction(db, async (tx) => {
          const c = await tx.get(customerRef);
          if (c.exists()) {
            const prev = c.data() as { totalOrders: number; totalSpending: number; loyaltyPoints: number };
            tx.update(customerRef, {
              totalOrders: (prev.totalOrders ?? 0) + 1,
              totalSpending: (prev.totalSpending ?? 0) + total,
              loyaltyPoints: (prev.loyaltyPoints ?? 0) + Math.max(1, Math.floor(total / 100)),
              lastVisit: serverTimestamp(),
            });
          } else {
            tx.set(customerRef, {
              shopId: shop.id,
              mobile: finalMobile,
              name: finalName || "Customer",
              totalOrders: 1,
              totalSpending: total,
              loyaltyPoints: Math.max(1, Math.floor(total / 100)),
              createdAt: serverTimestamp(),
              lastVisit: serverTimestamp(),
            });
          }
        });
      }

      setCart([]);
      setCustomerName("");
      setCustomerMobile("");
      setTableNumber("");
      setOrderType("Dine-In");
      setDiscountValue("0");
      setPaymentMethod("cash");
      navigate({ to: "/orders" });
      toast.success(`Order ${checkoutOrderId} saved successfully`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const triggerReceiptPrint = (oNumber: number, orderIdText: string) => {
    const text = buildReceiptText(
      oNumber,
      customerName || "Walk-in",
      cart,
      subtotal,
      tax,
      calculatedDiscount,
      total,
      finalPayments,
      shop?.currency ?? "INR",
      orderIdText
    );
    const receiptHtml = text.replace(
      `ORDER ID\n${orderIdText}`,
      `<section class="order-id"><div>ORDER ID</div><strong>${orderIdText}</strong></section>`,
    );

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt #${oNumber}</title>
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

  const paymentButtons = [
    { id: "cash", label: "Cash", icon: Wallet, method: "cash" },
    { id: "upi", label: "UPI", icon: Smartphone, method: "upi" },
    { id: "card", label: "Card", icon: CreditCard, method: "card" },
    { id: "split", label: "Split", icon: Tag, method: "split" },
    { id: "card_swap", label: "Card", icon: ScanLine, method: "card" },
    { id: "split_people", label: "Split", icon: UsersIcon, method: "split" },
    { id: "split_percent", label: "Split", icon: Percent, method: "split" },
    { id: "qr", label: "QR", icon: QrCode, method: "upi" },
  ];

  if (!shop) return null;

  return (
    <>
      <MobileBilling
        shop={shop} products={displayedProducts} categories={displayedCategories} search={search} setSearch={setSearch}
        selectedCategoryId={selectedCategoryId} setSelectedCategoryId={setSelectedCategoryId} addToCart={addToCart}
        cart={cart} changeQuantity={changeQuantity} updateCartItemField={updateCartItemField} removeItem={removeItem}
        subtotal={subtotal} tax={tax} discountValue={discountValue} setDiscountValue={setDiscountValue} total={total}
        paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} cashAmount={cashAmount} setCashAmount={setCashAmount}
        upiAmount={upiAmount} setUpiAmount={setUpiAmount} cardAmount={cardAmount} setCardAmount={setCardAmount}
        splitSumMatches={splitSumMatches} saving={saving} onCheckout={handleCheckout}
      />
    <div className="hidden md:flex flex-col gap-5 h-[calc(100vh-120px)] overflow-hidden text-[#4a0f0f] select-none">
      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_370px] xl:grid-cols-[1fr_370px_320px] gap-5 flex-1 min-h-0 overflow-hidden">
        
        {/* LEFT COLUMN: Search, Categories, Dishes Grid */}
        <div className="flex flex-col gap-4 min-h-0">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Bar"
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 shadow-sm transition-colors text-slate-700 font-medium"
            />
          </div>

          {/* Categories Horizontal List */}
          <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-200">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border shrink-0 ${
                selectedCategoryId === null
                  ? "bg-[#FFF0E6] border-[#FFE0D3] text-[#FF7A00]"
                  : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
              }`}
            >
              All
            </button>
            {displayedCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border shrink-0 ${
                  selectedCategoryId === cat.id
                    ? "bg-[#FFF0E6] border-[#FFE0D3] text-[#FF7A00]"
                    : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Catalog Food Cards Grid */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 pb-4">
              {displayedProducts.length === 0 ? (
                <div className="col-span-full rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center text-sm text-slate-500">
                  No products are available for the selected filter.
                </div>
              ) : (
                displayedProducts.map((p) => {
                  const lowStock = p.stock <= p.lowStockThreshold;
                  const outOfStock = p.stock <= 0;
                  return (
                    <div
                      key={p.id}
                      className={`flex flex-col justify-between overflow-hidden rounded-[24px] border border-slate-100 bg-white text-left shadow-sm transition-all duration-200 ${
                        outOfStock
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:-translate-y-0.5 hover:shadow-md"
                      }`}
                    >
                    {/* Food Image */}
                    <div className="relative h-36 w-full bg-gradient-to-br from-orange-50 to-white overflow-hidden shrink-0">
                      <img
                        src={
                          p.imageUrl ||
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300"
                        }
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    {/* Food Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        {/* Title & Veg Pill */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-[14px] text-slate-800 line-clamp-2 leading-tight min-h-[40px] block">
                            {p.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 leading-none mt-0.5 ${
                              p.veg
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}
                          >
                            {p.veg ? "Veg" : "Non-Veg"}
                          </span>
                        </div>

                        {/* Price & Stock info */}
                        <div className="flex items-baseline justify-between mt-2.5">
                          <span className="text-[14px] font-extrabold text-slate-800">
                            {formatCurrency(p.price, shop.currency ?? "INR")}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-50 text-slate-600 border border-slate-100">
                            {outOfStock ? "Out of Stock" : "Stock"}
                          </span>
                        </div>
                      </div>

                      {/* Add Button */}
                      <button
                        onClick={() => !outOfStock && addToCart(p)}
                        disabled={outOfStock}
                        className="w-full mt-1.5 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#E06B00] active:scale-[0.98] text-xs font-bold text-white shadow-sm transition-all text-center focus:outline-none"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                );
              })
              )}
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Live Order ID, Customer Details, Cart */}
        <div className="flex flex-col gap-4 min-h-0 bistro-panel rounded-[28px] p-5">
          {/* Live Order ID Box */}
          <div className="bg-[#efe0c6] border border-[#d8b46b]/60 rounded-2xl p-4 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-orange-700/80 uppercase tracking-widest leading-none">
                Secure Order ID
              </span>
              <span className="text-xl font-extrabold text-slate-800 mt-1.5 tracking-tight">
                Assigned securely at checkout
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#fffaf3] flex items-center justify-center text-[#6b1d1d] shadow-sm shrink-0">
              <Navigation className="w-4.5 h-4.5 -rotate-45 fill-orange-600" />
            </div>
          </div>



          {/* Cart Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 shrink-0">
            <div className="flex items-baseline gap-2">
              <span className="text-[13px] font-bold text-slate-800">Cart</span>
              <span className="text-[11px] font-bold text-slate-400">({cart.length} items)</span>
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-[10px] font-bold text-rose-500 hover:text-rose-600 focus:outline-none px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Cart Scrollable List */}
          <div className="flex-1 overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-slate-400 py-10">
                <ShoppingBag className="w-10 h-10 text-orange-200 mb-2" />
                <span className="text-xs font-bold text-slate-500">Your cart is empty</span>
                <span className="text-[10px] text-slate-400 mt-1">Add items from the menu catalog</span>
              </div>
            ) : (
              <div className="space-y-3.5">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0"
                  >
                    {/* Item Image */}
                    <img
                      src={
                        item.imageUrl ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100"
                      }
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                    />

                    {/* Item details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                        {item.name}
                      </h4>
                      <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                        {formatCurrency(item.price, shop.currency ?? "INR")}
                      </div>
                      <button
                        onClick={() => toggleNotesInput(idx)}
                        className="inline-flex items-center gap-1 text-[9px] font-semibold text-slate-400 hover:text-slate-600 mt-1.5 focus:outline-none"
                      >
                        <FileText className="w-3 h-3 text-slate-400" /> Notes
                      </button>
                      {showNotes[idx] && (
                        <input
                          value={item.notes || ""}
                          onChange={(e) => updateCartItemField(idx, "notes", e.target.value)}
                          placeholder="Add instructions"
                          className="w-full mt-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] focus:outline-none"
                        />
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-lg p-0.5">
                        <button
                          onClick={() => changeQuantity(idx, -1)}
                          className="w-5.5 h-5.5 rounded-md bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-500 hover:bg-slate-100 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-slate-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => changeQuantity(idx, 1)}
                          className="w-5.5 h-5.5 rounded-md bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-500 hover:bg-slate-100 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors focus:outline-none shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Notes input at bottom */}
          <div className="shrink-0 mt-2">
            <textarea
              placeholder="Notes"
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-700 resize-none"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Checkout Panel, Payment Methods, Order Summary */}
        <div className="flex flex-col gap-4 min-h-0 bistro-panel rounded-[28px] p-5 overflow-y-auto scrollbar-thin">
          {/* Checkout Panel Box with Trendline */}
          <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Checkout Panel
              </span>
            </div>

            {/* Sales Trendline SVG */}
            <div className="h-10 w-full mt-2 relative select-none">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,35 C20,35 30,12 50,22 C70,32 80,8 100,5"
                  fill="url(#chartGrad)"
                />
                <path
                  d="M0,35 C20,35 30,12 50,22 C70,32 80,8 100,5"
                  fill="none"
                  stroke="#FF7A00"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="5" r="2.5" fill="#FF7A00" stroke="#FFF" strokeWidth="1" />
              </svg>
            </div>

            <div className="space-y-3.5 mt-3">
              {/* Table Number */}
              <div>
                <Label className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  Table Number
                </Label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Table 12"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-700 font-semibold"
                  />
                </div>
              </div>

              {/* Order Type */}
              <div>
                <Label className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  Order Type
                </Label>
                <div className="relative mt-1">
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-700 font-semibold appearance-none cursor-pointer"
                  >
                    <option value="Dine-In">Dine-In</option>
                    <option value="Takeaway">Takeaway</option>
                    <option value="Delivery">Delivery</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-3">
              Payment Methods
            </div>
            {/* 8-Grid Button Selector */}
            <div className="grid grid-cols-4 gap-2">
              {paymentButtons.map((btn) => {
                const Icon = btn.icon;
                const active = paymentMethod === btn.method;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setPaymentMethod(btn.method as any)}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all duration-200 aspect-square shrink-0 ${
                      active
                        ? "bg-[#FFF0E6] border-[#FFE0D3] text-[#FF7A00]"
                        : "bg-white border-slate-100 text-slate-500 hover:bg-slate-100/50"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1 ${active ? "text-[#FF7A00]" : "text-slate-500"}`} />
                    <span className="text-[8px] font-bold tracking-tight">{btn.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Split Details Input */}
            {paymentMethod === "split" && (
              <div className="mt-3.5 space-y-2 rounded-xl bg-orange-50/50 border border-orange-100/80 p-3">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-orange-700">
                  <span>Split Payment Amounts</span>
                  {!splitSumMatches && <span className="text-rose-500 font-bold">Mismatch</span>}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-[8px] text-slate-400 font-bold uppercase">Cash</Label>
                    <Input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      className="h-8 rounded-lg border-slate-200 bg-white text-xs text-slate-700"
                    />
                  </div>
                  <div>
                    <Label className="text-[8px] text-slate-400 font-bold uppercase">UPI</Label>
                    <Input
                      type="number"
                      value={upiAmount}
                      onChange={(e) => setUpiAmount(e.target.value)}
                      className="h-8 rounded-lg border-slate-200 bg-white text-xs text-slate-700"
                    />
                  </div>
                  <div>
                    <Label className="text-[8px] text-slate-400 font-bold uppercase">Card</Label>
                    <Input
                      type="number"
                      value={cardAmount}
                      onChange={(e) => setCardAmount(e.target.value)}
                      className="h-8 rounded-lg border-slate-200 bg-white text-xs text-slate-700"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 space-y-2 mt-auto">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-3">
              Order Summary
            </div>
            <div className="flex justify-between text-xs font-semibold text-slate-500">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal, shop.currency ?? "INR")}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-slate-500">
              <span>GST</span>
              <span>{formatCurrency(tax, shop.currency ?? "INR")}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-slate-500 pl-3 border-l border-slate-200">
              <span>CGST 2.5%</span>
              <span>{formatCurrency(cgst, shop.currency ?? "INR")}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-slate-500 pl-3 border-l border-slate-200">
              <span>SGST 2.5%</span>
              <span>{formatCurrency(sgst, shop.currency ?? "INR")}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-slate-500 border-t border-slate-100 pt-2">
              <span>Discount</span>
              <span>-</span>
            </div>
            <div className="flex justify-between items-baseline border-t border-slate-100 pt-2.5 mt-1.5">
              <span className="text-sm font-bold text-slate-700">Grand Total</span>
              <span className="text-base font-extrabold text-[#FF7A00]">
                {formatCurrency(total, shop.currency ?? "INR")}
              </span>
            </div>
          </div>

          {/* Checkout Submit Button */}
          <button
            onClick={handleCheckout}
            disabled={saving || !cart.length || (paymentMethod === "split" && !splitSumMatches)}
            className="w-full py-3.5 rounded-2xl bg-primary hover:bg-[#5b1717] disabled:bg-slate-200 active:scale-[0.99] disabled:scale-100 text-sm font-bold text-primary-foreground shadow-md shadow-[#4a0f0f]/15 hover:shadow-lg transition-all focus:outline-none shrink-0"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
