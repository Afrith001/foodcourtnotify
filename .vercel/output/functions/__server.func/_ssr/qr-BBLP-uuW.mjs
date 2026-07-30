import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useShop } from "./useShop-oa7pWA7o.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-ZV2o_Ft7.mjs";
import { t as Button } from "./button-ufo6MiTZ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { H as Printer, Ot as Download, V as QrCode } from "../_libs/lucide-react.mjs";
import { n as generateQrDataUrl, t as buildPortalUrl } from "./qr-DQz9_30d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/qr-BBLP-uuW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QrPage() {
	const { shop } = useShop();
	const [qr, setQr] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!shop) return;
		generateQrDataUrl(buildPortalUrl(shop.shopCode), shop.themeColor).then(setQr);
	}, [shop]);
	if (!shop) return null;
	const download = () => {
		const link = document.createElement("a");
		link.href = qr;
		link.download = `${shop.shopCode}-customer-portal.png`;
		link.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold",
				children: "QR management"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Generate and download QR codes for shop and table access."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "w-4 h-4" }), " Customer portal QR"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Share this QR with customers to track their order status." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [qr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: qr,
						alt: "customer QR",
						className: "h-56 w-56 rounded-xl border border-border object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-56 w-56 animate-pulse rounded-xl bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: download,
							variant: "outline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), "Download"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => toast.success("Printer setup ready"),
							children: [
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-2 h-4 w-4" }),
								" Print"
							]
						})]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Shop details" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: "Shop:"
							}),
							" ",
							shop.name
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: "Shop code:"
							}),
							" ",
							shop.shopCode
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: "Portal URL:"
							}),
							" ",
							buildPortalUrl(shop.shopCode)
						] })
					]
				})]
			})]
		})]
	});
}
//#endregion
export { QrPage as component };
