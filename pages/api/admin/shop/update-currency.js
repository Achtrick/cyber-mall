import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Shop from "../../../../models/shop.model";
import connectDB from "../../../../utils/connectDB";
import { resolveShop } from "../../../../utils/shared/auth";
import { fail, str } from "../../../../utils/shared/security";

const handler = nc();

handler.post(auth, async (req, res) => {
  const shopId = resolveShop(req, res, req.body?.shopId);
  if (!shopId) return;
  const currency = str(req.body?.currency, 10);

  try {
    await connectDB();
    const shop = await Shop.findOne({ _id: shopId });
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    shop.currency = currency;
    await shop.save();

    res.status(200).json({ message: "Currency updated", shopInfo: shop });
  } catch (err) {
    fail(res, err, 400, "Could not update the currency");
  }
});

export default handler;
