import nc from "next-connect";
import connectDB from "../../../../utils/connectDB";
import Order from "../../../../models/order.model";

const handler = nc();

handler.post(async (req, res) => {
  const { searchTerm, page, shop } = req.body;

  const query = { shop: shop };

  if (searchTerm && searchTerm !== "") {
    var blocks = searchTerm.split(" ");
    var terms = await blocks.map((b) => ({
      $or: [
        { "user.firstName": { $regex: ".*" + b + ".*", $options: "i" } },
        { "user.lastName": { $regex: ".*" + b + ".*", $options: "i" } },
      ],
    }));

    query.$or = terms;
  }

  try {
    await connectDB();

    const orders = await Order.find(query)
      .sort({ state: -1 })
      .limit(20)
      .skip((page - 1) * 20);

    const totalOrders = await Order.countDocuments(query);

    const count = Math.ceil(totalOrders / 20);

    res.status(200).json({ orders: orders, count: count });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
