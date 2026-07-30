import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
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
  const { user, loading: authLoading } = useAuth();
  const shopState = useShopState();
  const { shop, loading } = shopState;

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

  return (
    <ShopProvider value={shopState}>
      <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top_left,_rgba(182,124,47,0.16),_transparent_30%),_linear-gradient(135deg,_rgba(255,250,243,0.95),_rgba(248,239,228,0.94))]">
        <TopBar />
        <div className="flex-1 flex min-w-0 overflow-hidden">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 pt-16 md:p-6">
            <Outlet />
          </main>
        </div>
        <Toaster richColors position="top-right" />
      </div>
    </ShopProvider>
  );
}
