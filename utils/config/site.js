// Single source of truth for the site's public URL.
//
// Set NEXT_PUBLIC_SITE_URL in the Vercel project settings (Settings ->
// Environment Variables) to switch domains -- e.g. to
// "https://cyber-mall.tn" once a custom domain is purchased and attached to
// the project. Everything that needs the public URL (meta tags, canonical
// links, footer/legal page links, sitemap/robots.txt, and the emailed
// activation/reset/notification links via getSiteUrl() in
// utils/shared/security.js) picks it up automatically from here. No other
// code changes needed when the domain changes.
//
// NEXT_PUBLIC_ vars are inlined at build time and available both in the
// browser and on the server, so this one value works everywhere.
const DEFAULT_SITE_URL = "https://cyber-mall.vercel.app";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL || // legacy name, still honored if already set
  DEFAULT_SITE_URL
).replace(/\/+$/, "");

export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");

// Open Graph / Twitter card images MUST be absolute URLs -- crawlers (WhatsApp,
// Facebook, Twitter/X) silently drop a relative og:image, which often makes the
// whole preview card fail to render. Every meta image should be passed through
// this helper. Already-absolute URLs are returned unchanged; anything else is
// resolved against SITE_URL (the images themselves are served by this same
// Next.js app regardless of which host the page was requested on, so SITE_URL
// always resolves correctly).
export const absoluteUrl = (path) => {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

// Default link-preview image for the platform's own pages (public/og-image.png:
// the logo on the opaque brand background). The logo files themselves
// (logo-512.png is really a 2000x449 transparent PNG with a white wordmark)
// make poor previews: WhatsApp draws transparency on a white card, so the
// wordmark vanishes, and the wide strip gets center-cropped. Crawlers also
// don't render SVG at all. Keep width/height in sync with the file.
export const DEFAULT_OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Cyber-Mall - Making commerce better for everyone",
};

// Browser tab icon for the platform's own pages. Deliberately NOT in
// pages/_document.js: a global <link rel="icon"> there is emitted on shop pages
// too, and browsers prefer it over the shop's own icon.
export const SITE_ICON = "/images/icon.svg";
