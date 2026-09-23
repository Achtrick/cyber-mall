import path from "path";
import { contentTypeForExt } from "./imageFormat";
import { getFileBuffer } from "./storage";

// Shared by pages/api/images/[imgUrl].js and pages/api/images/fill/[imgUrl].js.
// Images are served exactly as uploaded, straight from Vercel Blob -- no
// resizing or compositing (that used to be sharp/node-vibrant's job; both
// were removed, see pages/api/upload.js). A ?width=/?height= on the URL, if
// present, is accepted for backward compatibility but ignored.
export const serveImage = async (req, res) => {
  try {
    // only a bare file name is ever looked up (no path traversal, no URLs)
    const imgUrl = path.basename(String(req.query.imgUrl ?? ""));
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,150}$/.test(imgUrl)) {
      return res.status(404).end();
    }

    const buffer = await getFileBuffer(imgUrl);
    if (!buffer) return res.status(404).end();

    const ext = imgUrl.split(".").pop();
    res.setHeader("Content-Type", contentTypeForExt(ext));
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader(
      "Cache-Control",
      "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400"
    );
    res.status(200).send(buffer);
  } catch (error) {
    console.error(error);
    res.status(404).end();
  }
};
