import { ImageResponse } from "next/server";

// Link-preview image and favicon for a shop, generated from its logo.
//
//   /api/og/shop/card.png?logo=<file>&bg=<hex>&name=<shop>  1200x630 og:image
//   /api/og/shop/icon.png?logo=<file>&bg=<hex>&name=<shop>  192x192 favicon
//
// Why this exists: shop logos are stored as uploaded, and the logo uploader
// shrinks them to 198px max (pages/admin/architecture.js), usually as a
// transparent PNG meant to sit on the shop's header color. Used directly as
// og:image that is both too small (WhatsApp/Facebook ignore images under
// ~200px) and, for a white logo, invisible on the white preview card. Used as a
// favicon, a wide transparent logo is an unreadable sliver. Here the logo is
// drawn on an opaque canvas of the shop's header color (the same background it
// sits on in ShopHeader), at a size crawlers accept.
//
// Everything the image depends on is in the URL (the logo file name is unique
// per upload), so a URL always renders the same image and is cached for good.
// Edge runtime because @vercel/og (bundled with Next as ImageResponse) needs it
// in the Pages Router; the logo is read through this app's own /api/images
// route, so only files from our storage can ever be drawn.
export const config = { runtime: "edge" };

// The card's logo box stays inside the central 630x630 square: WhatsApp's small
// preview is a center-cropped square thumbnail of the 1.91:1 image.
const VARIANTS = {
  "card.png": { width: 1200, height: 630, boxW: 600, boxH: 300, fontSize: 96 },
  "icon.png": { width: 192, height: 192, boxW: 168, boxH: 168, fontSize: 120, initial: true },
  // web app manifest icon (installability wants a 512px one)
  "icon-512.png": { width: 512, height: 512, boxW: 448, boxH: 448, fontSize: 320, initial: true },
};
// Logos are ~200px wide; blowing them up much further than this only blurs.
const MAX_UPSCALE = 4;
const FALLBACK_BG = "#1b1622"; // --ink
const NAMED_COLORS = { black: "#000000", white: "#ffffff" };

const LONG_CACHE = "public, max-age=86400, s-maxage=31536000, immutable";
// A logo that failed to load is retried soon instead of caching the fallback.
const SHORT_CACHE = "public, max-age=60, s-maxage=60";

const toHex = (value) => {
  const v = String(value || "").trim().toLowerCase();
  if (NAMED_COLORS[v]) return NAMED_COLORS[v];
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/.exec(v);
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].replace(/./g, "$&$&") : m[1];
  return `#${h}`;
};

// same threshold as utils/config/convertHelper's isColorDark
const isDark = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 < 160;
};

// Natural size of the formats satori can draw (PNG, JPEG, GIF), read from the
// file header. Anything else (WebP, AVIF, ...) returns null and is not drawn.
const imageInfo = (b) => {
  if (b.length > 24 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
    const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
    return { mime: "image/png", width: dv.getUint32(16), height: dv.getUint32(20) };
  }
  if (b.length > 10 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) {
    return { mime: "image/gif", width: b[6] | (b[7] << 8), height: b[8] | (b[9] << 8) };
  }
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let o = 2;
    while (o + 9 < b.length) {
      if (b[o] !== 0xff) return null;
      const marker = b[o + 1];
      const len = (b[o + 2] << 8) | b[o + 3];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return {
          mime: "image/jpeg",
          height: (b[o + 5] << 8) | b[o + 6],
          width: (b[o + 7] << 8) | b[o + 8],
        };
      }
      o += 2 + len;
    }
  }
  return null;
};

const toDataUri = (bytes, mime) => {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return `data:${mime};base64,${btoa(binary)}`;
};

const loadLogo = async (origin, file) => {
  const r = await fetch(`${origin}/api/images/${encodeURIComponent(file)}`);
  if (!r.ok) throw new Error(`logo ${r.status}`);
  const bytes = new Uint8Array(await r.arrayBuffer());
  const info = imageInfo(bytes);
  if (!info || !info.width || !info.height) return null; // not drawable
  return { ...info, src: toDataUri(bytes, info.mime) };
};

export default async function handler(req) {
  const { searchParams, origin, pathname } = new URL(req.url);
  const variant = VARIANTS[pathname.split("/").pop()];
  if (!variant) return new Response("Not found", { status: 404 });

  const file = searchParams.get("logo") || "";
  const logoFile = /^[A-Za-z0-9][A-Za-z0-9._-]{0,150}$/.test(file) ? file : "";
  const rawName = searchParams.get("name") || "";
  const name = /^[A-Za-z0-9 _.-]{1,60}$/.test(rawName) ? rawName : "";
  const bg = toHex(searchParams.get("bg")) || FALLBACK_BG;
  const fg = isDark(bg) ? "#ffffff" : "#000000";

  let logo = null;
  let cache = LONG_CACHE;
  if (logoFile) {
    try {
      logo = await loadLogo(origin, logoFile);
    } catch (e) {
      cache = SHORT_CACHE;
    }
  }

  let content;
  if (logo) {
    const scale = Math.min(
      variant.boxW / logo.width,
      variant.boxH / logo.height,
      MAX_UPSCALE
    );
    content = (
      // satori only understands <img>, next/image does not apply here
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt=""
        src={logo.src}
        width={Math.round(logo.width * scale)}
        height={Math.round(logo.height * scale)}
      />
    );
  } else {
    // no (drawable) logo: the shop's name, or its initial on the small icon
    const label = name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
    const text = variant.initial ? label.charAt(0) : label;
    content = (
      <div
        style={{
          display: "flex",
          color: fg,
          fontSize: text.length > 14 ? variant.fontSize * 0.7 : variant.fontSize,
          padding: "0 60px",
          textAlign: "center",
        }}
      >
        {text}
      </div>
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
        }}
      >
        {content}
      </div>
    ),
    {
      width: variant.width,
      height: variant.height,
      // lowercase: must replace ImageResponse's own "cache-control" default
      // (a differently-cased key would be merged into it, not replace it)
      headers: { "cache-control": cache },
    }
  );
}
