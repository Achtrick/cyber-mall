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
