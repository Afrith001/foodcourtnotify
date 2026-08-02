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
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { browserSessionPersistence, getAuth, setPersistence, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
};

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _authPersistenceConfigured = false;

export function getFirebaseApp(): FirebaseApp {
  if (!_app) {
    _app = getApps()[0] ?? initializeApp(firebaseConfig);
  }
  return _app;
}

export async function ensureSessionPersistence(auth?: Auth): Promise<Auth> {
  const targetAuth = auth ?? getFirebaseAuth();
  if (_authPersistenceConfigured || typeof window === "undefined" || !firebaseConfigured) {
    return targetAuth;
  }

  try {
    await setPersistence(targetAuth, browserSessionPersistence);
    _authPersistenceConfigured = true;
  } catch (error) {
    console.warn("[firebase] Could not configure session-based auth persistence:", error);
  }

  return targetAuth;
}

export function getFirebaseAuth(): Auth {
  if (!_auth) _auth = getAuth(getFirebaseApp());
  if (!_authPersistenceConfigured && typeof window !== "undefined" && firebaseConfigured) {
    void ensureSessionPersistence(_auth);
  }
  return _auth;
}

export function getDb(): Firestore {
  if (!_db) _db = getFirestore(getFirebaseApp());
  return _db;
}

/** Firestore collection names — single source of truth. */
export const COL = {
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
  faqs: "faqs",
} as const;
