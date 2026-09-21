import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Shop from "../../../../models/shop.model";
import connectDB from "../../../../utils/connectDB";
import { resolveShop } from "../../../../utils/shared/auth";
import { cleanImage, fail } from "../../../../utils/shared/security";
import { removeFile } from "../../../../utils/shared/storage";

const handler = nc();

handler.post(auth, async (req, res) => {
  const shopId = resolveShop(req, res, req.body?.shopId);
  if (!shopId) return;

  try {
    await connectDB();
    const shop = await Shop.findOne({ _id: shopId });
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    // must be a file this shop uploaded (or already uses)
    const logo = cleanImage(req.body?.logo, shopId, [shop.logo]);
    if (!logo) return res.status(400).json({ message: "Invalid image" });

    if (logo !== shop.logo) {
      await removeFile((shop.logo || "").split("/").pop());
      shop.logo = logo;
      await shop.save();
    }

    res.status(200).json({ message: "Logo updated" });
  } catch (err) {
    fail(res, err, 400, "Could not update the logo");
  }
});

export default handler;
