import QRCode from "qrcode";
import { buildShopPortalUrl } from "./shop-code";

export async function generateQrDataUrl(url: string, color = "#0a3d2b"): Promise<string> {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 512,
    color: { dark: color, light: "#ffffff" },
  });
}

export function buildPortalUrl(shopCode: string): string {
  return buildShopPortalUrl(shopCode);
}
