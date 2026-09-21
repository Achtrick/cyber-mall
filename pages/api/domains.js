import nc from "next-connect";
import Shop from "../../models/shop.model";
import connectDB from "../../utils/connectDB";

// Custom domain -> shop mapping, consumed by middleware.js (replaces the
// public/domainNames/domainNames.json file, which can't be written on Vercel).
const handler = nc();

handler.get(async (req, res) => {
  try {
    await connectDB();
    const shops = await Shop.find({ domainName: { $exists: true, $ne: "" } })
      .select("name domainName")
      .lean();
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).json(shops.map((s) => ({ shop: s.name, domain: s.domainName })));
  } catch (err) {
    console.error(err);
    res.status(200).json([]);
  }
});

export default handler;
