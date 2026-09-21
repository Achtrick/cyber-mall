import nc from "next-connect";
import auth from "../../../middlewares/super-admin-auth";
import Shop from "../../../models/shop.model";
import User from "../../../models/user.model";
import connectDB from "../../../utils/connectDB";
import { fail, num, searchRegexes } from "../../../utils/shared/security";

const handler = nc();

handler.post(auth, async (req, res) => {
  const { searchTerm } = req.body || {};
  const pageNumber = num(req.body?.page, { min: 1, max: 100000, def: 1, int: true });
  const query = {};

  const terms = searchRegexes(searchTerm).map((r) => ({ name: r }));
  if (terms.length) query.$or = terms;

  try {
    await connectDB();
    const shops = await Shop.find(query)
      .sort({ "pack.type": -1 })
      .limit(20)
      .skip((pageNumber - 1) * 20);
    const totalShops = await Shop.countDocuments(query);
    const count = Math.ceil(totalShops / 20);

    const shopsWithUserInfo = [];

    for (const shop of shops) {
      const user = await User.findOne({ shop: shop._id });

      if (user) {
        const shopWithUser = {
          ...shop.toObject(),
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
        };

        shopsWithUserInfo.push(shopWithUser);
      }
    }

    res.status(200).json({ shops: shopsWithUserInfo, count: count });
  } catch (err) {
    return fail(res, err);
  }
});

export default handler;
