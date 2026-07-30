import { D as setDoc, M as doc, P as serverTimestamp, S as limit, T as query, b as getDoc, j as collection, k as where, x as getDocs } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { r as getDb, t as COL } from "./firebase-jX9Hxz-N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order-utils-BPm42f6Q.js
var ORDER_ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
var ORDER_ID_RANDOM_LENGTH = 10;
function normalizeOrderId(value) {
	return value.trim().toUpperCase();
}
function normalizeMobile(value) {
	return value.replace(/[^0-9+]/g, "");
}
/** Finds both current orders (where document ID equals public ID) and migrated orders. */
async function findOrderByPublicId(db, shopId, publicOrderId) {
	const normalizedOrderId = normalizeOrderId(publicOrderId);
	const direct = await getDoc(doc(db, COL.orders, normalizedOrderId));
	if (direct.exists()) {
		if (direct.data().shopId === shopId) return direct;
	}
	const byField = await getDocs(query(collection(db, COL.orders), where("shopId", "==", shopId), where("orderId", "==", normalizedOrderId), limit(1)));
	if (byField.docs[0]) return byField.docs[0];
	return (await getDocs(query(collection(db, COL.orders), where("shopId", "==", shopId)))).docs.find((docSnap) => {
		const data = docSnap.data();
		const storedOrderId = normalizeOrderId(String(data.orderId ?? ""));
		const documentId = normalizeOrderId(docSnap.id);
		return storedOrderId === normalizedOrderId || documentId === normalizedOrderId;
	}) ?? null;
}
/** Creates an unpredictable customer-facing ID using the Web Crypto API. */
function generateOrderId() {
	if (!globalThis.crypto?.getRandomValues) throw new Error("Secure random number generation is unavailable.");
	const bytes = new Uint8Array(ORDER_ID_RANDOM_LENGTH);
	globalThis.crypto.getRandomValues(bytes);
	return `NX-${Array.from(bytes, (byte) => ORDER_ID_ALPHABET[byte % 32]).join("")}`;
}
/**
* Reserves an ID candidate by checking its Firestore document before checkout
* writes it. A collision automatically receives a new cryptographic ID.
*/
async function generateUniqueOrderId(db, maxAttempts = 10) {
	for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
		const orderId = generateOrderId();
		if (!(await getDoc(doc(db, COL.orders, orderId))).exists()) return orderId;
	}
	throw new Error("Unable to allocate a unique Order ID. Please try checkout again.");
}
function isOrderArchived(order) {
	if (order.archivedAt) return true;
	if (order.status !== "completed") return false;
	if (!order.completedAt) return false;
	const completedAtMs = typeof order.completedAt === "object" && order.completedAt && "toMillis" in order.completedAt ? order.completedAt.toMillis?.() ?? 0 : new Date(order.completedAt).getTime();
	return Date.now() - completedAtMs >= 1800 * 1e3;
}
async function notifyOrderStatusChange(order, nextStatus, shopId) {
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
			createdAt: serverTimestamp()
		});
	} catch (error) {
		console.warn("[order-utils] notification failed", error);
	}
	if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") new Notification("Order status updated", {
		body: `Order ${order.orderId || order.id} is now ${nextStatus}`,
		tag: order.id,
		data: {
			orderId: order.orderId || order.id,
			status: nextStatus
		}
	});
}
//#endregion
export { normalizeOrderId as a, normalizeMobile as i, generateUniqueOrderId as n, notifyOrderStatusChange as o, isOrderArchived as r, findOrderByPublicId as t };
