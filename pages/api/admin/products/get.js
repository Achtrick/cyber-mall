import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Product from "../../../../models/product.model";
import connectDB from "../../../../utils/connectDB";

const handler = nc();

handler.post(auth, async (req, res) => {
  const { searchTerm, page, shop } = req.body;
  const query = { shop: shop };
  if (searchTerm && searchTerm !== "") {
    var blocks = searchTerm.split(" ");
    var terms = await blocks.map((b) => {
      return { designation: { $regex: ".*" + b + ".*", $options: "i" } };
    });
    query.$or = terms;
  }
  try {
    await connectDB();
    const products = await Product.find(query)
      .sort({ qty: 1 })
      .sort({ createdAt: -1 })
      .limit(20)
      .skip((page - 1) * 20);
    const totalProducts = await Product.countDocuments(query);
    const count = Math.ceil(totalProducts / 20);
    res.status(200).json({ products: products, count: count });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
