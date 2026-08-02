import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import i18n from "@/lib/i18n";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type AuthError,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { ensureSessionPersistence, getFirebaseAuth, getDb, COL, firebaseConfigured } from "@/lib/firebase";
import { pickUniqueShopCode } from "@/lib/shop-code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const searchSchema = z.object({ mode: z.enum(["signin", "signup", "kitchen"]).optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: `${i18n.t("common.signIn")} · ${i18n.t("common.appName")}` },
      {
        name: "description",
        content: "Sign in to your shop dashboard or create a new shop on FoodCourtNotify.",
      },
    ],
  }),
  component: AuthPage,
});

async function resolveSignedInRoute(
  db: ReturnType<typeof getDb>,
  uid: string,
  email: string | null,
  shopName: string,
  mode: "signin" | "kitchen",
) {
  let staffSnap = await getDocs(
    query(
      collection(db, COL.staff),
      where("userId", "==", uid),
      where("active", "==", true),
      limit(1),
    ),
  );

  if (staffSnap.empty && email) {
    try {
      staffSnap = await getDocs(
        query(
          collection(db, COL.staff),
          where("email", "==", email),
          where("active", "==", true),
          limit(1),
        ),
      );
    } catch (error) {
      if (import.meta.env.DEV) console.warn("[auth] Staff lookup by email failed", error);
    }
  }

  if (!staffSnap.empty) {
    const staffDoc = staffSnap.docs[0];
    const staff = staffDoc.data() as { role?: string; shopId?: string };
    const targetRole = (staff.role || "").toLowerCase();

    if (staff.shopId) {
      const shopDoc = await getDoc(doc(db, COL.shops, staff.shopId));
      if (shopDoc.exists()) {
        const selectedShop = ((shopDoc.data() as { name?: string }).name ?? "").trim().toLowerCase();
        if (shopName.trim() && selectedShop && selectedShop !== shopName.trim().toLowerCase()) {
          return { route: null, error: "This account does not belong to the selected shop." };
        }
      }
    }

    if (mode === "kitchen") {
      if (targetRole !== "kitchen") {
        return { route: null, error: "This account is not registered as kitchen staff." };
      }
      return { route: "/kitchen", error: null };
    }

    if (targetRole === "kitchen") {
      return { route: null, error: "This account is for kitchen access. Please use Kitchen Login." };
    }
    if (targetRole === "cashier") return { route: "/billing", error: null };
    return { route: "/dashboard", error: null };
  }

  let shopsSnap = await getDocs(
    query(
      collection(db, COL.shops),
      where("ownerId", "==", uid),
      limit(1),
    ),
  );

  if (shopsSnap.empty && email) {
    try {
      shopsSnap = await getDocs(
        query(
          collection(db, COL.shops),
          where("email", "==", email),
          limit(1),
        ),
      );
    } catch (error) {
      if (import.meta.env.DEV) console.warn("[auth] Shop lookup by email failed", error);
    }
  }

  if (!shopsSnap.empty) {
    const shopDoc = shopsSnap.docs[0];
    const shopNameValue = ((shopDoc.data() as { name?: string }).name ?? "").trim().toLowerCase();
    if (shopName.trim() && shopNameValue && shopNameValue !== shopName.trim().toLowerCase()) {
      return { route: null, error: "This account does not belong to the selected shop." };
    }
    if (mode === "kitchen") {
      return { route: null, error: "This account is not registered as kitchen staff." };
    }
    return { route: "/dashboard", error: null };
  }

  return { route: null, error: "This account is not linked to any shop." };
}

