import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ReceiptText,
  Package,
  Tags,
  ChefHat,
  ShoppingCart,
  MapPinned,
  Users,
  QrCode,
  BarChart3,
  UserCog,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Store,
  Image,
  FileText,
  Images,
  Phone,
  Palette,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { useShopState } from "@/hooks/useShop";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/billing", icon: ReceiptText, label: "Billing" },
  { to: "/products", icon: Package, label: "Products" },
  { to: "/categories", icon: Tags, label: "Categories" },
  { to: "/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/tracking", icon: MapPinned, label: "Tracking" },
  { to: "/customers", icon: Users, label: "Customers" },
  { to: "/qr", icon: QrCode, label: "QR" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/staff", icon: UserCog, label: "Staff" },
  { to: "/settings", icon: SettingsIcon, label: "Settings" },
];

const restaurantSubItems = [
  { to: "/restaurant", hash: "branding", icon: Image, label: "Branding" },
  { to: "/restaurant", hash: "details", icon: FileText, label: "Details" },
  { to: "/restaurant", hash: "gallery", icon: Images, label: "Gallery" },
  { to: "/restaurant", hash: "contact", icon: Phone, label: "Contact" },
  { to: "/restaurant", hash: "theme", icon: Palette, label: "Theme" },
];

export function AppSidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const { shop } = useShopState();
  const shopRole = shop?.role ?? null;
  const loc = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [restaurantOpen, setRestaurantOpen] = useState(
    loc.pathname.startsWith("/restaurant"),
  );

  useEffect(() => {
    const hashValue = loc.hash ? loc.hash.replace(/^#/, "") : "";
    setRestaurantOpen(loc.pathname.startsWith("/restaurant") || !!hashValue);
  }, [loc.pathname, loc.hash]);

  const navigateToRestaurantHash = (hash: string, closeMobile = false) => {
    if (closeMobile) setMobileOpen(false);
    setRestaurantOpen(true);
    onNavigate?.();
    navigate({ to: "/restaurant", hash: () => hash });
  };

  const visibleItems = items.filter((item) => {
    if (!shopRole || ["owner", "admin"].includes(shopRole)) return true;
    if (shopRole === "kitchen") {
      return ["/kitchen"].includes(item.to);
    }
    if (shopRole === "cashier") {
      return ["/billing", "/orders", "/settings"].includes(item.to);
    }
    return false;
  });

  const handleSignOut = async () => {
    await signOut(getFirebaseAuth());
    navigate({ to: "/auth" });
  };

  // Desktop sidebar nav item
  const NavItem = ({
    to,
    icon: Icon,
    label,
  }: {
    to: string;
    icon: React.ElementType;
    label: string;
  }) => {
    const active =
      to === "/billing"
        ? loc.pathname === "/billing"
        : loc.pathname.startsWith(to);
    return (
      <Link
        to={to}
        onClick={() => onNavigate?.()}
        className={cn(
          "flex flex-col items-center gap-1.5 py-2.5 text-[11px] font-semibold transition-all duration-200 border-l-[3px] w-full text-center relative",
          active
            ? "border-[#6b1d1d] text-[#6b1d1d] font-bold"
            : "border-transparent text-[#7c5f48] hover:text-[#4a0f0f]",
        )}
      >
        <Icon
          className={cn(
            "w-5 h-5 shrink-0",
            active ? "text-[#6b1d1d]" : "text-[#7c5f48]",
          )}
        />
        <span className="leading-tight px-1 max-w-[85px]">{label}</span>
      </Link>
    );
  };

  // Mobile sidebar nav item
  const MobileNavItem = ({
    to,
    icon: Icon,
    label,
  }: {
    to: string;
    icon: React.ElementType;
    label: string;
  }) => {
    const active = loc.pathname.startsWith(to);
    return (
      <Link
        key={to}
        to={to}
        onClick={() => {
          setMobileOpen(false);
          onNavigate?.();
        }}
        className={cn(
          "flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-bold",
          active ? "bg-[#efe0c6] text-[#6b1d1d]" : "text-[#5d4432]",
        )}
      >
        <Icon className="h-5 w-5" />
        {label}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        aria-label="Open navigation"
        onClick={() => setMobileOpen(true)}
        className="fixed right-4 top-3 z-40 grid h-12 w-12 place-items-center rounded-2xl border border-[#d8b46b]/60 bg-[#fffaf3] text-[#6b1d1d] shadow-sm md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/35 md:hidden pointer-events-auto"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="h-full w-[min(320px,85vw)] overflow-y-auto overscroll-contain border-r border-[#d8b46b]/40 bg-[#fffaf3] p-4 shadow-2xl touch-pan-y"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="text-lg font-black text-slate-900">Menu</span>
              <button
                aria-label="Close navigation"
                onClick={() => setMobileOpen(false)}
                className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100"
              >
                <X />
              </button>
            </div>
            <nav className="space-y-1">
              {visibleItems.slice(0, 7).map((it) => (
                <MobileNavItem key={it.to} {...it} />
              ))}

              {/* Separator */}
              <div className="my-3 border-t border-slate-100" />

              {/* Restaurant Information - Mobile */}
              <div>
                <button
                  type="button"
                  aria-expanded={restaurantOpen}
                  onClick={() => setRestaurantOpen(!restaurantOpen)}
                  className={cn(
                    "flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 text-sm font-bold justify-between",
                    loc.pathname.startsWith("/restaurant")
                      ? "bg-orange-50 text-orange-600"
                      : "text-slate-700",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Store className="h-5 w-5" />
                    Restaurant Information
                  </span>
                  {restaurantOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {restaurantOpen && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-orange-100 pl-3">
                    {restaurantSubItems.map((sub) => {
                      const active =
                        loc.pathname === sub.to &&
                        loc.hash.replace(/^#/, "") === sub.hash;
                      const SubIcon = sub.icon;
                      return (
                        <button
                          key={sub.label}
                          type="button"
                          onClick={() => navigateToRestaurantHash(sub.hash, true)}
                          className={cn(
                            "flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-left",
                            active
                              ? "bg-orange-50 text-orange-600"
                              : "text-slate-600 hover:text-slate-900",
                          )}
                        >
                          <SubIcon className="h-4 w-4" />
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Separator */}
              <div className="my-3 border-t border-slate-100" />

              {visibleItems.slice(7).map((it) => (
                <MobileNavItem key={it.to} {...it} />
              ))}
            </nav>
            <button
              onClick={handleSignOut}
              className="mt-6 flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 text-sm font-bold text-rose-600"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex w-24 xl:w-28 shrink-0 flex-col border-r border-[#d8b46b]/50 bg-[#fffaf3] py-4 justify-between overflow-y-auto overscroll-contain touch-pan-y",
          className,
        )}
      >
        <nav className="flex-1 flex flex-col gap-6 items-stretch px-0">
          {visibleItems.slice(0, 7).map((it) => (
            <NavItem key={it.to} {...it} />
          ))}

          {/* Separator line */}
          <div className="w-3/4 mx-auto border-t border-slate-200" />

          {/* Restaurant Information - Desktop */}
          <div className="flex flex-col items-stretch px-0">
            <button
              type="button"
              aria-expanded={restaurantOpen}
              onClick={() => setRestaurantOpen(!restaurantOpen)}
              className={cn(
                "relative z-20 flex flex-col items-center gap-1.5 py-2.5 text-[11px] font-semibold transition-all duration-200 border-l-[3px] w-full text-center",
                loc.pathname.startsWith("/restaurant")
                  ? "border-orange-500 text-orange-600 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-900",
              )}
            >
              <Store
                className={cn(
                  "w-5 h-5 shrink-0",
                  loc.pathname.startsWith("/restaurant")
                    ? "text-orange-500"
                    : "text-slate-500",
                )}
              />
              <span className="leading-tight px-1 max-w-[85px]">
                Restaurant
              </span>
              {restaurantOpen ? (
                <ChevronUp className="w-3 h-3 mt-0.5" />
              ) : (
                <ChevronDown className="w-3 h-3 mt-0.5" />
              )}
            </button>

            {restaurantOpen && (
              <div className="flex flex-col items-stretch mt-1">
                {restaurantSubItems.map((sub) => {
                  const active =
                    loc.pathname === sub.to && loc.hash.replace(/^#/, "") === sub.hash;
                  const SubIcon = sub.icon;
                  return (
                    <button
                      key={sub.label}
                      type="button"
                      onClick={() => navigateToRestaurantHash(sub.hash)}
                      className={cn(
                        "flex flex-col items-center gap-1 py-1.5 text-[10px] font-medium transition-all duration-200 w-full text-center",
                        active
                          ? "text-orange-600 font-bold"
                          : "text-slate-400 hover:text-slate-700",
                      )}
                    >
                      <SubIcon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          active ? "text-orange-500" : "text-slate-400",
                        )}
                      />
                      <span className="leading-tight px-1 max-w-[80px]">
                        {sub.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Separator line */}
          <div className="w-3/4 mx-auto border-t border-slate-200" />

          {visibleItems.slice(7).map((it) => (
            <NavItem key={it.to} {...it} />
          ))}
        </nav>

        <div className="px-3 border-t border-slate-100 pt-4 flex justify-center">
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center gap-1.5 py-2 text-[11px] font-semibold text-slate-500 hover:text-rose-600 transition-colors w-full"
          >
            <LogOut className="w-5 h-5 text-slate-500 hover:text-rose-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}