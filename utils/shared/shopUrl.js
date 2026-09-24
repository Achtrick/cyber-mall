// A shop is reachable two ways once it has a custom domain connected: through
// that domain (middleware.js rewrites it server-side to /<shop>/... without
// the prefix ever appearing in the browser's URL) AND still directly at
// /<shop>/... on the platform's own domain (e.g. before DNS propagates, or
// when browsing the platform itself). Every in-app link has to match
// whichever one the visitor is actually on right now, or it 404s.
//
// shopInfo.domainName only says a domain is *connected* -- it says nothing
// about how THIS request arrived, so it must never gate link-building on its
// own (that was the bug: a shop with a domain connected always generated
// bare paths, breaking every link when the very same shop was viewed at
// /<shop>/...). The live path is the only reliable signal: if the current
// page's path starts with /<shop>, keep that prefix; otherwise the request
// already arrived without it (the custom-domain case), so don't add one.

/** True if `asPath` (router.asPath / the browser's current path) is under /<shopName>. */
export const isShopPrefixed = (shopName, asPath) => {
  const path = String(asPath ?? "").split("?")[0];
  return path === `/${shopName}` || path.startsWith(`/${shopName}/`);
};

/**
 * Builds an href for a shop-relative path, prefixed with /<shopName> only
 * when the current page itself is being viewed that way.
 * `barePath` is the path as it would appear on a connected custom domain,
 * e.g. "/", "/products", "/cart", "/blue-mug-123".
 */
export const shopPath = (shopInfo, asPath, barePath = "/") => {
  if (!isShopPrefixed(shopInfo?.name, asPath)) return barePath;
  return barePath === "/" ? `/${shopInfo.name}` : `/${shopInfo.name}${barePath}`;
};