function describeAuthError(err: unknown): string {
  const code = (err as AuthError)?.code ?? "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Incorrect email or password.";
    case "auth/user-not-found":
      return "No account was found for that email address.";
    case "auth/invalid-email":
      return "That email address is invalid.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please sign in.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/network-request-failed":
      return "Network error — check your internet connection.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a minute and try again.";
    case "auth/api-key-not-valid":
    case "auth/invalid-api-key":
      return "Firebase API key is missing. Add VITE_FIREBASE_API_KEY to .env.";
    default:
      return (err as Error)?.message || "Something went wrong. Please try again.";
  }
}

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup" | "kitchen">((mode ?? "signin") as "signin" | "signup" | "kitchen");

  useEffect(() => {
    if (mode && mode !== tab) {
      setTab(mode as "signin" | "signup" | "kitchen");
    }
  }, [mode, tab]);

  useEffect(() => {
    if (!firebaseConfigured) return;
    const auth = getFirebaseAuth();
    const unsub = auth.onAuthStateChanged(() => {
      // Intentionally do not auto-redirect from /auth. Users must explicitly sign in.
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(182,124,47,0.16),_transparent_28%)] p-3 sm:p-4 lg:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-7xl flex-col overflow-hidden rounded-[32px] border border-border/70 bg-card/70 shadow-soft backdrop-blur-xl lg:min-h-[calc(100vh-3rem)] lg:flex-row">
        <div className="relative flex flex-1 flex-col justify-between overflow-hidden gradient-hero p-8 text-primary-foreground sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_30%)]" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <ChefHat className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold">FoodCourtNotify</p>
              <p className="text-sm text-primary-foreground/75">A calmer way to run your kitchen</p>
            </div>
          </div>
          <div className="relative max-w-lg">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-primary-foreground/70">Freshly brewed operations</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              One porch light for orders, staff, and every shop story.
            </h2>
            <p className="mt-4 max-w-md text-base text-primary-foreground/80">
              Welcome guests faster, keep the kitchen aligned, and give each shop a dedicated QR portal with real-time updates.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm text-primary-foreground/80">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">QR portals</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Kitchen alerts</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Customer CRM</span>
            </div>
          </div>
          <div className="relative text-sm text-primary-foreground/70">© FoodCourtNotify</div>
        </div>
        <div className="flex flex-1 items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(182,124,47,0.16),_transparent_28%)] p-5 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            {!firebaseConfigured && (
              <div className="mb-4 rounded-2xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                Firebase API key is missing. Add <code>VITE_FIREBASE_API_KEY</code> to your{" "}
                <code>.env</code> file and reload.
              </div>
            )}
            <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup" | "kitchen")}>
              <TabsList className="mb-6 grid w-full grid-cols-3">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="kitchen">Kitchen Login</TabsTrigger>
                <TabsTrigger value="signup">Create shop</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <SignInCard />
              </TabsContent>
              <TabsContent value="kitchen">
                <KitchenSignInCard />
              </TabsContent>
              <TabsContent value="signup">
                <SignUpCard onDone={() => setTab("signin")} />
              </TabsContent>
            </Tabs>
            <div className="mt-6 text-center text-sm">
              <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                <span aria-hidden="true">←</span>
                Back home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}

