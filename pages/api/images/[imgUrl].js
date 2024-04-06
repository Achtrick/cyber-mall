import fs from "fs";
import nc from "next-connect";
import path from "path";
import sharp from "sharp";

const handler = nc();

handler.get(async (req, res) => {
  const { imgUrl, width, height } = req.query;

  const imagePath = path.join(process.cwd(), "public/uploads", imgUrl);

  try {
    const imageBuffer = fs.readFileSync(imagePath);

    const resizedImageBuffer = await sharp(imageBuffer)
      .resize({
        width: parseInt(width ?? 500),
        height: parseInt(height ?? 500),
        fit: sharp.fit.inside,
      })
      .toBuffer();

    const imageExtension = path.extname(imagePath).slice(1);
    const contentType = `image/${imageExtension}`;

    res.setHeader("Content-Type", contentType);
    res.status(200).send(resizedImageBuffer);
  } catch (error) {
    console.log(error);
    res.status(404).end();
  }
});

export default handler;
