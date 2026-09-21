import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import Order from "../../../../models/order.model";
import Product from "../../../../models/product.model";
import connectDB from "../../../../utils/connectDB";
import { ownsShop } from "../../../../utils/shared/auth";
import { fail, isObjectId } from "../../../../utils/shared/security";

const handler = nc();

handler.put(auth, async (req, res) => {
  const _id = req.body?._id;
  if (!isObjectId(_id)) {
    return res.status(400).json({ message: "Invalid order" });
  }
  try {
    await connectDB();
    const order = await Order.findById(_id);
    // same answer for "missing" and "not yours" (no id probing)
    if (!order || !ownsShop(req, order.shop)) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.state === "CLOSED") {
      return res.status(400).json({ message: "Order already closed" });
    }

    order.state = "CLOSED";
    await order.save();

    // stock is decremented from the stored order, never from client supplied
    // product ids/quantities, and only for products of the same shop
    for (let p of order.products) {
      const currentProduct = await Product.findOne({ _id: p._id, shop: order.shop });
      if (!currentProduct) continue;
      const updatedQty = currentProduct.qty - p.qty;
      await Product.findByIdAndUpdate(currentProduct._id, {
        qty: updatedQty < 0 ? 0 : updatedQty,
      });
    }

    res.status(200).json({ message: "Order closed" });
  } catch (err) {
    fail(res, err, 400, "Could not close the order");
  }
});

export default handler;
