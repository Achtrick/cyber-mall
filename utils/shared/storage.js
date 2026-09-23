import { del, list, put } from "@vercel/blob";

// All uploads live in Vercel Blob under the "uploads/" prefix.
// The app keeps referring to images by bare filename ("/uploads/<name>" in DB,
// "/api/images/<name>" in the UI), so nothing else needs to change.
const PREFIX = "uploads/";

// A Blob store is either public or private and put() rejects the wrong access
// mode ("Cannot use public access on a private store"). Try one, fall back to
// the other and remember what worked so any store type works without config.
let accessMode = null;
const isAccessModeError = (e) => /access on an? (public|private) store/i.test(e?.message || "");

export const saveFile = async (fileName, buffer, contentType) => {
  const order = accessMode === "private" ? ["private", "public"] : ["public", "private"];
  let lastError;
  for (const access of order) {
    try {
      const blob = await put(PREFIX + fileName, buffer, {
        access,
        contentType,
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      accessMode = access;
      return blob;
    } catch (e) {
      lastError = e;
      if (!isAccessModeError(e)) throw e;
    }
  }
  throw lastError;
};

export const getFileUrl = async (fileName) => {
  const { blobs } = await list({ prefix: PREFIX + fileName, limit: 1 });
  const blob = blobs.find((b) => b.pathname === PREFIX + fileName);
  return blob ? blob.url : null;
};

// Public blob URLs are deterministic (<storeId>.public.blob.vercel-storage.com/<pathname>) and the
// store id is part of the read/write token, so the common case needs no list() call at all.
const getDirectUrl = (fileName) => {
  const storeId = (process.env.BLOB_READ_WRITE_TOKEN || "").split("_")[3];
  if (!storeId) return null;
  return `https://${storeId.toLowerCase()}.public.blob.vercel-storage.com/${PREFIX}${encodeURIComponent(
    fileName
  )}`;
};

export const getFileBuffer = async (fileName) => {
  const directUrl = getDirectUrl(fileName);
  if (directUrl) {
    try {
      const direct = await fetch(directUrl);
      if (direct.ok) return Buffer.from(await direct.arrayBuffer());
    } catch (e) {
      // fall through to the list() based lookup
    }
  }
  const url = await getFileUrl(fileName);
  if (!url) return null;
  let r = await fetch(url);
  if (!r.ok && process.env.BLOB_READ_WRITE_TOKEN) {
    // private stores need the token to read
    r = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
  }
  if (!r.ok) return null;
  return Buffer.from(await r.arrayBuffer());
};

export const removeFile = async (fileName) => {
  try {
    if (!fileName) return;
    const url = await getFileUrl(fileName);
    if (url) await del(url);
  } catch (err) {
    console.error("removeFile failed", err);
  }
};
