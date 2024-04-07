import fs from "fs";
import nextConnect from "next-connect";
import Vibrant from "node-vibrant";
import path from "path";
import sharp from "sharp";
import { deduceColor } from "../../../../utils/config/convertHelper";

const handler = nextConnect();

handler.get(async (req, res) => {
  try {
    const { imgUrl } = req.query;

    const imagePath = path.join(process.cwd(), "public/uploads", imgUrl);
    const imageBuffer = fs.readFileSync(imagePath);

    const resizedImageBuffer = await sharp(imageBuffer)
      .resize({
        width: parseInt(192),
        height: parseInt(192),
        fit: sharp.fit.fill,
      })
      .toBuffer();

    const sharpImage = sharp(resizedImageBuffer);
    const vibrant = await Vibrant.from(resizedImageBuffer).getPalette();
    const mostProminentColor = vibrant.Vibrant
      ? vibrant.Vibrant.getHex()
      : "#ffffff";

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
    res.status(200).send(outputImageBuffer);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default handler;
