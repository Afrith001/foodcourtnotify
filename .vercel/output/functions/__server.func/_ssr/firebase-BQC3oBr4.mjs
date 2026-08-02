import { o as getApps, s as initializeApp } from "../_libs/@firebase/app+[...].mjs";
import { N as getFirestore } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { o as setPersistence, r as getAuth, t as browserSessionPersistence } from "../_libs/firebase__auth.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/firebase-BQC3oBr4.js
/**
* Central Firebase initialization.
* All Firebase services (Auth, Firestore, Messaging, Analytics) reuse the
* same FirebaseApp instance created here.
*
* Configure via environment variables in .env (Vite client-side):
*   VITE_FIREBASE_API_KEY
*   VITE_FIREBASE_AUTH_DOMAIN
*   VITE_FIREBASE_PROJECT_ID
*   VITE_FIREBASE_STORAGE_BUCKET
*   VITE_FIREBASE_MESSAGING_SENDER_ID
*   VITE_FIREBASE_APP_ID
*   VITE_FIREBASE_MEASUREMENT_ID
*   VITE_FIREBASE_VAPID_KEY (for FCM)
*/
var firebaseConfig = {
	apiKey: "AIzaSyBcLE70kKib2B2ZjDPVaT7HyPY3wa65nww",
	authDomain: "food-court-notify.firebaseapp.com",
	projectId: "food-court-notify",
	storageBucket: "food-court-notify.firebasestorage.app",
	messagingSenderId: "590207079316",
	appId: "1:590207079316:web:ee9aa51a2e3983e498b581",
	measurementId: "G-PW40XFK4ZW"
};
var firebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
var _app = null;
var _auth = null;
var _db = null;
var _authPersistenceConfigured = false;
function getFirebaseApp() {
	if (!_app) _app = getApps()[0] ?? initializeApp(firebaseConfig);
	return _app;
}
async function ensureSessionPersistence(auth) {
	const targetAuth = auth ?? getFirebaseAuth();
	if (_authPersistenceConfigured || typeof window === "undefined" || !firebaseConfigured) return targetAuth;
	try {
		await setPersistence(targetAuth, browserSessionPersistence);
		_authPersistenceConfigured = true;
	} catch (error) {
		console.warn("[firebase] Could not configure session-based auth persistence:", error);
	}
	return targetAuth;
}
function getFirebaseAuth() {
	if (!_auth) _auth = getAuth(getFirebaseApp());
	if (!_authPersistenceConfigured && typeof window !== "undefined" && firebaseConfigured) ensureSessionPersistence(_auth);
	return _auth;
}
function getDb() {
	if (!_db) _db = getFirestore(getFirebaseApp());
	return _db;
}
/** Firestore collection names — single source of truth. */
var COL = {
	shops: "shops",
	users: "users",
	staff: "staff",
	orders: "orders",
	customers: "customers",
	products: "products",
	categories: "categories",
	businessProfiles: "businessProfiles",
	coupons: "coupons",
	campaigns: "campaigns",
	notifications: "notifications",
	subscriptions: "subscriptions",
	loyaltyRewards: "loyaltyRewards",
	activityLogs: "activityLogs",
	shopCounters: "shopCounters",
	branding: "branding",
	details: "details",
	gallery: "gallery",
	contact: "contact",
	theme: "theme",
	announcements: "announcements",
	reviews: "reviews",
	faqs: "faqs"
};
//#endregion
export { getFirebaseApp as a, getDb as i, ensureSessionPersistence as n, getFirebaseAuth as o, firebaseConfigured as r, COL as t };
