import { o as __toESM } from "../_runtime.mjs";
import { D as setDoc, M as doc, O as updateDoc, P as serverTimestamp, S as limit, T as query, b as getDoc, j as collection, k as where, x as getDocs } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { r as onAuthStateChanged } from "../_libs/firebase__auth.mjs";
import { a as getFirebaseAuth, r as getDb, t as COL } from "./firebase-jX9Hxz-N.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useShop-oa7pWA7o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useAuth() {
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const unsub = onAuthStateChanged(getFirebaseAuth(), (u) => {
			setUser(u);
			setLoading(false);
		});
		return () => unsub();
	}, []);
	return {
		user,
		loading
	};
}
var ShopContextObj = (0, import_react.createContext)(void 0);
function useShopState() {
	const { user, loading: authLoading } = useAuth();
	const [shop, setShop] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
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
				let staffSnap = await getDocs(query(collection(db, COL.staff), where("userId", "==", user.uid), where("active", "==", true), limit(1)));
				if (cancelled) return;
				console.log("[useShop Context Debug] staff query result (empty?):", staffSnap.empty);
				if (staffSnap.empty && user.email) {
					console.log("[useShop Context Debug] No staff found by userId, checking by email:", user.email);
					try {
						const staffEmailSnap = await getDocs(query(collection(db, COL.staff), where("email", "==", user.email), where("active", "==", true), limit(1)));
						if (cancelled) return;
						if (!staffEmailSnap.empty) {
							const staffDoc = staffEmailSnap.docs[0];
							console.log("[useShop Context Debug] Found staff record by email. Linking to userId:", user.uid);
							await updateDoc(doc(db, COL.staff, staffDoc.id), { userId: user.uid });
							staffSnap = await getDocs(query(collection(db, COL.staff), where("userId", "==", user.uid), where("active", "==", true), limit(1)));
							if (cancelled) return;
						}
					} catch (e) {
						console.warn("[useShop Context Debug] Failed to check/link staff by email due to security rules:", e);
					}
				}
				if (staffSnap.empty) {
					console.log("[useShop Context Debug] No staff document exists for user, checking if they own a shop.");
					let shopsSnap = await getDocs(query(collection(db, COL.shops), where("ownerId", "==", user.uid), limit(1)));
					if (cancelled) return;
					if (shopsSnap.empty && user.email) {
						console.log("[useShop Context Debug] No shop found by ownerId, querying by email:", user.email);
						try {
							shopsSnap = await getDocs(query(collection(db, COL.shops), where("email", "==", user.email), limit(1)));
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
							if (shopDoc.data().ownerId !== user.uid) {
								console.log("[useShop Context Debug] Updating shop ownerId to current user.uid:", user.uid);
								await updateDoc(doc(db, COL.shops, shopId), { ownerId: user.uid });
							}
						} catch (e) {
							console.warn("[useShop Context Debug] Failed to update shop ownerId due to security rules:", e);
						}
						const userDoc = await getDoc(doc(db, COL.users, user.uid));
						if (cancelled) return;
						const userData = userDoc.exists() ? userDoc.data() : null;
						const fullName = userData?.fullName || user.displayName || "Owner";
						const email = userData?.email || user.email || "";
						await setDoc(doc(collection(db, COL.staff)), {
							shopId,
							userId: user.uid,
							role: "owner",
							fullName,
							email,
							active: true,
							createdAt: serverTimestamp()
						});
						console.log("[useShop Context Debug] Automatically created missing owner staff record for shopId:", shopId);
						staffSnap = await getDocs(query(collection(db, COL.staff), where("userId", "==", user.uid), where("active", "==", true), limit(1)));
						if (cancelled) return;
						console.log("[useShop Context Debug] Re-queried staff empty after repair:", staffSnap.empty);
					}
				}
				if (staffSnap.empty) {
					setShop(null);
					setLoading(false);
					return;
				}
				const staff = staffSnap.docs[0].data();
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
					const s = shopDoc.data();
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
						role: staff.role
					});
					console.log("[useShop Context Debug] Shop successfully loaded:", s.name);
				}
			} catch (e) {
				console.error("[useShop Context Debug] Error in useShop Context execution:", e);
				if (!cancelled) setError(e.message);
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [user, authLoading]);
	return {
		shop,
		loading: loading || authLoading,
		error
	};
}
function ShopProvider({ children, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopContextObj.Provider, {
		value,
		children
	});
}
function useShop() {
	const context = (0, import_react.useContext)(ShopContextObj);
	if (context === void 0) throw new Error("useShop must be used within a ShopProvider");
	return context;
}
//#endregion
export { useShopState as i, useAuth as n, useShop as r, ShopProvider as t };
