import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  orderBy,
} from "firebase/firestore";
import { getDb, COL } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ChefHat,
  Phone,
  MapPin,
  Smartphone,
  Send,
  ShieldCheck,
  ShoppingBag,
  Clock,
  XCircle,
  Hash,
  CreditCard,
  User,
  Star,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Globe,
  Mail,
  ImageIcon,
  Quote,
  BookOpen,
  Target,
  Eye,
  Trophy,
  Award,
  HelpCircle,
  Megaphone,
  Pin,
  Check,
  Sparkles,
  Twitter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Utensils,
  Heart,
  Share2,
  ExternalLink,
  Play,
  Pause,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/pos";
import { findOrderByPublicId, normalizeMobile, normalizeOrderId } from "@/lib/order-utils";
import { optimizedImageUrl } from "@/lib/images";
import { PremiumGallery } from "@/components/PremiumGallery";

export const Route = createFileRoute("/order/$shopCode")({
  ssr: false,
  component: CustomerPortal,
});

type Shop = {
  id: string;
  shopCode: string;
  name: string;
  category: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  themeColor: string;
  address: string | null;
  phone: string | null;
  currency?: string;
};

type ActiveOrder = {
  id: string;
  orderId?: string;
  orderNumber: number;
  status: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
    veg?: boolean;
    preparationTime?: number;
  }>;
  total?: number;
  paymentMethod?: string;
  createdAt?: Timestamp | Date | string | null;
};

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type FirestoreRecord = Record<string, unknown>;

type OrderSnapshotData = {
  customerMobile?: string | null;
  customerName?: string | null;
  total?: number;
  orderId?: string;
  orderNumber?: number;
  status?: string;
  items?: ActiveOrder["items"];
  paymentMethod?: string;
  createdAt?: ActiveOrder["createdAt"];
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

type TrackingFormProps = {
  orderIdInput: string;
  setOrderIdInput: (value: string) => void;
  mobile: string;
  setMobile: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  handleTrackOrder: (event: React.FormEvent) => void;
  busy: boolean;
  trackingError: string | null;
  tone: string;
};

type TrackingLiveProps = {
  order: ActiveOrder | null;
  tone: string;
  shop: Shop | null;
  progressPercent: number;
  estimatedMinutes: number;
  onTrackAnother: () => void;
};

// ─── Utility: Intersection Observer for scroll animations ────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, inView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Utility: Image lazy load with blur placeholder ──────────────────
function LazyImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && <div className="absolute inset-0 bg-slate-100 animate-pulse" />}
      <img
        src={optimizedImageUrl(src, 1200)}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

// ─── Utility: Star rating component ──────────────────────────────────
function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const s = size === "md" ? "w-4 h-4" : "w-3 h-3";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${s} ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

// ─── Utility: Section heading ────────────────────────────────────────
function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: IconComponent;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-200">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function TrackingForm({
  orderIdInput,
  setOrderIdInput,
  mobile,
  setMobile,
  name,
  setName,
  handleTrackOrder,
  busy,
  trackingError,
  tone,
}: TrackingFormProps) {
  return (
    <form className="space-y-4" onSubmit={handleTrackOrder}>
      <div className="rounded-[24px] border border-[#C9A15A]/40 bg-[#F5EDE0] p-4 sm:p-5 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8A5A2A]">
          Le Coq d'Or
        </p>
        <h3
          className="mt-2 text-xl font-semibold text-[#4A1620]"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Track Your Order
        </h3>
        <p className="mt-1 text-sm text-[#7A5A3A]">
          Enter the details from your bill to follow the journey from kitchen to table.
        </p>
      </div>
      {trackingError && (
        <p
          role="alert"
          className="rounded-2xl border border-[#C58D4A]/30 bg-[#FFF3E5] px-3 py-2 text-center text-xs font-medium text-[#8A2F2F]"
        >
          {trackingError}
        </p>
      )}

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A5A2A]">
          Order ID
        </Label>
        <div className="relative">
          <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A15A]" />
          <Input
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value.toUpperCase())}
            required
            placeholder="e.g. NX-8F4K2Q9M7Z"
            className="pl-10 h-12 rounded-2xl border-[#D8C2A0] bg-[#FFFDF9] text-sm uppercase text-[#4A1620] focus-visible:ring-4 focus-visible:ring-[#C9A15A]/15 focus-visible:border-[#C9A15A] transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A5A2A]">
          Mobile Number
        </Label>
        <div className="relative">
          <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A15A]" />
          <Input
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            type="tel"
            placeholder="e.g. 9876543210"
            className="pl-10 h-12 rounded-2xl border-[#D8C2A0] bg-[#FFFDF9] text-sm text-[#4A1620] focus-visible:ring-4 focus-visible:ring-[#C9A15A]/15 focus-visible:border-[#C9A15A] transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A5A2A]">
          Your Name
        </Label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A15A]" />
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Amit Kumar"
            className="pl-10 h-12 rounded-2xl border-[#D8C2A0] bg-[#FFFDF9] text-sm text-[#4A1620] focus-visible:ring-4 focus-visible:ring-[#C9A15A]/15 focus-visible:border-[#C9A15A] transition-all"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={busy}
        className="w-full h-12 rounded-2xl border border-[#C9A15A]/50 bg-[#4A1620] text-white font-semibold text-sm shadow-[0_12px_24px_-12px_rgba(74,22,32,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
      >
        {busy ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Send className="w-4 h-4 mr-2" />
        )}
        Track Order
      </Button>

      <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#C9A15A]/30 bg-[#FFF8EE] px-3 py-2 text-xs font-medium text-[#7A5A3A]">
        <ShieldCheck className="w-4 h-4 text-[#C9A15A]" />
        <span>Real-time live tracking updates</span>
      </div>
    </form>
  );
}

