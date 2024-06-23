import nc from "next-connect";
import auth from "../../../middlewares/super-admin-auth";
import DomainDemand from "../../../models/domainDemand.model";
import connectDB from "../../../utils/connectDB";

const handler = nc();

handler.post(auth, async (req, res) => {
  const { searchTerm, page } = req.body;
  const query = {};
  if (searchTerm && searchTerm !== "") {
    var blocks = searchTerm.split(" ");
    var terms = await blocks.map((b) => {
      return { userName: { $regex: ".*" + b + ".*", $options: "i" } };
    });
    query.$or = terms;
  }
  try {
    await connectDB();
    const demands = await DomainDemand.find(query)
      .populate({ path: "shop" })
      .sort({ createdAt: -1 })
      .limit(20)
      .skip((page - 1) * 20);
    const totalDemands = await DomainDemand.countDocuments(query);
    const count = Math.ceil(totalDemands / 20);
    res.status(200).json({ demands: demands, count: count });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
