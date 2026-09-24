import nc from "next-connect";
import Shop from "../../../models/shop.model";
import connectDB from "../../../utils/connectDB";
import { shopImageUrl } from "../../../utils/shared/shopBrandImages";

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
    res.setHeader("Content-Type", "application/manifest+json");
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    res.status(200).send(
      JSON.stringify({
        short_name: shopNameCap,
        name: shopNameCap,
        // generated at exactly these sizes: browsers reject a manifest icon
        // whose real size differs from `sizes` (the raw logo is ~198x56)
        icons: [
          { src: shopImageUrl(shop, "icon.png"), type: "image/png", sizes: "192x192" },
          { src: shopImageUrl(shop, "icon-512.png"), type: "image/png", sizes: "512x512" },
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
