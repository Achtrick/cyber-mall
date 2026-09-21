import nextConnect from "next-connect";
import Vibrant from "node-vibrant";
import path from "path";
import sharp from "sharp";
import { getFileBuffer } from "../../../../utils/shared/storage";
import { deduceColor } from "../../../../utils/config/convertHelper";

const handler = nextConnect();

handler.get(async (req, res) => {
  try {
    const imgUrl = path.basename(String(req.query.imgUrl ?? ""));
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,150}$/.test(imgUrl)) {
      return res.status(404).end();
    }

    const imageBuffer = await getFileBuffer(imgUrl);
    if (!imageBuffer) return res.status(404).end();

    const resizedImageBuffer = await sharp(imageBuffer)
      .resize({
        width: parseInt(192),
        height: parseInt(192),
        fit: sharp.fit.fill,
      })
      .png() // node-vibrant (jimp) cannot decode WebP/AVIF, always hand it a PNG
      .toBuffer();

    const sharpImage = sharp(resizedImageBuffer);
    let mostProminentColor = "#ffffff";
    try {
      const vibrant = await Vibrant.from(resizedImageBuffer).getPalette();
      if (vibrant.Vibrant) mostProminentColor = vibrant.Vibrant.getHex();
    } catch (e) {
      // keep the default colour
    }

    const outputImageBuffer = await sharpImage
      .extend({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .flatten({ background: deduceColor(mostProminentColor) })
      .composite([
        {
          input: Buffer.from(
            `<svg><rect x="0" y="0" width="192" height="192" rx="15" ry="15" fill="${deduceColor(
              mostProminentColor
            )}"/></svg>`
          ),
          blend: "dest-in",
        },
      ])
      .toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader(
      "Cache-Control",
      "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400"
    );
    res.status(200).send(outputImageBuffer);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default handler;
