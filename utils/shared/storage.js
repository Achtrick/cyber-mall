import { del, list, put } from "@vercel/blob";
import fs from "fs";
import path from "path";

// All uploads live in Vercel Blob under the "uploads/" prefix.
// The app keeps referring to images by bare filename ("/uploads/<name>" in DB,
// "/api/images/<name>" in the UI), so nothing else needs to change.
const PREFIX = "uploads/";

export const saveFile = async (fileName, buffer, contentType) =>
  put(PREFIX + fileName, buffer, {
    access: "public",
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });

export const getFileUrl = async (fileName) => {
  const { blobs } = await list({ prefix: PREFIX + fileName, limit: 1 });
  const blob = blobs.find((b) => b.pathname === PREFIX + fileName);
  return blob ? blob.url : null;
};

// Legacy files that were uploaded to the local disk before the move to Blob.
const readLocalFile = (fileName) => {
  try {
    return fs.readFileSync(
      path.join(process.cwd(), "public/uploads", path.basename(fileName))
    );
  } catch (e) {
    return null;
  }
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
  if (!url) return readLocalFile(fileName);
  let r = await fetch(url);
  if (!r.ok && process.env.BLOB_READ_WRITE_TOKEN) {
    // private stores need the token to read
    r = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
  }
  if (!r.ok) return readLocalFile(fileName);
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
