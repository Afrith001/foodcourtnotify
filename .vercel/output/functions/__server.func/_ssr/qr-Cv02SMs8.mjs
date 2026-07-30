import { o as __toESM } from "../_runtime.mjs";
import { t as buildShopPortalUrl } from "./shop-code-DdMqYUoH.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/qr-Cv02SMs8.js
var import_lib = /* @__PURE__ */ __toESM(require_lib());
async function generateQrDataUrl(url, color = "#0a3d2b") {
	return import_lib.toDataURL(url, {
		errorCorrectionLevel: "H",
		margin: 1,
		width: 512,
		color: {
			dark: color,
			light: "#ffffff"
		}
	});
}
function buildPortalUrl(shopCode) {
	return buildShopPortalUrl(shopCode);
}
//#endregion
export { generateQrDataUrl as n, buildPortalUrl as t };
