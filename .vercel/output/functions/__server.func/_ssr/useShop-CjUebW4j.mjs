import { o as __toESM } from "../_runtime.mjs";
import { D as setDoc, M as doc, O as updateDoc, P as serverTimestamp, S as limit, T as query, b as getDoc, j as collection, k as where, x as getDocs } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { i as onAuthStateChanged } from "../_libs/firebase__auth.mjs";
import { i as getDb, o as getFirebaseAuth, t as COL } from "./firebase-BQC3oBr4.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useShop-CjUebW4j.js
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
function normalizeRole(role) {
	if (role === "owner" || role === "admin" || role === "cashier" || role === "kitchen") return role;
	return "cashier";
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
				const db = getDb();
				let staffSnap = await getDocs(query(collection(db, COL.staff), where("userId", "==", user.uid), where("active", "==", true), limit(1)));
				if (cancelled) return;
				if (staffSnap.empty && user.email) try {
					const staffEmailSnap = await getDocs(query(collection(db, COL.staff), where("email", "==", user.email), where("active", "==", true), limit(1)));
					if (cancelled) return;
					if (!staffEmailSnap.empty) {
						const staffDoc = staffEmailSnap.docs[0];
						await updateDoc(doc(db, COL.staff, staffDoc.id), { userId: user.uid });
						staffSnap = await getDocs(query(collection(db, COL.staff), where("userId", "==", user.uid), where("active", "==", true), limit(1)));
						if (cancelled) return;
					}
				} catch (e) {}
				if (staffSnap.empty) {
					let shopsSnap = await getDocs(query(collection(db, COL.shops), where("ownerId", "==", user.uid), limit(1)));
					if (cancelled) return;
					if (shopsSnap.empty && user.email) try {
						shopsSnap = await getDocs(query(collection(db, COL.shops), where("email", "==", user.email), limit(1)));
					} catch (e) {}
					if (cancelled) return;
					if (!shopsSnap.empty) {
						const shopDoc = shopsSnap.docs[0];
						const shopId = shopDoc.id;
						try {
							if (shopDoc.data().ownerId !== user.uid) await updateDoc(doc(db, COL.shops, shopId), { ownerId: user.uid });
						} catch (e) {}
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
						staffSnap = await getDocs(query(collection(db, COL.staff), where("userId", "==", user.uid), where("active", "==", true), limit(1)));
						if (cancelled) return;
					}
				}
				if (staffSnap.empty) {
					setShop(null);
					setLoading(false);
					return;
				}
				const staff = staffSnap.docs[0].data();
				if (staff.active !== true) {
					setShop(null);
					setLoading(false);
					return;
				}
				const shopDoc = await getDoc(doc(db, COL.shops, staff.shopId));
				if (cancelled) return;
				if (!shopDoc.exists()) setShop(null);
				else {
					const s = shopDoc.data();
					const lastManualResetAtValue = s.lastManualResetAt;
					const lastManualResetAt = lastManualResetAtValue ? typeof lastManualResetAtValue.toDate === "function" ? lastManualResetAtValue.toDate() : new Date(lastManualResetAtValue) : null;
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
						dailyResetMode: s.dailyResetMode ?? "auto",
						lastManualResetAt
					});
				}
			} catch (e) {
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
