import { doc, getDoc } from "firebase/firestore";
import { getDb, COL } from "./firebase";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing chars

export function getAppBaseUrl(): string {
  const configuredBaseUrl = import.meta.env.VITE_APP_URL?.trim();
  if (configuredBaseUrl) return configuredBaseUrl.replace(/\/+$/, "");
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "";
}

export function buildShopPortalUrl(shopCode: string): string {
  const baseUrl = getAppBaseUrl();
  if (!baseUrl) return `/order/${shopCode}`;
  return `${baseUrl}/order/${shopCode}`;
}

export function generateShopCode(len = 6): string {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

/** Pick a shop code that isn't taken yet. Best-effort uniqueness check. */
export async function pickUniqueShopCode(): Promise<string> {
  const db = getDb();
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateShopCode(6);
    const ref = doc(db, COL.shops, `code_${code}`); // sentinel pattern not used; check by query below
    void ref;
    // Instead of by-id, look up by code field.
    const { query, where, collection, getDocs, limit } = await import("firebase/firestore");
    const snap = await getDocs(
      query(collection(db, COL.shops), where("shopCode", "==", code), limit(1)),
    );
    if (snap.empty) return code;
  }
  // Fall back to longer code.
  return generateShopCode(8);
}

void getDoc;