function SignInCard() {
  const navigate = useNavigate();
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotBusy, setForgotBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) {
      setAuthError("Please enter your shop name.");
      toast.error("Please enter your shop name.");
      return;
    }
    if (!email.trim() || !password) {
      setAuthError("Email and password are required.");
      toast.error("Email and password are required.");
      return;
    }

    setBusy(true);
    setAuthError(null);
    let cancelled = false;

    const timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      cancelled = true;
      setBusy(false);
      setAuthError("Login is taking too long. Please check your connection and try again.");
      toast.error("Login timed out. Please try again.");
    }, 12000);

    try {
      const auth = await ensureSessionPersistence();
      const db = getDb();
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (cancelled) return;

      const target = await resolveSignedInRoute(db, cred.user.uid, cred.user.email, shopName, "signin");
      if (cancelled) return;

      if (target.error) {
        await signOut(auth);
        setAuthError(target.error);
        toast.error(target.error);
        return;
      }

      if (target.route) {
        const successMessage = target.route === "/kitchen" ? "Welcome to Kitchen" : target.route === "/billing" ? "Welcome to Billing" : "Welcome back!";
        toast.success(successMessage);
        navigate({ to: target.route as any });
      }
    } catch (err) {
      if (!cancelled) {
        const message = describeAuthError(err);
        setAuthError(message);
        toast.error(message);
      }
    } finally {
      if (!cancelled) {
        window.clearTimeout(timeoutId);
        setBusy(false);
      }
    }
  };

  const sendReset = async () => {
    if (!forgotEmail.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    setForgotBusy(true);
    try {
      const auth = getFirebaseAuth();
      await sendPasswordResetEmail(auth, forgotEmail.trim());
      toast.success("Password reset link sent to your email — check your inbox");
      setForgotMode(false);
      setForgotEmail("");
    } catch (err) {
      toast.error(describeAuthError(err));
    } finally {
      setForgotBusy(false);
    }
  };

  return (
    <Card className="border-border/70 bg-background/95 shadow-soft">
      <CardHeader className="space-y-2">
        <div className="inline-flex w-fit rounded-full border border-border/70 bg-muted/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Morning service
        </div>
        <CardTitle className="font-display text-2xl">Welcome back</CardTitle>
        <CardDescription>Shop owner or staff member? Sign in below with your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-1.5">
            <Label htmlFor="si-shop">Shop name</Label>
            <Input
              id="si-shop"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="e.g. Spice Hut"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="si-email">Email</Label>
            <Input id="si-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="si-pass">Password</Label>
            <Input id="si-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {authError ? <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{authError}</div> : null}
          <div className="flex items-center justify-between">
            <div />
            <button type="button" className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary/90 hover:underline" onClick={() => { setForgotMode((s) => !s); setForgotEmail(email); }}>
              Forgot password?
            </button>
          </div>

          {forgotMode && (
            <div className="space-y-2 rounded-2xl border border-border/70 bg-muted/40 p-3">
              <div className="space-y-1.5">
                <Label>Email for reset</Label>
                <Input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={sendReset} disabled={forgotBusy}>{forgotBusy ? "Sending..." : "Send reset link"}</Button>
                <Button variant="outline" onClick={() => setForgotMode(false)}>Cancel</Button>
              </div>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function KitchenSignInCard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      toast.error("Email and password are required.");
      return;
    }
    setBusy(true);
    setError(null);

    try {
      const auth = await ensureSessionPersistence();
      const db = getDb();
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = cred.user;

      const target = await resolveSignedInRoute(db, user.uid, user.email, "", "kitchen");

      if (target.error) {
        await signOut(auth);
        setError(target.error);
        toast.error(target.error);
        return;
      }

      if (target.route) {
        toast.success("Welcome to Kitchen");
        navigate({ to: target.route as any });
      }
    } catch (err) {
      const message = describeAuthError(err);
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="border-border/70 bg-background/95 shadow-soft">
      <CardHeader className="space-y-2">
        <div className="inline-flex w-fit rounded-full border border-border/70 bg-muted/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Kitchen staff
        </div>
        <CardTitle className="font-display text-2xl">Kitchen Login</CardTitle>
        <CardDescription>Enter your kitchen account credentials to access the full-screen kitchen display.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-1.5">
            <Label htmlFor="ki-email">Email</Label>
            <Input id="ki-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ki-pass">Password</Label>
            <Input id="ki-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error ? <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Kitchen Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function SignUpCard({ onDone }: { onDone: () => void }) {
  const navigate = useNavigate();
  const auth = getFirebaseAuth();
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    password: "",
    mobile: "",
    category: "Food",
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setCurrentUser(u);
      if (u?.email) {
        setForm((prev) => ({ ...prev, email: u.email || "" }));
      }
    });
    return () => unsub();
  }, [auth]);

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.shopName.trim()) {
      toast.error("Shop name is required.");
      return;
    }
    if (!currentUser && (!form.email.trim() || !form.password)) {
      toast.error("Email and password are required.");
      return;
    }
    if (!currentUser && form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    try {
      const db = getDb();
      const auth = await ensureSessionPersistence();
      let uid = "";
      let email = "";

      if (currentUser) {
        uid = currentUser.uid;
        email = currentUser.email || form.email.trim();

        // Create user profile if it doesn't exist
        const userDocRef = doc(db, COL.users, uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
          await setDoc(userDocRef, {
            uid,
            fullName: form.ownerName || currentUser.displayName || null,
            email,
            mobile: form.mobile || null,
            createdAt: serverTimestamp(),
          });
        }
      } else {
        const cred = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
        uid = cred.user.uid;
        email = cred.user.email || form.email.trim();

        // Create user profile
        await setDoc(doc(db, COL.users, uid), {
          uid,
          fullName: form.ownerName || null,
          email,
          mobile: form.mobile || null,
          createdAt: serverTimestamp(),
        });
      }

      // Create shop
      const shopCode = await pickUniqueShopCode();
      const shopRef = doc(collection(db, COL.shops));
      await setDoc(shopRef, {
        shopCode,
        name: form.shopName.trim(),
        category: form.category || null,
        themeColor: "#10b981",
        logoUrl: null,
        bannerUrl: null,
        address: null,
        phone: form.mobile || null,
        email,
        ownerId: uid,
        createdAt: serverTimestamp(),
      });

      // Owner staff record
      await setDoc(doc(collection(db, COL.staff)), {
        shopId: shopRef.id,
        userId: uid,
        role: "owner",
        fullName: form.ownerName || (currentUser ? currentUser.displayName : null) || null,
        email,
        active: true,
        createdAt: serverTimestamp(),
      });

      // Default free subscription
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      await setDoc(doc(db, COL.subscriptions, shopRef.id), {
        shopId: shopRef.id,
        plan: "free",
        ordersUsedThisMonth: 0,
        renewedAt: serverTimestamp(),
        expiresAt: expires.toISOString(),
      });

      // Per-shop order counter
      await setDoc(doc(db, COL.shopCounters, shopRef.id), { orderNumber: 0 });

      if (currentUser) {
        toast.success(`Shop created! Code: ${shopCode}.`);
        navigate({ to: "/dashboard" });
      } else {
        toast.success(`Shop created! Code: ${shopCode}. Please sign in.`);
        await signOut(auth);
        onDone();
      }
    } catch (err) {
      toast.error(describeAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="border-border/70 bg-background/95 shadow-soft">
      <CardHeader className="space-y-2">
        <div className="inline-flex w-fit rounded-full border border-border/70 bg-muted/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          New shop setup
        </div>
        <CardTitle className="font-display text-2xl">Open your shop</CardTitle>
        <CardDescription>Get your QR portal and dashboard in seconds.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={submit}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Shop name *</Label>
              <Input value={form.shopName} onChange={set("shopName")} required />
            </div>
            <div className="space-y-1.5">
              <Label>Owner name</Label>
              <Input value={form.ownerName} onChange={set("ownerName")} />
            </div>
          </div>
          {currentUser ? (
            <div className="space-y-1.5 rounded-2xl border border-border/70 bg-muted/40 p-3">
              <Label className="text-muted-foreground">Linked Account</Label>
              <div className="text-sm font-medium">{currentUser.email}</div>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={set("email")} required />
              </div>
              <div className="space-y-1.5">
                <Label>Password *</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={set("password")}
                  required
                  minLength={6}
                />
              </div>
            </>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Mobile</Label>
              <Input value={form.mobile} onChange={set("mobile")} />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input value={form.category} onChange={set("category")} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create shop
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
