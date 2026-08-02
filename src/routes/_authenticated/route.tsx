import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { Toaster } from "@/components/ui/sonner";
import { useShopState, ShopProvider } from "@/hooks/useShop";
import { useAuth } from "@/hooks/useAuth";
import {
  requestNotificationPermissionAndSaveToken,
  listenForegroundMessages,
  fcmConfigured,
} from "@/lib/fcm";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthLayout,
});

function AuthLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const shopState = useShopState();
  const { shop, loading } = shopState;
  const isKitchenDisplayRoute = location.pathname.startsWith("/kitchen");

  useEffect(() => {
    // Do not redirect until:
    // 1. Firebase auth state restored (authLoading is false)
    // 2. staff lookup completed (useShop loading is false)
    // 3. shop lookup completed (useShop loading is false)
    if (authLoading || loading) return;

    if (!user) {
      if (import.meta.env.DEV) console.debug("[AuthLayout] Auth state is restored; redirecting to /auth.");
      navigate({ to: "/auth" });
      return;
    }

    if (!shop) {
      if (import.meta.env.DEV) console.debug("[AuthLayout] Authenticated user has no linked shop.");
      navigate({ to: "/auth", search: { mode: "signup" } });
    }
  }, [user, shop, authLoading, loading, navigate]);

  // Guard routes based on role: if a user navigates manually to an unauthorized path, redirect them
  useEffect(() => {
    if (!shop || !user) return;
    const role = (shop.role || "owner").toLowerCase();
    const path = location.pathname;
    const isKitchenPath = path.startsWith("/kitchen");
    const isBillingPath = path.startsWith("/billing");
    const isAuthPath = path.startsWith("/auth");
    const isComingSoon = path.startsWith("/coming-soon");

    if (role === "kitchen") {
      if (!isKitchenPath && !isAuthPath && !isComingSoon) {
        navigate({ to: "/kitchen" });
      }
      return;
    }

    if (isKitchenPath) {
      if (role === "cashier") {
        navigate({ to: "/billing" });
      } else {
        navigate({ to: "/dashboard" });
      }
      return;
    }

    if (role === "cashier") {
      if (!isBillingPath && !isAuthPath && !isComingSoon) {
        navigate({ to: "/billing" });
      }
    }
  }, [shop, user, location.pathname, navigate]);

  useEffect(() => {
    if (user && fcmConfigured) {
      requestNotificationPermissionAndSaveToken(user.uid);
      const unsub = listenForegroundMessages((title, body) => toast(title, { description: body }));
      return () => unsub();
    }
  }, [user]);

  if (authLoading || loading) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }

  if (!user) return null;

  if (!shop) return null;

  if (isKitchenDisplayRoute) {
    return (
      <ShopProvider value={shopState}>
        <div className="min-h-screen bg-background text-foreground">
          <Outlet />
          <Toaster richColors position="top-right" />
        </div>
      </ShopProvider>
    );
  }

  return (
    <ShopProvider value={shopState}>
      <div className="h-screen flex flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(182,124,47,0.16),_transparent_30%),_linear-gradient(135deg,_rgba(255,250,243,0.95),_rgba(248,239,228,0.94))]">
        <TopBar />
        <div className="min-h-0 flex-1 flex min-w-0 overflow-hidden">
          <AppSidebar />
          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3 md:p-6">
            <Outlet />
          </main>
        </div>
        <Toaster richColors position="top-right" />
      </div>
    </ShopProvider>
  );
}
