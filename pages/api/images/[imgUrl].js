import fs from "fs";
import nc from "next-connect";
import path from "path";

const handler = nc();

handler.get(async (req, res) => {
  const { imgUrl } = req.query;

  const imagePath = path.join(process.cwd(), "public/uploads", imgUrl);

  try {
    const image = fs.readFileSync(imagePath);
    const imageExtension = path.extname(imagePath).slice(1);
    const contentType = `image/${imageExtension}`;

    res.setHeader("Content-Type", contentType);
    res.status(200).send(image);
  } catch (error) {
    res.status(404).end();
  }
});

export default handler;
