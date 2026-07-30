/** Produces consistent, responsive Cloudinary delivery URLs. */
export function optimizedImageUrl(url: string | null | undefined, width = 960, height?: number) {
  if (!url) return "";
  if (!url.includes("cloudinary.com/")) return url;
  const deliveryHost = import.meta.env.VITE_CLOUDINARY_DELIVERY_HOST?.trim();
  const deliveryUrl = deliveryHost ? url.replace(/^https:\/\/res\.cloudinary\.com\/[^/]+/, `https://${deliveryHost}`) : url;
  const dimensions = height ? `w_${width},h_${height},c_fill` : `w_${width},c_limit`;
  return deliveryUrl.replace("/upload/", `/upload/f_auto,q_auto,dpr_auto,${dimensions}/`);
}
