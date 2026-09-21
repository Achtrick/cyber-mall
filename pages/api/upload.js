import crypto from "crypto";
import multer from "multer";
import nc from "next-connect";
import sharp from "sharp";
import auth from "../../middlewares/admin-auth";
import { rateLimit } from "../../utils/shared/security";
import { saveFile } from "../../utils/shared/storage";

// Only real raster images are accepted. SVG/HTML/etc. are rejected on purpose
// (they can carry scripts). The type is decided from the file's content, never
// from the client supplied mimetype / filename.
const FORMATS = {
  jpeg: { ext: "jpg", mimetype: "image/jpeg" },
  png: { ext: "png", mimetype: "image/png" },
  webp: { ext: "webp", mimetype: "image/webp" },
  gif: { ext: "gif", mimetype: "image/gif" },
  heif: { ext: "avif", mimetype: "image/avif" },
};
const ALLOWED_MIMETYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

// Memory storage: Vercel's filesystem is read-only, files go to Vercel Blob.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024, files: 10, fields: 5, parts: 15 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
      const err = new Error("Only JPEG, PNG, WebP, GIF or AVIF images are allowed");
      err.status = 400;
      return cb(err);
    }
    cb(null, true);
  },
});

const handler = nc({
  onError: (err, req, res) => {
    const known = err?.status === 400 || err?.name === "MulterError";
    if (!known) console.error(err);
    res.status(known ? 400 : 500).json({
      message: known
        ? err.code === "LIMIT_FILE_SIZE"
          ? "Image is too large (4 MB max)"
          : err.message
        : "Upload failed",
    });
  },
});

handler
  .use(auth)
  .use((req, res, next) => {
    if (!rateLimit(req, res, { name: "upload", key: req.auth.userId, max: 60, windowMs: 10 * 60 * 1000 })) return;
    next();
  })
  .use(upload.array("images"))
  .post(async (req, res) => {
    // uploaded files are namespaced with the owner's shop id so a shop can only
    // reference (and later delete) its own files, see cleanImage()
    const owner = req.auth.shopId || "admin";
    // validate every file first so a bad one does not leave partial uploads
    const checked = [];
    for (const file of req.files ?? []) {
      let format;
      try {
        format = (await sharp(file.buffer).metadata()).format;
      } catch (e) {
        format = null;
      }
      const kind = FORMATS[format];
      if (!kind) {
        return res.status(400).json({ message: "Invalid image file" });
      }
      checked.push({ file, kind });
    }

    const files = [];
    for (const [i, { file, kind }] of checked.entries()) {
      const filename = `${owner}-${Date.now()}${i ? "-" + i : ""}-${crypto
        .randomBytes(4)
        .toString("hex")}.${kind.ext}`;
      await saveFile(filename, file.buffer, kind.mimetype);
      files.push({ filename, mimetype: kind.mimetype, size: file.size });
    }
    res.status(200).json(files);
  });

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
