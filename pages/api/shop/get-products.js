import nc from "next-connect";
import Product from "../../../models/product.model";
import Shop from "../../../models/shop.model";
import connectDB from "../../../utils/connectDB";
import { fail, isObjectId, num, searchRegexes, str } from "../../../utils/shared/security";

const handler = nc();

handler.post(async (req, res) => {
  const { searchTerm, category, page, shopId } = req.body || {};
  if (!isObjectId(shopId)) {
    return res.status(400).json({ message: "Invalid shop" });
  }

  const query = { shop: shopId };
  let sortOrder = { createdAt: -1 };

  const terms = searchRegexes(searchTerm).map((r) => ({ designation: r }));
  if (terms.length) query.$or = terms;

  if (category) {
    if (!isObjectId(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }
    query.category = category;
  }

  const sort = str(req.body?.sort, 20).toLowerCase();
  if (sort === "ascending" || sort === "asc" || sort === "1") sortOrder = { price: 1 };
  else if (sort === "descending" || sort === "desc" || sort === "-1") sortOrder = { price: -1 };

  const pageNumber = num(page, { min: 1, max: 100000, def: 1, int: true });

  try {
    await connectDB();
    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    const products = await Product.find(query, { images: { $slice: 1 } })
      .sort(sortOrder)
      .limit(shop.pack.type === "FREE" ? 10 : 12)
      .skip(shop.pack.type === "FREE" ? 0 : (pageNumber - 1) * 12);
    const totalProducts = await Product.countDocuments(query);
    const count = Math.ceil(totalProducts / 12);
    res.status(200).json({
      products: products,
      count: shop.pack.type === "FREE" ? 1 : count,
    });
  } catch (err) {
    fail(res, err);
  }
});

export default handler;
