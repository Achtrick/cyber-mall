import nc from "next-connect";
import path from "path";
import sharp from "sharp";
import { getFileBuffer } from "../../../utils/shared/storage";

const handler = nc();

handler.get(async (req, res) => {
  const { width, height } = req.query;
  // only a bare file name is ever looked up (no path traversal, no URLs)
  const imgUrl = path.basename(String(req.query.imgUrl ?? ""));
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,150}$/.test(imgUrl)) {
    return res.status(404).end();
  }
  // clamp the requested size so nobody can ask for a huge resize (memory/CPU DoS)
  const clamp = (v) => Math.min(2400, Math.max(1, parseInt(v ?? 500, 10) || 500));

  try {
    const imageBuffer = await getFileBuffer(imgUrl);
    if (!imageBuffer) return res.status(404).end();

    const { data: resizedImageBuffer, info } = await sharp(imageBuffer)
      .resize({
        width: clamp(width),
        height: clamp(height),
        fit: sharp.fit.inside,
      })
      .toBuffer({ resolveWithObject: true });

    // content type comes from the decoded image, never from the requested name
    const contentType =
      { jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", heif: "image/avif" }[
        info.format
      ] || "image/png";

    res.setHeader("Content-Type", contentType);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader(
      "Cache-Control",
      "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400"
    );
    res.status(200).send(resizedImageBuffer);
  } catch (error) {
    console.error(error);
    res.status(404).end();
  }
});

export default handler;
