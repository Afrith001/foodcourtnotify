import { M as doc } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { i as getDb, t as COL } from "./firebase-BQC3oBr4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-code-BIK_cGVV.js
var ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function getAppBaseUrl() {
	return "https://foodcourtnotify.vercel.app".trim().replace(/\/+$/, "");
}
function buildShopPortalUrl(shopCode) {
	const baseUrl = getAppBaseUrl();
	if (!baseUrl) return `/order/${shopCode}`;
	return `${baseUrl}/order/${shopCode}`;
}
function generateShopCode(len = 6) {
	let out = "";
	for (let i = 0; i < len; i++) out += ALPHABET[Math.floor(Math.random() * 32)];
	return out;
}
/** Pick a shop code that isn't taken yet. Best-effort uniqueness check. */
async function pickUniqueShopCode() {
	const db = getDb();
	for (let attempt = 0; attempt < 8; attempt++) {
		const code = generateShopCode(6);
		doc(db, COL.shops, `code_${code}`);
		const { query, where, collection, getDocs, limit } = await import("../_libs/firebase.mjs").then((n) => n.t);
		if ((await getDocs(query(collection(db, COL.shops), where("shopCode", "==", code), limit(1)))).empty) return code;
	}
	return generateShopCode(8);
}
//#endregion
export { pickUniqueShopCode as n, buildShopPortalUrl as t };
