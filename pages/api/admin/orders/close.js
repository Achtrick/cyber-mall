import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Order from "../../../../models/order.model";
import Product from "../../../../models/product.model";
import connectDB from "../../../../utils/connectDB";

const handler = nc();

handler.put(auth, async (req, res) => {
  await connectDB();
  const { _id, products } = req.body;
  try {
    await Order.findByIdAndUpdate(_id, { state: "CLOSED" });
    for (let p of products) {
      const currentProduct = await Product.findById(p._id);
      const updatedQty = currentProduct.qty - p.qty;
      await Product.findByIdAndUpdate(p._id, {
        qty: updatedQty < 0 ? 0 : updatedQty,
      });
    }

    res.status(200).json({ message: "order closed" });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
