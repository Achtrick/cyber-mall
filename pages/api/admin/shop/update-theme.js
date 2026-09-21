import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Shop from "../../../../models/shop.model";
import connectDB from "../../../../utils/connectDB";
import { resolveShop } from "../../../../utils/shared/auth";
import { cleanColor, fail } from "../../../../utils/shared/security";

const handler = nc();

const COLOR_KEYS = ["headerColor", "footerColor", "primaryColor", "secondaryColor"];

handler.post(auth, async (req, res) => {
  const data = req.body || {};
  const shopId = resolveShop(req, res, data.shopId);
  if (!shopId) return;

  try {
    await connectDB();
    const shop = await Shop.findOne({ _id: shopId });
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    // only the four known colour keys, each validated as a CSS colour
    const settings = { ...(shop.settings || {}) };
    for (const key of COLOR_KEYS) {
      const value = data.settings?.[key];
      if (value === undefined || value === null || value === "") continue;
      const color = cleanColor(value);
      if (!color) return res.status(400).json({ message: "Invalid color" });
      settings[key] = color;
    }
    shop.settings = settings;
    await shop.save();

    res.status(200).json({ message: "Theme updated" });
  } catch (err) {
    fail(res, err, 400, "Could not update the theme");
  }
});

export default handler;
