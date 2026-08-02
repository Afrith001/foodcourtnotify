import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, limit, query, setDoc, updateDoc, serverTimestamp, where } from "firebase/firestore";
import { getDb, COL } from "@/lib/firebase";
import { useAuth } from "./useAuth";

function normalizeRole(role?: string | null): ShopContext["role"] {
  if (role === "owner" || role === "admin" || role === "cashier" || role === "kitchen") {
    return role;
  }
  return "cashier";
}

export interface ShopContext {
  id: string;
  shopCode: string;
  name: string;
  category: string | null;
  themeColor: string;
  logoUrl: string | null;
  businessName: string | null;
  currency: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  gst: string | null;
  fssai: string | null;
  timezone: string | null;
  role: "owner" | "admin" | "cashier" | "kitchen";
  dailyResetMode: "auto" | "manual";
  lastManualResetAt: Date | null;
}

export interface ShopContextType {
  shop: ShopContext | null;
  loading: boolean;
  error: string | null;
}

const ShopContextObj = createContext<ShopContextType | undefined>(undefined);

export function useShopState(): ShopContextType {
  const { user, loading: authLoading } = useAuth();
  const [shop, setShop] = useState<ShopContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setShop(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const db = getDb();
        let staffSnap = await getDocs(
          query(
            collection(db, COL.staff),
            where("userId", "==", user.uid),
            where("active", "==", true),
            limit(1),
          ),
        );
        if (cancelled) return;

        if (staffSnap.empty && user.email) {
          try {
            const staffEmailSnap = await getDocs(
              query(
                collection(db, COL.staff),
                where("email", "==", user.email),
                where("active", "==", true),
                limit(1),
              ),
            );
            if (cancelled) return;

            if (!staffEmailSnap.empty) {
              const staffDoc = staffEmailSnap.docs[0];
              await updateDoc(doc(db, COL.staff, staffDoc.id), {
                userId: user.uid,
              });

              staffSnap = await getDocs(
                query(
                  collection(db, COL.staff),
                  where("userId", "==", user.uid),
                  where("active", "==", true),
                  limit(1),
                ),
              );
              if (cancelled) return;
            }
          } catch (e) {
            if (import.meta.env.DEV) console.warn("[useShop] Failed to check/link staff by email due to security rules:", e);
          }
        }

        if (staffSnap.empty) {
          let shopsSnap = await getDocs(
            query(
              collection(db, COL.shops),
              where("ownerId", "==", user.uid),
              limit(1),
            ),
          );
          if (cancelled) return;

          if (shopsSnap.empty && user.email) {
            try {
              shopsSnap = await getDocs(
                query(
                  collection(db, COL.shops),
                  where("email", "==", user.email),
                  limit(1),
                ),
              );
            } catch (e) {
              if (import.meta.env.DEV) console.warn("[useShop] Failed to check shops by email due to security rules:", e);
            }
          }
          if (cancelled) return;

          if (!shopsSnap.empty) {
            const shopDoc = shopsSnap.docs[0];
            const shopId = shopDoc.id;

            try {
              if (shopDoc.data().ownerId !== user.uid) {
                await updateDoc(doc(db, COL.shops, shopId), { ownerId: user.uid });
              }
            } catch (e) {
              if (import.meta.env.DEV) console.warn("[useShop] Failed to update shop ownerId due to security rules:", e);
            }

            const userDoc = await getDoc(doc(db, COL.users, user.uid));
            if (cancelled) return;
            const userData = userDoc.exists() ? userDoc.data() : null;
            const fullName = userData?.fullName || user.displayName || "Owner";
            const email = userData?.email || user.email || "";

            const staffRef = doc(collection(db, COL.staff));
            await setDoc(staffRef, {
              shopId,
              userId: user.uid,
              role: "owner",
              fullName,
              email,
              active: true,
              createdAt: serverTimestamp(),
            });

            staffSnap = await getDocs(
              query(
                collection(db, COL.staff),
                where("userId", "==", user.uid),
                where("active", "==", true),
                limit(1),
              ),
            );
            if (cancelled) return;
          }
        }

        if (staffSnap.empty) {
          setShop(null);
          setLoading(false);
          return;
        }

        const staffDoc = staffSnap.docs[0];
        const staff = staffDoc.data() as { shopId: string; role: ShopContext["role"]; active: boolean };

        if (staff.active !== true) {
          setShop(null);
          setLoading(false);
          return;
        }

        const shopDoc = await getDoc(doc(db, COL.shops, staff.shopId));
        if (cancelled) return;

        if (!shopDoc.exists()) {
          setShop(null);
        } else {
          const s = shopDoc.data() as Omit<ShopContext, "id" | "role">;
          const lastManualResetAtValue = s.lastManualResetAt;
          const lastManualResetAt = lastManualResetAtValue
            ? typeof (lastManualResetAtValue as any).toDate === "function"
              ? (lastManualResetAtValue as any).toDate()
              : new Date(lastManualResetAtValue as string)
            : null;

          setShop({
            id: shopDoc.id,
            shopCode: s.shopCode,
            name: s.name,
            category: s.category ?? null,
            themeColor: s.themeColor ?? "#10b981",
            logoUrl: s.logoUrl ?? null,
            businessName: s.businessName ?? null,
            currency: s.currency ?? "INR",
            address: s.address ?? null,
            phone: s.phone ?? null,
            email: s.email ?? null,
            gst: s.gst ?? null,
            fssai: s.fssai ?? null,
            timezone: s.timezone ?? null,
            role: normalizeRole(staff.role),
            dailyResetMode: (s.dailyResetMode as "auto" | "manual") ?? "auto",
            lastManualResetAt,
          });
        }
      } catch (e) {
        if (import.meta.env.DEV) console.error("[useShop] Error in shop context execution:", e);
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return { shop, loading: loading || authLoading, error };
}

export function ShopProvider({ children, value }: { children: React.ReactNode; value: ShopContextType }) {
  return (
    <ShopContextObj.Provider value={value}>
      {children}
    </ShopContextObj.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContextObj);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
