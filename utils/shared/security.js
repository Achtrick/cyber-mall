import crypto from "crypto";
import { SITE_URL } from "../config/site";

// ---------------------------------------------------------------------------
// Small, dependency-free helpers shared by the API routes.
// ---------------------------------------------------------------------------

/** True for a 24 char hex string (a valid MongoDB ObjectId as a string). */
export const isObjectId = (v) => typeof v === "string" && /^[a-f\d]{24}$/i.test(v);

/**
 * Coerce untrusted input to a trimmed string (objects/arrays become "").
 * This is what prevents NoSQL operator injection ({"$ne": ...}) in queries.
 */
export const str = (v, max = 255) => {
  if (typeof v === "number" && Number.isFinite(v)) v = String(v);
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
};

/** Coerce to a finite number within [min, max], else return `def`. */
export const num = (v, { min = -Infinity, max = Infinity, def = 0, int = false } = {}) => {
  let n = typeof v === "string" && v.trim() !== "" ? Number(v) : v;
  if (typeof n !== "number" || !Number.isFinite(n)) return def;
  if (int) n = Math.trunc(n);
  return Math.min(max, Math.max(min, n));
};

export const escapeHtml = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);

export const escapeRegex = (v) => String(v ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Removes CR/LF so a value can never inject extra mail headers. */
export const singleLine = (v, max = 200) => str(v, max).replace(/[\r\n]+/g, " ");

export const isEmail = (v) =>
  typeof v === "string" &&
  v.length <= 254 &&
  /^[^\s@<>"'(),;:\\]{1,64}@[^\s@<>"'(),;:\\]{1,255}\.[^\s@<>"'(),;:\\]{2,}$/.test(v);

export const isPassword = (v) =>
  typeof v === "string" && v.length >= 8 && v.length <= 72; // bcrypt ignores > 72 bytes

/** Bare hostname, e.g. "my-shop.com" (no scheme, no path, no port). */
export const isHostname = (v) =>
  typeof v === "string" &&
  v.length <= 253 &&
  /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(v);

/**
 * Keeps user supplied links from being `javascript:` / `data:` URLs.
 * Returns "" for anything that is not http(s) or a bare domain/path.
 */
export const sanitizeUrl = (v, max = 500) => {
  // eslint-disable-next-line no-control-regex
  const s = str(v, max).replace(/[\u0000- \u007f-\u009f]/g, "");
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (/^[a-z][a-z0-9+.-]*:/i.test(s)) return ""; // any other scheme
  if (s.startsWith("//") || s.startsWith("\\")) return "";
  return s;
};

export const sha256 = (v) => crypto.createHash("sha256").update(String(v)).digest("hex");

/** Random URL safe token; only the sha256 of it is ever stored in the DB. */
export const newToken = () => {
  const raw = crypto.randomBytes(32).toString("hex");
  return { raw, hash: sha256(raw) };
};

/**
 * Base URL used in links sent by email. Never derived from the request's Host
 * header in production (host header poisoning would let an attacker get the
 * victim's reset/activation token sent to a domain they control).
 * Backed by utils/config/site.js -- set NEXT_PUBLIC_SITE_URL to change it.
 */
export const getSiteUrl = (req) => {
  if (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL) return SITE_URL;
  if (process.env.NODE_ENV !== "production" && req?.headers?.host) {
    const proto = req.headers["x-forwarded-proto"] || "http";
    return `${proto}://${req.headers.host}`;
  }
  return SITE_URL;
};

// ---------------------------------------------------------------------------
// Errors: never send error objects / stack traces / DB details to the client.
// ---------------------------------------------------------------------------
export const fail = (res, err, status = 400, message = "Request failed") => {
  if (err) console.error(err);
  return res.status(status).json({ message });
};

// ---------------------------------------------------------------------------
// Tiny in-memory rate limiter (per server instance). On serverless (Vercel)
// each warm instance keeps its own counters, so this is a best-effort brake
// against bursts; put Vercel WAF / Upstash in front for hard guarantees.
// ---------------------------------------------------------------------------
const buckets = new Map();

export const getClientIp = (req) => {
  const fwd = req.headers["x-forwarded-for"];
  const ip =
    (typeof fwd === "string" && fwd.split(",")[0].trim()) ||
    (typeof req.headers["x-real-ip"] === "string" && req.headers["x-real-ip"]) ||
    req.socket?.remoteAddress ||
    "unknown";
  return ip;
};

/** Returns true when the request may proceed, else answers 429 and returns false. */
export const rateLimit = (req, res, { name, max, windowMs, key }) => {
  const now = Date.now();
  if (buckets.size > 10000) {
    for (const [k, b] of buckets) if (b.reset <= now) buckets.delete(k);
  }
  const id = `${name}:${key ?? getClientIp(req)}`;
  let bucket = buckets.get(id);
  if (!bucket || bucket.reset <= now) {
    bucket = { count: 0, reset: now + windowMs };
    buckets.set(id, bucket);
  }
  bucket.count += 1;
  if (bucket.count > max) {
    res.setHeader("Retry-After", Math.ceil((bucket.reset - now) / 1000));
    res
      .status(429)
      .json({ message: "Too many requests, please try again later." });
    return false;
  }
  return true;
};

// ---------------------------------------------------------------------------
// Uploaded image references ("/uploads/<file>" strings stored in the DB).
// New uploads are prefixed with the uploading shop's id (see pages/api/upload),
// so a shop can only reference (and later delete) its own files.
// ---------------------------------------------------------------------------
const IMAGE_PATH = /^\/uploads\/[A-Za-z0-9][A-Za-z0-9._-]{0,150}$/;

/**
 * Returns the image path when it may be stored for `shopId`, else null.
 * Allowed: a file this shop already references (`existing`), or a fresh upload
 * carrying the shop's id prefix.
 */
export const cleanImage = (value, shopId, existing = []) => {
  if (typeof value !== "string") return null;
  if (existing.includes(value)) return value;
  if (!IMAGE_PATH.test(value)) return null;
  const file = value.split("/").pop();
  return file.startsWith(`${shopId}-`) ? value : null;
};

export const cleanImages = (values, shopId, existing = [], max = 12) => {
  if (!Array.isArray(values) || values.length > max) return null;
  const out = [];
  for (const v of values) {
    const c = cleanImage(v, shopId, existing);
    if (!c) return null;
    out.push(c);
  }
  return out;
};

/** Escape + cap a search term and turn it into safe case-insensitive regexes. */
export const searchRegexes = (term, max = 10) =>
  str(term, 100)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, max)
    .map((b) => new RegExp(escapeRegex(b), "i"));

export const SHOP_NAME_RESERVED = new Set([
  "api",
  "admin",
  "super-admin",
  "login",
  "register",
  "pricing",
  "contact",
  "forgot-password",
  "reset-password",
  "privacy-policy",
  "condition-of-use",
  "images",
  "uploads",
  "manifests",
  "videos",
  "fonts",
  "static",
  "favicon",
  "robots",
  "sitemap",
  "cyber-mall",
  "cybermall",
]);

/** Hex / rgb(a) / hsl(a) / named CSS colour, else "". */
export const cleanColor = (v) => {
  const s = str(v, 40);
  return /^(#[0-9a-fA-F]{3,8}|[a-zA-Z]{3,25}|(rgb|hsl)a?\([\d\s.,%degturn/]+\))$/.test(s) ? s : "";
};
