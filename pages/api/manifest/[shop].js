import nc from "next-connect";
import Shop from "../../../models/shop.model";
import connectDB from "../../../utils/connectDB";

// Served at /manifests/<shop>.webmanifest (see rewrites in next.config.js).
// Generated on the fly from the DB because Vercel's filesystem is read-only.
const handler = nc();

handler.get(async (req, res) => {
  try {
    await connectDB();
    const name = String(req.query.shop).replace(/\.webmanifest$/, "");
    const shop = await Shop.findOne({ name }).select("name logo domainName settings");
    if (!shop) return res.status(404).end();

    const shopNameCap = shop.name.charAt(0).toUpperCase() + shop.name.slice(1);
    const logo = `/api/images/fill/${(shop.logo || "").split("/").pop()}`;
    res.setHeader("Content-Type", "application/manifest+json");
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    res.status(200).send(
      JSON.stringify({
        short_name: shopNameCap,
        name: shopNameCap,
        icons: [
          { src: logo, sizes: "64x64 32x32 24x24 16x16", type: "image/x-icon" },
          { src: logo, type: "image/png", sizes: "192x192" },
          { src: logo, type: "image/png", sizes: "512x512" },
        ],
        start_url: shop.domainName?.length ? "/" : `/${shop.name}`,
        theme_color: shop.settings?.primaryColor,
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
      })
    );
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

export default handler;
