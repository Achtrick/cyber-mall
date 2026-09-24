// URLs of a shop's generated images (pages/api/og/shop/[variant].js): the logo
// drawn on the shop's header color at an exact size. Shared by the page <head>
// (components/shop/ShopLayout.js) and the web app manifest
// (pages/api/manifest/[shop].js) so both always point at the same image.
//
// Variants: "card.png" 1200x630 link preview, "icon.png" 192x192,
// "icon-512.png" 512x512.

export const shopLogoFile = (shop) => (shop?.logo || "").split("/").pop();

/** The generator can only draw PNG/JPEG/GIF logos (the uploader saves PNG);
 * older WebP/AVIF logos come out as the shop's initial instead. */
export const isDrawableLogo = (file) => /\.(png|jpe?g|gif)$/i.test(file || "");

export const shopImageUrl = (shop, variant) => {
  const logo = shopLogoFile(shop);
  const query = new URLSearchParams({
    ...(logo ? { logo } : {}),
    bg: String(shop?.settings?.headerColor || "").replace(/^#/, ""),
    name: shop?.name || "",
  }).toString();
  return `/api/og/shop/${variant}?${query}`;
};
