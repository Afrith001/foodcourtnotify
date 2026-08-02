import { collection, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc, where, type DocumentSnapshot, type Firestore } from "firebase/firestore";
import { getDb, COL } from "@/lib/firebase";
import type { Timestamp } from "firebase/firestore";

export const ORDER_ID_PREFIX = "NX";
const ORDER_ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ORDER_ID_RANDOM_LENGTH = 10;

export function normalizeOrderId(value: string) {
  return value.trim().toUpperCase();
}

export function normalizeMobile(value: string) {
  return value.replace(/[^0-9+]/g, "");
}

/** Finds both current orders (where document ID equals public ID) and migrated orders. */
export async function findOrderByPublicId(db: Firestore, shopId: string, publicOrderId: string): Promise<DocumentSnapshot | null> {
  const normalizedOrderId = normalizeOrderId(publicOrderId);
  const direct = await getDoc(doc(db, COL.orders, normalizedOrderId));
  if (direct.exists()) {
    const data = direct.data();
    if (data.shopId === shopId) return direct;
  }

  const byField = await getDocs(query(
    collection(db, COL.orders),
    where("shopId", "==", shopId),
    where("orderId", "==", normalizedOrderId),
    limit(1),
  ));
  if (byField.docs[0]) return byField.docs[0];

  const fallbackMatches = await getDocs(query(
    collection(db, COL.orders),
    where("shopId", "==", shopId),
  ));

  return fallbackMatches.docs.find((docSnap) => {
    const data = docSnap.data();
    const storedOrderId = normalizeOrderId(String(data.orderId ?? ""));
    const documentId = normalizeOrderId(docSnap.id);
    return storedOrderId === normalizedOrderId || documentId === normalizedOrderId;
  }) ?? null;
}

/** Creates an unpredictable customer-facing ID using the Web Crypto API. */
export function generateOrderId() {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Secure random number generation is unavailable.");
  }

  const bytes = new Uint8Array(ORDER_ID_RANDOM_LENGTH);
  globalThis.crypto.getRandomValues(bytes);
  const randomPart = Array.from(bytes, (byte) => ORDER_ID_ALPHABET[byte % ORDER_ID_ALPHABET.length]).join("");
  return `${ORDER_ID_PREFIX}-${randomPart}`;
}

/**
 * Reserves an ID candidate by checking its Firestore document before checkout
 * writes it. A collision automatically receives a new cryptographic ID.
 */
export async function generateUniqueOrderId(db: Firestore, maxAttempts = 10): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const orderId = generateOrderId();
    const existingOrder = await getDoc(doc(db, COL.orders, orderId));
    if (!existingOrder.exists()) return orderId;
  }

  throw new Error("Unable to allocate a unique Order ID. Please try checkout again.");
}

export function isOrderArchived(order: {
  status?: string;
  completedAt?: Timestamp | { toMillis?: () => number } | null;
  archivedAt?: Timestamp | { toMillis?: () => number } | null;
}) {
  if (order.archivedAt) return true;
  if (order.status !== "completed") return false;
  if (!order.completedAt) return false;

  const completedAtMs =
    typeof order.completedAt === "object" && order.completedAt && "toMillis" in order.completedAt
      ? order.completedAt.toMillis?.() ?? 0
      : new Date(order.completedAt as string | number | Date).getTime();

  return Date.now() - completedAtMs >= 30 * 60 * 1000;
}

export async function notifyOrderStatusChange(order: {
  id: string;
  orderId?: string;
  customerName?: string | null;
  customerMobile?: string | null;
}, nextStatus: string, shopId?: string | null) {
  const db = getDb();
  if (!shopId || !order?.id) return;

  try {
    await setDoc(doc(collection(db, COL.notifications)), {
      userId: null,
      shopId,
      title: "Order status updated",
      body: `Order ${order.orderId || order.id} is now ${nextStatus}`,
      type: "order_status",
      orderId: order.orderId || order.id,
      status: nextStatus,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    if (import.meta.env.DEV) console.warn("[order-utils] notification failed", error);
  }

  if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
    new Notification("Order status updated", {
      body: `Order ${order.orderId || order.id} is now ${nextStatus}`,
      tag: order.id,
      data: { orderId: order.orderId || order.id, status: nextStatus },
    });
  }
}
