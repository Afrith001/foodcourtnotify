//#region node_modules/.nitro/vite/services/ssr/assets/images-BnAPhdvv.js
/** Produces consistent, responsive Cloudinary delivery URLs. */
function optimizedImageUrl(url, width = 960, height) {
	if (!url) return "";
	if (!url.includes("cloudinary.com/")) return url;
	const deliveryUrl = url;
	const dimensions = height ? `w_${width},h_${height},c_fill` : `w_${width},c_limit`;
	return deliveryUrl.replace("/upload/", `/upload/f_auto,q_auto,dpr_auto,${dimensions}/`);
}
//#endregion
export { optimizedImageUrl as t };
