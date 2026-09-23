// Minimal, dependency-free image-type detection from magic bytes, plus the
// matching extension/content-type. Written by hand so the upload/serving
// routes don't need multer (multipart parsing) or sharp (image decoding)
// just to confirm a file really is an image.
export const IMAGE_FORMATS = [
  {
    ext: "jpg",
    mimetype: "image/jpeg",
    test: (b) => b.length > 2 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    ext: "png",
    mimetype: "image/png",
    test: (b) =>
      b.length > 7 &&
      b[0] === 0x89 &&
      b[1] === 0x50 &&
      b[2] === 0x4e &&
      b[3] === 0x47 &&
      b[4] === 0x0d &&
      b[5] === 0x0a &&
      b[6] === 0x1a &&
      b[7] === 0x0a,
  },
  {
    ext: "gif",
    mimetype: "image/gif",
    test: (b) => b.length > 5 && /^GIF8[79]a$/.test(b.toString("latin1", 0, 6)),
  },
  {
    ext: "webp",
    mimetype: "image/webp",
    test: (b) =>
      b.length > 11 &&
      b.toString("latin1", 0, 4) === "RIFF" &&
      b.toString("latin1", 8, 12) === "WEBP",
  },
  {
    ext: "avif",
    mimetype: "image/avif",
    // AVIF is an ISO-BMFF box format: a "ftyp" box near the start, whose
    // brand list contains "avif"/"avis" (not always at a fixed offset).
    test: (b) => {
      if (b.length < 12 || b.toString("latin1", 4, 8) !== "ftyp") return false;
      return /av[io][fs]/.test(b.toString("latin1", 0, Math.min(b.length, 32)));
    },
  },
];

/** Real format from file content, or null if it isn't a recognized raster image. */
export const detectImageFormat = (buffer) =>
  IMAGE_FORMATS.find((f) => {
    try {
      return f.test(buffer);
    } catch (e) {
      return false;
    }
  }) || null;

/** Content-Type for a (trusted -- we chose it at upload time) file extension. */
export const contentTypeForExt = (ext) =>
  IMAGE_FORMATS.find((f) => f.ext === String(ext).toLowerCase())?.mimetype ||
  "application/octet-stream";
