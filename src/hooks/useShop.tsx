import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, limit, query, setDoc, updateDoc, serverTimestamp, where } from "firebase/firestore";
import { getDb, COL } from "@/lib/firebase";
import { useAuth } from "./useAuth";

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
  role: "owner" | "manager" | "cashier" | "staff";
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
        console.log("[useShop Context Debug] user.uid:", user.uid);
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

        console.log("[useShop Context Debug] staff query result (empty?):", staffSnap.empty);

        // Fallback: If no staff found by userId, check by email
        if (staffSnap.empty && user.email) {
          console.log("[useShop Context Debug] No staff found by userId, checking by email:", user.email);
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
              console.log("[useShop Context Debug] Found staff record by email. Linking to userId:", user.uid);
              await updateDoc(doc(db, COL.staff, staffDoc.id), {
                userId: user.uid,
              });

              // Re-query staff by userId
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
            console.warn("[useShop Context Debug] Failed to check/link staff by email due to security rules:", e);
          }
        }

        if (staffSnap.empty) {
          console.log("[useShop Context Debug] No staff document exists for user, checking if they own a shop.");
          // Check shops collection by ownerId
          let shopsSnap = await getDocs(
            query(
              collection(db, COL.shops),
              where("ownerId", "==", user.uid),
              limit(1),
            ),
          );
          if (cancelled) return;

          // Fallback: Check shops collection by email
          if (shopsSnap.empty && user.email) {
            console.log("[useShop Context Debug] No shop found by ownerId, querying by email:", user.email);
            try {
              shopsSnap = await getDocs(
                query(
                  collection(db, COL.shops),
                  where("email", "==", user.email),
                  limit(1),
                ),
              );
            } catch (e) {
              console.warn("[useShop Context Debug] Failed to check shops by email due to security rules:", e);
            }
          }
          if (cancelled) return;

          console.log("[useShop Context Debug] shop query result (empty?):", shopsSnap.empty);

          if (!shopsSnap.empty) {
            const shopDoc = shopsSnap.docs[0];
            const shopId = shopDoc.id;
            console.log("[useShop Context Debug] Found shop to link. shopId:", shopId);

            try {
              // If the shop does not have the current user's UID as ownerId, update it
              if (shopDoc.data().ownerId !== user.uid) {
                console.log("[useShop Context Debug] Updating shop ownerId to current user.uid:", user.uid);
                await updateDoc(doc(db, COL.shops, shopId), { ownerId: user.uid });
              }
            } catch (e) {
              console.warn("[useShop Context Debug] Failed to update shop ownerId due to security rules:", e);
            }

            // Fetch user info for fullName & email
            const userDoc = await getDoc(doc(db, COL.users, user.uid));
            if (cancelled) return;
            const userData = userDoc.exists() ? userDoc.data() : null;
            const fullName = userData?.fullName || user.displayName || "Owner";
            const email = userData?.email || user.email || "";

            // Automatically create missing owner staff record
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
            console.log("[useShop Context Debug] Automatically created missing owner staff record for shopId:", shopId);

            // Re-query staff record by userId
            staffSnap = await getDocs(
              query(
                collection(db, COL.staff),
                where("userId", "==", user.uid),
                where("active", "==", true),
                limit(1),
              ),
            );
            if (cancelled) return;
            console.log("[useShop Context Debug] Re-queried staff empty after repair:", staffSnap.empty);
          }
        }

        if (staffSnap.empty) {
          setShop(null);
          setLoading(false);
          return;
        }

        const staffDoc = staffSnap.docs[0];
        const staff = staffDoc.data() as { shopId: string; role: ShopContext["role"]; active: boolean };
        console.log("[useShop Context Debug] staff doc found. role:", staff.role, "active:", staff.active, "shopId:", staff.shopId);

        if (staff.active !== true) {
          console.warn("[useShop Context Debug] Staff record is inactive.");
          setShop(null);
          setLoading(false);
          return;
        }

        const shopDoc = await getDoc(doc(db, COL.shops, staff.shopId));
        if (cancelled) return;

        console.log("[useShop Context Debug] shop document existence:", shopDoc.exists());

        if (!shopDoc.exists()) {
          console.error("[useShop Context Debug] shopId points to non-existent shop document:", staff.shopId);
          setShop(null);
        } else {
          const s = shopDoc.data() as Omit<ShopContext, "id" | "role">;
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
            role: staff.role,
          });
          console.log("[useShop Context Debug] Shop successfully loaded:", s.name);
        }
      } catch (e) {
        console.error("[useShop Context Debug] Error in useShop Context execution:", e);
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