function TrackingLive({
  order,
  tone,
  shop,
  progressPercent,
  estimatedMinutes,
  onTrackAnother,
}: TrackingLiveProps) {
  const stageLabels = ["Confirmed", "Preparing", "Ready", "Delivered"];
  const stageOrder = ["pending", "preparing", "ready", "completed"];
  const currentStageIndex = Math.max(0, stageOrder.indexOf(order?.status || "pending"));
  const statusHeadline =
    order?.status === "pending"
      ? "Your Order Is Confirmed"
      : order?.status === "preparing"
        ? "Preparing Your Feast"
        : order?.status === "ready"
          ? "Ready For Pickup"
          : order?.status === "completed"
            ? "Your Feast Is Served"
            : "Your Order Is On Its Way";
  const statusSubtitle =
    order?.status === "pending"
      ? "The kitchen has received your request and is preparing the first steps."
      : order?.status === "preparing"
        ? "Chef is crafting your meal with care and timing."
        : order?.status === "ready"
          ? "Everything is plated and awaiting collection."
          : order?.status === "completed"
            ? "Your order has reached its final destination."
            : "We’ll keep you updated as the meal moves through service.";
  const [videoErrored, setVideoErrored] = useState(false);
  const statusVideoSrc = useMemo(() => {
    switch ((order?.status || "pending").toLowerCase()) {
      case "pending":
      case "confirmed":
        return "/animations/confirmed.mp4";
      case "preparing":
        return "/animations/preparing.mp4";
      case "ready":
        return "/animations/ready.mp4";
      case "completed":
      case "delivered":
        return "/animations/completed.mp4";
      default:
        return "/animations/confirmed.mp4";
    }
  }, [order?.status]);

  useEffect(() => {
    setVideoErrored(false);
  }, [statusVideoSrc]);

  return (
    <div className="space-y-5">
      {order?.status === "cancelled" ? (
        <div className="rounded-[28px] border border-[#C9A15A]/40 bg-[#FFF1E3] p-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#8A2F2F]/10">
            <XCircle className="h-7 w-7 text-[#8A2F2F]" />
          </div>
          <h3 className="text-lg font-semibold text-[#4A1620]">Order Cancelled</h3>
          <p className="mt-1 text-sm text-[#7A5A3A]">
            Your order has been cancelled by the restaurant.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A15A] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#4A1620]" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A5A2A]">
              Live Tracking
            </span>
          </div>

          <div className="rounded-[30px] border border-[#C9A15A]/45 bg-[#F5EDE0] p-4 sm:p-6 shadow-[0_18px_44px_-24px_rgba(74,22,32,0.4)]">
            <div className="flex items-center justify-center">
              <div className="flex h-[132px] w-[132px] items-center justify-center overflow-hidden rounded-full border-[4px] border-[#C9A15A]/70 bg-[#FFF8F0] p-1 shadow-[0_8px_24px_-12px_rgba(74,22,32,0.35)] sm:h-[156px] sm:w-[156px]">
                {videoErrored ? (
                  <img
                    src="/images/chef-photo.svg"
                    alt="Chef portrait placeholder"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <video
                    key={statusVideoSrc}
                    src={statusVideoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full rounded-full object-cover"
                    aria-label={`${statusHeadline} animation`}
                    onError={() => setVideoErrored(true)}
                  />
                )}
              </div>
            </div>

            <div className="mt-4 text-center">
              <h3
                className="text-2xl font-semibold text-[#4A1620]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {statusHeadline}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#7A5A3A]">{statusSubtitle}</p>
            </div>

            <div className="mt-5 rounded-[22px] border border-[#D8C2A0] bg-[#FFF8F0] p-4">
              <div className="relative h-3 overflow-hidden rounded-full bg-[#E7D4B1]">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${progressPercent}%`,
                    background: `linear-gradient(90deg, #C9A15A, #8A5A2A)`,
                  }}
                />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8A5A2A]">
                {stageLabels.map((label, index) => {
                  const active = index <= currentStageIndex;
                  return (
                    <span
                      key={label}
                      className={`rounded-full px-2 py-1 text-center ${active ? "bg-[#C9A15A]/15 text-[#4A1620]" : "bg-[#efe0c6] text-[#8A5A2A]"}`}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#C9A15A]/35 bg-[#FFF8F0] p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-dotted border-[#C9A15A]/60 pb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8A5A2A]">
              <span>Order ID</span>
              <span>{order?.orderId}</span>
            </div>

            <div className="mt-3 flex items-center justify-between border-b border-dotted border-[#C9A15A]/60 pb-3 text-sm text-[#4A1620]">
              <span className="font-medium">Estimated time</span>
              <span className="font-semibold text-[#8A5A2A]">~{estimatedMinutes} mins</span>
            </div>

            <div className="mt-3 flex items-center justify-between border-b border-dotted border-[#C9A15A]/60 pb-3 text-sm text-[#4A1620]">
              <span className="font-medium">Payment</span>
              <span className="font-semibold text-[#8A5A2A]">
                {order?.paymentMethod?.toUpperCase() || "CASH"}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {(order?.items || []).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-dotted border-[#C9A15A]/50 pb-2 text-sm text-[#4A1620]"
                >
                  <span className="pr-3 font-medium">
                    {item.name}
                    <span className="ml-2 rounded-full bg-[#EFE0C6] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8A5A2A]">
                      x{item.quantity}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold text-[#4A1620]">
                    {formatCurrency(item.price * item.quantity, shop?.currency ?? "INR")}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[18px] border border-[#C9A15A]/40 bg-[#4A1620] px-4 py-3 text-sm font-semibold text-[#FFF8F0]">
              <span>Total</span>
              <span>{formatCurrency(order?.total || 0, shop?.currency ?? "INR")}</span>
            </div>
          </div>
        </div>
      )}

      <Button
        variant="outline"
        onClick={onTrackAnother}
        className="w-full h-12 rounded-2xl border-[#C9A15A]/40 bg-[#FFF8F0] text-[#4A1620] font-semibold hover:bg-[#F5EDE0] transition-all"
      >
        Track Another Order
      </Button>
    </div>
  );
}

function CustomerPortal() {
  const { shopCode } = useParams({ from: "/order/$shopCode" });
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [orderIdInput, setOrderIdInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState<ActiveOrder | null>(null);
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  // Restaurant CMS data
  const [branding, setBranding] = useState<FirestoreRecord | null>(null);
  const [details, setDetails] = useState<FirestoreRecord | null>(null);
  const [gallery, setGallery] = useState<FirestoreRecord | null>(null);
  const [contact, setContact] = useState<FirestoreRecord | null>(null);
  const [announcements, setAnnouncements] = useState<FirestoreRecord[]>([]);
  const [reviews, setReviews] = useState<FirestoreRecord[]>([]);
  const [faqs, setFaqs] = useState<FirestoreRecord[]>([]);

  // Load shop by code
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const db = getDb();
        const snap = await getDocs(
          query(collection(db, COL.shops), where("shopCode", "==", shopCode), limit(1)),
        );
        if (cancelled) return;
        if (snap.empty) {
          setShop(null);
        } else {
          const d = snap.docs[0];
          const data = d.data() as Omit<Shop, "id">;
          setShop({ id: d.id, ...data });
        }
      } catch (error: unknown) {
        console.error("[portal] load shop", error);
        if (!cancelled) {
          setPortalError(
            "We could not load this restaurant. Please check your connection and try again.",
          );
          setShop(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [shopCode]);

  // Real-time listeners for Restaurant CMS data
  useEffect(() => {
    if (!shop?.id) return;
    const db = getDb();
    const unsubs: (() => void)[] = [];

    const onListenerError = (error: unknown) => {
      console.error("[portal] CMS listener failed", error);
      setPortalError("Some restaurant details could not be loaded. Please refresh and try again.");
    };
    unsubs.push(
      onSnapshot(
        doc(db, COL.branding, shop.id),
        (snap) => setBranding(snap.exists() ? snap.data() : null),
        onListenerError,
      ),
    );
    unsubs.push(
      onSnapshot(
        doc(db, COL.details, shop.id),
        (snap) => setDetails(snap.exists() ? snap.data() : null),
        onListenerError,
      ),
    );
    unsubs.push(
      onSnapshot(
        doc(db, COL.gallery, shop.id),
        (snap) => setGallery(snap.exists() ? snap.data() : null),
        onListenerError,
      ),
    );
    unsubs.push(
      onSnapshot(
        doc(db, COL.contact, shop.id),
        (snap) => setContact(snap.exists() ? snap.data() : null),
        onListenerError,
      ),
    );

    unsubs.push(
      onSnapshot(
        query(
          collection(db, COL.announcements),
          where("shopId", "==", shop.id),
          where("active", "==", true),
          orderBy("createdAt", "desc"),
        ),
        (snap) => setAnnouncements(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
        onListenerError,
      ),
    );
    unsubs.push(
      onSnapshot(
        query(
          collection(db, COL.reviews),
          where("shopId", "==", shop.id),
          where("status", "==", "approved"),
          orderBy("createdAt", "desc"),
        ),
        (snap) => setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
        onListenerError,
      ),
    );
    unsubs.push(
      onSnapshot(
        query(
          collection(db, COL.faqs),
          where("shopId", "==", shop.id),
          where("active", "==", true),
          orderBy("displayOrder", "asc"),
        ),
        (snap) => setFaqs(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
        onListenerError,
      ),
    );

    return () => unsubs.forEach((u) => u());
  }, [shop?.id]);

  // Real-time status of placed order
  useEffect(() => {
    if (!order?.id) return;
    const unsub = onSnapshot(
      doc(getDb(), COL.orders, order.id),
      (snap) => {
        if (!snap.exists()) return;
        const data = snap.data();
        setOrder({
          id: snap.id,
          orderId: data.orderId,
          orderNumber: data.orderNumber,
          status: data.status,
          items: data.items || [],
          total: data.total || 0,
          paymentMethod: data.paymentMethod || "CASH",
          createdAt: data.createdAt,
        });
        if (data.status === "ready") toast.success("Your order is ready for pickup!");
      },
      (err) => console.error("[portal] snapshot failed", err),
    );
    return () => unsub();
  }, [order?.id]);

  // Auto-rotate announcements
  useEffect(() => {
    if (announcements.length < 2) return;
    const t = setInterval(() => setAnnouncementIdx((i) => (i + 1) % announcements.length), 5000);
    return () => clearInterval(t);
  }, [announcements.length]);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;
    if (!orderIdInput.trim() || !mobile.trim()) {
      toast.error("Order ID and mobile number are required.");
      return;
    }
    setBusy(true);
    setTrackingError(null);
    try {
      const db = getDb();
      const enteredOrderId = normalizeOrderId(orderIdInput);
      const normalizedMobile = normalizeMobile(mobile);
      const docSnap = await findOrderByPublicId(db, shop.id, enteredOrderId);
      if (!docSnap?.exists()) {
        setOrder(null);
        toast.error("No matching order was found for those details.");
        return;
      }
      const matchedOrderData = docSnap.data() as OrderSnapshotData;
      const storedMobile = normalizeMobile(String(matchedOrderData.customerMobile || ""));
      if (storedMobile && storedMobile !== normalizedMobile) {
        setOrder(null);
        toast.error("No matching order was found for those details.");
        return;
      }
      const orderRef = doc(db, COL.orders, docSnap.id);
      if (!storedMobile || (name.trim() && !matchedOrderData.customerName)) {
        await updateDoc(orderRef, {
          ...(storedMobile ? {} : { customerMobile: normalizedMobile }),
          ...(name.trim() && !matchedOrderData.customerName ? { customerName: name.trim() } : {}),
          updatedAt: serverTimestamp(),
        });
      }

      const customerId = `${shop.id}_${normalizedMobile}`;
      const customerRef = doc(db, COL.customers, customerId);
      await runTransaction(db, async (tx) => {
        const c = await tx.get(customerRef);
        if (c.exists()) {
          const prev = c.data() as FirestoreRecord;
          const prevName = typeof prev.name === "string" ? prev.name : undefined;
          const prevTotalOrders = typeof prev.totalOrders === "number" ? prev.totalOrders : 0;
          const prevTotalSpending = typeof prev.totalSpending === "number" ? prev.totalSpending : 0;
          const prevLoyaltyPoints = typeof prev.loyaltyPoints === "number" ? prev.loyaltyPoints : 0;
          tx.update(customerRef, {
            name: name.trim() || prevName || "Customer",
            totalOrders: prevTotalOrders + 1,
            totalSpending: prevTotalSpending + (matchedOrderData.total || 0),
            loyaltyPoints:
              prevLoyaltyPoints + Math.max(1, Math.floor((matchedOrderData.total || 0) / 100)),
            lastVisit: serverTimestamp(),
          });
        } else {
          tx.set(customerRef, {
            shopId: shop.id,
            mobile: normalizedMobile,
            name: name.trim() || "Customer",
            totalOrders: 1,
            totalSpending: matchedOrderData.total || 0,
            loyaltyPoints: Math.max(1, Math.floor((matchedOrderData.total || 0) / 100)),
            createdAt: serverTimestamp(),
            lastVisit: serverTimestamp(),
          });
        }
      });

      try {
        await setDoc(doc(collection(db, COL.notifications)), {
          userId: null,
          shopId: shop.id,
          title: "Customer Registered",
          body: `Order ${enteredOrderId} tracked by customer ${name.trim()} (${mobile.trim()})`,
          type: "qr_checkin",
          read: false,
          createdAt: serverTimestamp(),
        });
      } catch (error: unknown) {
        console.warn("[portal] notify failed", error);
      }

      setOrder({
        id: docSnap.id,
        orderId: matchedOrderData.orderId || enteredOrderId,
        orderNumber: matchedOrderData.orderNumber || 0,
        status: matchedOrderData.status || "Waiting",
        items: matchedOrderData.items || [],
        total: matchedOrderData.total || 0,
        paymentMethod: matchedOrderData.paymentMethod || "CASH",
        createdAt: matchedOrderData.createdAt,
      });
      toast.success(`Tracking active for Order ${enteredOrderId}`);
    } catch (error: unknown) {
      console.error("[portal] tracking failed", error);
      const message = "We could not look up that order right now. Please try again shortly.";
      setTrackingError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const progressPercent = useMemo(() => {
    if (!order) return 0;
    if (order.status === "Waiting") return 15;
    if (order.status === "pending") return 25;
    if (order.status === "preparing") return 50;
    if (order.status === "ready") return 75;
    if (order.status === "completed") return 100;
    return 0;
  }, [order]);

  const estimatedMinutes = useMemo(() => {
    if (!order?.items?.length) return 15;
    const computed = order.items.reduce(
      (sum, item) => sum + (item.veg ? 8 : 12) * (item.quantity || 1),
      0,
    );
    return Math.max(10, computed);
  }, [order]);

  // ─── Derived data checks ──────────────────────────────────────────
  const coverBanner = branding?.coverBanner || shop?.bannerUrl || "";
  const restaurantLogo = branding?.restaurantLogo || shop?.logoUrl || "";
  const restaurantName = branding?.restaurantName || shop?.name || "";
  const tagline = branding?.restaurantTagline || "";
  const hasAbout = !!details?.aboutRestaurant;
  const hasStory = !!details?.story;
  const hasSignatureQuote = !!details?.signatureQuote;
  const hasChef = !!(details?.headChefName || details?.chefPhoto);
  const hasMission = !!details?.mission;
  const hasVision = !!details?.vision;
  const hasAwards = !!(details?.awards || details?.certifications);
  const hasGallery =
    gallery && Object.values(gallery).some((item) => isStringArray(item) && item.length > 0);
  const hasContact =
    contact &&
    (contact.phone || contact.whatsapp || contact.email || contact.website || contact.address);
  const hasSocial =
    contact &&
    (contact.instagram || contact.facebook || contact.youtube || contact.x || contact.threads);
  const hasAnnouncements = announcements.length > 0;
  const hasReviews = reviews.length > 0;
  const hasFaqs = faqs.length > 0;
  const hasMap = !!(contact?.latitude && contact?.longitude);

  const allGalleryImages: string[] = useMemo(() => {
    if (!gallery) return [];
    const imgs: string[] = [];
    Object.values(gallery).forEach((item) => {
      if (isStringArray(item)) imgs.push(...item);
    });
    return imgs;
  }, [gallery]);

  const tone = shop?.themeColor || "#F97316";

  // ─── Loading state ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7ECDD] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 mx-auto flex items-center justify-center animate-pulse">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-100 rounded-full mx-auto animate-pulse" />
            <div className="h-3 w-24 bg-slate-50 rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-[#F7ECDD] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-4">
            <ChefHat className="w-10 h-10 text-slate-300" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            {portalError ? "Unable to load restaurant" : "Shop Not Found"}
          </h1>
          <p className="text-slate-500 text-sm">
            {portalError ?? (
              <>
                Code{" "}
                <code className="bg-slate-100 px-2 py-0.5 rounded text-orange-600 font-mono">
                  {shopCode}
                </code>{" "}
                does not match any active shop.
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  // ─── MAIN RENDER ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7ECDD] font-sans antialiased text-[#4A1620]">
      {/* ─── HERO BANNER ──────────────────────────────────────────── */}
      <section className="relative w-full h-[36vh] sm:h-[42vh] md:h-[46vh] overflow-hidden bg-slate-900">
        {/* Background image */}
        {coverBanner ? (
          <img
            src={coverBanner}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${heroLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setHeroLoaded(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#4A1620]/70 via-[#4A1620]/40 to-[#4A1620]/90" />

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent" />

        {/* Hero content */}
        <div className="absolute inset-x-0 top-0 z-10 px-4 pb-6 pt-4 sm:px-8 sm:pt-6 md:px-10 md:pt-8">
          <div className="mx-auto max-w-4xl">
            {restaurantLogo && (
              <div className="mb-4 h-20 w-20 overflow-hidden rounded-[24px] border border-[#C9A15A]/60 bg-[#FFF8F0]/10 shadow-2xl shadow-black/30 backdrop-blur-sm sm:h-24 sm:w-24">
                <img
                  src={restaurantLogo}
                  alt={restaurantName}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center justify-center rounded-[28px] border border-[#C9A15A]/70 bg-[#4A1620]/95 px-4 py-5 text-center shadow-[0_20px_64px_-30px_rgba(0,0,0,0.7)] sm:px-6 sm:py-7">
              <div className="absolute left-3 top-3 h-3 w-3 rounded-full border border-[#C9A15A]/70" />
              <div className="absolute right-3 top-3 h-3 w-3 rounded-full border border-[#C9A15A]/70" />
              <div className="absolute bottom-3 left-3 h-3 w-3 rounded-full border border-[#C9A15A]/70" />
              <div className="absolute bottom-3 right-3 h-3 w-3 rounded-full border border-[#C9A15A]/70" />
              <h1
                className="w-full break-words px-2 text-[1.65rem] font-semibold leading-tight tracking-[0.08em] text-[#FFF8F0] sm:px-4 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {restaurantName}
              </h1>
              <div className="mt-3 h-px w-full max-w-[12rem] bg-[#C9A15A]" />
              {tagline && (
                <p className="mt-3 max-w-2xl px-2 text-sm font-light text-[#F5EDE0]/90 sm:px-4 sm:text-base md:text-lg">
                  {tagline}
                </p>
              )}
              <div className="mt-4 flex justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A15A]/70 bg-[#FFF8F0] text-lg font-semibold text-[#4A1620]">
                  L
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        {/* ─── ORDER TRACKING CARD ────────────────────────────────── */}
        <AnimatedSection>
          <div className="rounded-[36px] border border-[#C9A15A]/40 bg-[#FFF8F0]/95 p-6 shadow-[0_22px_70px_-30px_rgba(74,22,32,0.35)] backdrop-blur-xl sm:p-8 mb-8">
            {order ? (
              <TrackingLive
                order={order}
                tone={tone}
                shop={shop}
                progressPercent={progressPercent}
                estimatedMinutes={estimatedMinutes}
                onTrackAnother={() => setOrder(null)}
              />
            ) : (
              <TrackingForm
                orderIdInput={orderIdInput}
                setOrderIdInput={setOrderIdInput}
                mobile={mobile}
                setMobile={setMobile}
                name={name}
                setName={setName}
                handleTrackOrder={handleTrackOrder}
                busy={busy}
                trackingError={trackingError}
                tone={tone}
              />
            )}
          </div>
        </AnimatedSection>

        {/* ─── ANNOUNCEMENTS SLIDER ───────────────────────────────── */}
        {hasAnnouncements && (
          <AnimatedSection className="mb-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-xl shadow-orange-200">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <Megaphone className="w-5 h-5 text-white/90" />
                  <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
                    Announcements
                  </span>
                </div>
                <div className="relative min-h-[80px]">
                  {announcements.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`transition-all duration-500 absolute inset-0 ${idx === announcementIdx ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                    >
                      <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-white/80 leading-relaxed">{item.message}</p>
                      {item.bannerImage && (
                        <img
                          src={item.bannerImage}
                          alt=""
                          className="mt-3 rounded-2xl w-full h-32 object-cover border border-white/20"
                        />
                      )}
                    </div>
                  ))}
                </div>
                {announcements.length > 1 && (
                  <div className="flex gap-1.5 mt-4">
                    {announcements.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setAnnouncementIdx(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === announcementIdx ? "w-8 bg-white" : "w-1.5 bg-white/40"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ─── SIGNATURE QUOTE ────────────────────────────────────── */}
        {hasSignatureQuote && (
          <AnimatedSection className="mb-8">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-3xl p-8 sm:p-10 text-center">
              <Quote className="w-10 h-10 text-orange-300 mx-auto mb-4" />
              <p className="text-xl sm:text-2xl font-display italic text-slate-700 leading-relaxed">
                "{details.signatureQuote}"
              </p>
            </div>
          </AnimatedSection>
        )}

        {/* ─── ABOUT ──────────────────────────────────────────────── */}
        {hasAbout && (
          <AnimatedSection className="mb-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <SectionHeading icon={BookOpen} title="About Us" subtitle="Our story and passion" />
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                {details.aboutRestaurant}
              </p>
            </div>
          </AnimatedSection>
        )}

        {/* ─── STORY ──────────────────────────────────────────────── */}
        {hasStory && (
          <AnimatedSection className="mb-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <SectionHeading icon={Sparkles} title="Our Story" subtitle="How it all began" />
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                {details.story}
              </p>
            </div>
          </AnimatedSection>
        )}

        {/* ─── MISSION & VISION ───────────────────────────────────── */}
        {(hasMission || hasVision) && (
          <AnimatedSection className="mb-8">
            <div className="grid sm:grid-cols-2 gap-4">
              {hasMission && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-orange-500" />
                    <h3 className="font-bold text-slate-800">Our Mission</h3>
                  </div>
                  <p className="text-sm text-slate-600 whitespace-pre-line">{details.mission}</p>
                </div>
              )}
              {hasVision && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-5 h-5 text-orange-500" />
                    <h3 className="font-bold text-slate-800">Our Vision</h3>
                  </div>
                  <p className="text-sm text-slate-600 whitespace-pre-line">{details.vision}</p>
                </div>
              )}
            </div>
          </AnimatedSection>
        )}

        {/* ─── CHEF ───────────────────────────────────────────────── */}
        {hasChef && (
          <AnimatedSection className="mb-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <SectionHeading
                icon={ChefHat}
                title="Meet Our Chef"
                subtitle="The master behind the flavors"
              />
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {details.chefPhoto && (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-lg shrink-0">
                    <img
                      src={details.chefPhoto}
                      alt={details.headChefName || "Chef"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  {details.headChefName && (
                    <h3 className="text-xl font-bold text-slate-800 mb-1">
                      {details.headChefName}
                    </h3>
                  )}
                  {details.chefDescription && (
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {details.chefDescription}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ─── ACHIEVEMENTS ────────────────────────────────────────── */}
        {hasAwards && (
          <AnimatedSection className="mb-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <SectionHeading
                icon={Trophy}
                title="Achievements"
                subtitle="Recognition & excellence"
              />
              <div className="space-y-4">
                {details.awards && (
                  <div className="flex items-start gap-3 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                    <Award className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm text-slate-700 mb-1">Awards</h4>
                      <p className="text-sm text-slate-600 whitespace-pre-line">{details.awards}</p>
                    </div>
                  </div>
                )}
                {details.certifications && (
                  <div className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm text-slate-700 mb-1">Certifications</h4>
                      <p className="text-sm text-slate-600 whitespace-pre-line">
                        {details.certifications}
                      </p>
                    </div>
                  </div>
                )}
                {(details.hygieneRating || details.googleRating) && (
                  <div className="flex gap-6 pt-2">
                    {details.hygieneRating && (
                      <div className="text-center p-4 bg-slate-50 rounded-2xl flex-1">
                        <div className="text-xs text-slate-400 mb-1">Hygiene</div>
                        <div className="text-2xl font-bold text-slate-800">
                          {details.hygieneRating}
                        </div>
                        <div className="text-xs text-slate-400">/ 5</div>
                      </div>
                    )}
                    {details.googleRating && (
                      <div className="text-center p-4 bg-slate-50 rounded-2xl flex-1">
                        <div className="text-xs text-slate-400 mb-1">Rating</div>
                        <div className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          {details.googleRating}
                        </div>
                        <div className="text-xs text-slate-400">/ 5</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ─── GALLERY ────────────────────────────────────────────── */}
        {hasGallery && allGalleryImages.length > 0 && (
          <AnimatedSection className="mb-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden">
              <SectionHeading icon={ImageIcon} title="Gallery" subtitle="Moments captured" />
              <PremiumGallery images={allGalleryImages} />
            </div>
          </AnimatedSection>
        )}

        {/* ─── REVIEWS ────────────────────────────────────────────── */}
        {hasReviews && (
          <AnimatedSection className="mb-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <SectionHeading
                  icon={Star}
                  title="Reviews"
                  subtitle={`${reviews.length} reviews`}
                />
                {reviews.length > 1 && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setReviewIdx((i) => Math.max(0, i - 1))}
                      disabled={reviewIdx === 0}
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 disabled:opacity-40 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => setReviewIdx((i) => Math.min(reviews.length - 1, i + 1))}
                      disabled={reviewIdx >= reviews.length - 1}
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 disabled:opacity-40 transition-all"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${reviewIdx * 100}%)` }}
                >
                  {reviews.map((item) => (
                    <div key={item.id} className="min-w-full px-1">
                      <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                            {(item.name || "A")[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-slate-800">
                              {item.name || "Anonymous"}
                            </h4>
                            <StarRating rating={item.rating || 0} />
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{item.review}</p>
                        {item.photo && (
                          <img
                            src={item.photo}
                            alt=""
                            className="mt-3 rounded-xl w-20 h-20 object-cover border border-slate-200"
                          />
                        )}
                        {item.reply && (
                          <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200">
                            <p className="text-xs font-semibold text-slate-400 mb-1">
                              Owner's Reply
                            </p>
                            <p className="text-sm text-slate-600">{item.reply}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {reviews.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-4">
                  {reviews.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setReviewIdx(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${idx === reviewIdx ? "w-6 bg-orange-500" : "w-2 bg-slate-200"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>
        )}

        {/* ─── FAQ ────────────────────────────────────────────────── */}
        {hasFaqs && (
          <AnimatedSection className="mb-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <SectionHeading icon={HelpCircle} title="FAQ" subtitle="Frequently asked questions" />
              <div className="space-y-2">
                {faqs.map((item) => (
                  <div
                    key={item.id}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                      className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-medium text-sm text-slate-800 pr-4">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === item.id ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${openFaq === item.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <div className="p-4 pt-0 border-t border-slate-100">
                        <p className="text-sm text-slate-600 whitespace-pre-line">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ─── CONTACT ────────────────────────────────────────────── */}
        {(hasContact || hasSocial) && (
          <AnimatedSection className="mb-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <SectionHeading icon={Phone} title="Contact" subtitle="Get in touch with us" />
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Contact details */}
                {hasContact && (
                  <div className="space-y-3">
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-orange-50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                          <Phone className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{contact.phone}</span>
                      </a>
                    )}
                    {contact.whatsapp && (
                      <a
                        href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-emerald-50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                          <MessageCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {contact.whatsapp}
                        </span>
                      </a>
                    )}
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-orange-50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                          <Mail className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{contact.email}</span>
                      </a>
                    )}
                    {contact.website && (
                      <a
                        href={
                          contact.website.startsWith("http")
                            ? contact.website
                            : `https://${contact.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-orange-50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                          <Globe className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 truncate">
                          {contact.website}
                        </span>
                      </a>
                    )}
                    {contact.address && (
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="text-sm text-slate-600 leading-relaxed">
                          {contact.address}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Social links */}
                {hasSocial && (
                  <div>
                    <h4 className="font-semibold text-sm text-slate-700 mb-3">Follow Us</h4>
                    <div className="flex flex-wrap gap-2">
                      {contact.instagram && (
                        <a
                          href={
                            contact.instagram.startsWith("http")
                              ? contact.instagram
                              : `https://instagram.com/${contact.instagram}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-2xl text-sm font-medium text-pink-700 hover:shadow-md transition-all"
                        >
                          <Instagram className="w-4 h-4" /> Instagram
                        </a>
                      )}
                      {contact.facebook && (
                        <a
                          href={
                            contact.facebook.startsWith("http")
                              ? contact.facebook
                              : `https://facebook.com/${contact.facebook}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl text-sm font-medium text-blue-700 hover:shadow-md transition-all"
                        >
                          <Facebook className="w-4 h-4" /> Facebook
                        </a>
                      )}
                      {contact.youtube && (
                        <a
                          href={
                            contact.youtube.startsWith("http")
                              ? contact.youtube
                              : `https://youtube.com/${contact.youtube}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-2xl text-sm font-medium text-red-700 hover:shadow-md transition-all"
                        >
                          <Youtube className="w-4 h-4" /> YouTube
                        </a>
                      )}
                      {contact.x && (
                        <a
                          href={
                            contact.x.startsWith("http") ? contact.x : `https://x.com/${contact.x}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 hover:shadow-md transition-all"
                        >
                          <Twitter className="w-4 h-4" /> X
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ─── GOOGLE MAPS ────────────────────────────────────────── */}
        {hasMap && (
          <AnimatedSection className="mb-8">
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 pb-3">
                <SectionHeading icon={MapPin} title="Find Us" subtitle="Visit our location" />
              </div>
              <div className="h-64 sm:h-80">
                <iframe
                  title="Restaurant Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${contact.latitude},${contact.longitude}&z=15&output=embed`}
                  className="rounded-b-3xl"
                />
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ─── FOOTER ─────────────────────────────────────────────── */}
        <div className="text-center py-10 border-t border-slate-100">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ChefHat className="w-5 h-5 text-orange-400" />
            <span className="text-sm font-bold text-slate-700">{restaurantName}</span>
          </div>
          <p className="text-xs text-slate-400">Powered by Nexavo POS · {shop.shopCode}</p>
        </div>
      </div>

      <Toaster richColors position="top-center" />
    </div>
  );
}
