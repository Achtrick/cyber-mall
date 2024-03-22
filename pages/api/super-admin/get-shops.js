import nc from "next-connect";
import Shop from "../../../models/shop.model";
import connectDB from "../../../utils/connectDB";
import auth from "../../../middlewares/super-admin-auth";

const handler = nc();

handler.post(auth, async (req, res) => {
  const { searchTerm, page } = req.body;
  const query = {};
  if (searchTerm && searchTerm !== "") {
    var blocks = searchTerm.split(" ");
    var terms = await blocks.map((b) => {
      return { name: { $regex: ".*" + b + ".*", $options: "i" } };
    });
    query.$or = terms;
  }
  try {
    await connectDB();
    const shops = await Shop.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .skip((page - 1) * 20);
    const totalShops = await Shop.countDocuments(query);
    const count = Math.ceil(totalShops / 20);
    res.status(200).json({ shops: shops, count: count });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
