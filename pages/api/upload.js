import crypto from "crypto";
import nc from "next-connect";
import auth from "../../middlewares/admin-auth";
import { detectImageFormat } from "../../utils/shared/imageFormat";
import { rateLimit } from "../../utils/shared/security";
import { saveFile } from "../../utils/shared/storage";

// Vercel caps request bodies at 4.5 MB; stay under that with room to spare.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

// One raw file per request -- no multipart parsing, no multer. The frontend
// (utils/shared/uploadImages.js) posts the file's bytes directly with its
// real Content-Type. Read as a plain Node stream (bodyParser is off below)
// and cap the size manually, the same job multer's `limits.fileSize` did.
const readBody = (req, maxBytes) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    let tooLarge = false;
    req.on("data", (chunk) => {
      total += chunk.length;
      // stop buffering once over the cap (the actual DoS concern), but keep
      // draining the socket so the client still gets a clean JSON response
      // instead of an abrupt connection reset
      if (total > maxBytes) {
        tooLarge = true;
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (tooLarge) {
        const err = new Error("Image is too large (4 MB max)");
        err.status = 400;
        return reject(err);
      }
      resolve(Buffer.concat(chunks));
    });
    req.on("error", reject);
  });

const handler = nc({
  onError: (err, req, res) => {
    const known = err?.status === 400;
    if (!known) console.error(err);
    // storage (Vercel Blob) errors are configuration problems and carry no secrets
    const storage = err?.name === "BlobError" || err?.constructor?.name?.startsWith("Blob");
    res.status(known ? 400 : 500).json({
      message: known
        ? err.message
        : storage
        ? `Storage error: ${String(err.message).slice(0, 200)}`
        : "Upload failed",
    });
  },
});

handler
  .use(auth)
  .use((req, res, next) => {
    if (!rateLimit(req, res, { name: "upload", key: req.auth.userId, max: 120, windowMs: 10 * 60 * 1000 })) return;
    next();
  })
  .post(async (req, res) => {
    const buffer = await readBody(req, MAX_UPLOAD_BYTES);
    if (!buffer.length) {
      return res.status(400).json({ message: "No image received" });
    }

    // the real file type is decided from its content, never from the client
    // supplied Content-Type/filename (blocks SVG/HTML smuggled as images)
    const format = detectImageFormat(buffer);
    if (!format) {
      return res.status(400).json({ message: "Invalid image file" });
    }

    // namespaced by owner so a shop can only reference (and later delete) its own files
    const owner = req.auth.shopId || "admin";
    const filename = `${owner}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${format.ext}`;
    await saveFile(filename, buffer, format.mimetype);

    res.status(200).json({ filename, mimetype: format.mimetype, size: buffer.length });
  });

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
