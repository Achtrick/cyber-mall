import ProductCategory from "../../models/productCategory.model";
import { cleanImage, isObjectId, num, sanitizeUrl, str } from "./security";

// Validators for the shop "architecture" (storefront layout) an admin can save.
// Every component is rebuilt from whitelisted, typed fields so nothing else can
// be stored, and user supplied links can never be javascript:/data: URLs.

const PLACEHOLDER = "slider-placeholder.jpg";

const bool = (v, def = true) => (typeof v === "boolean" ? v : def);

// the admin UI stores the select value either as a number or a numeric string
const index = (v) =>
  typeof v === "string" && /^\d{1,2}$/.test(v) ? v : num(v, { min: 0, max: 99, int: true });

const image = (value, shopId, existing) =>
  value === PLACEHOLDER ? value : cleanImage(value, shopId, existing);

/** Returns the cleaned value, or null when the input is invalid. */
export const cleanComponent = async (component, body, shop) => {
  const shopId = String(shop._id);
  const home = shop.architecture?.home || {};

  switch (component) {
    case "sliderComponent": {
      if (!Array.isArray(body) || body.length > 20) return null;
      const existing = (home.sliderComponent || []).map((s) => s.image);
      const out = [];
      for (const s of body) {
        const img = image(s?.image, shopId, existing);
        if (!img) return null;
        out.push({
          image: img,
          link: sanitizeUrl(s.link),
          category: str(s.category, 100),
        });
      }
      return out;
    }
    case "categoriesComponent": {
      if (!body || typeof body !== "object") return null;
      const ids = Array.isArray(body.selectedCategoriesIds)
        ? body.selectedCategoriesIds.slice(0, 200).map((i) => (isObjectId(String(i)) ? String(i) : null))
        : [];
      if (ids.includes(null)) return null;
      // only categories of this shop can be selected
      const owned = ids.length
        ? (await ProductCategory.find({ _id: { $in: ids }, shop: shopId }).select("_id").lean()).map((c) => String(c._id))
        : [];
      return {
        visibleIndex: index(body.visibleIndex),
        visible: bool(body.visible),
        selectedCategoriesIds: ids.filter((i) => owned.includes(i)),
      };
    }
    case "discountComponent": {
      if (!body || typeof body !== "object") return null;
      return { visibleIndex: index(body.visibleIndex), visible: bool(body.visible) };
    }
    case "galleryComponent": {
      if (!body || typeof body !== "object" || !Array.isArray(body.content) || body.content.length > 40) {
        return null;
      }
      const existing = (home.galleryComponent?.content || []).map((s) => s.image);
      const content = [];
      for (const item of body.content) {
        const img = image(item?.image, shopId, existing);
        if (!img) return null;
        content.push({
          image: img,
          link: sanitizeUrl(item.link),
          text: str(item.text, 300),
          category: str(item.category, 100),
        });
      }
      return {
        visibleIndex: index(body.visibleIndex),
        visible: bool(body.visible),
        content,
      };
    }
    case "shippingFee": {
      if (!body || typeof body !== "object") return null;
      return {
        shippingFee: num(body.shippingFee, { min: 0, max: 1e6 }),
        freeShipping: num(body.freeShipping, { min: 0, max: 1e9 }),
      };
    }
    case "contactComponent": {
      if (!body || typeof body !== "object") return null;
      const socials = body.socials || {};
      const direct = body.direct || {};
      return {
        address: str(body.address, 300),
        socials: {
          instagram: sanitizeUrl(socials.instagram),
          tiktok: sanitizeUrl(socials.tiktok),
          facebook: sanitizeUrl(socials.facebook),
          youtube: sanitizeUrl(socials.youtube),
          linkedIn: sanitizeUrl(socials.linkedIn),
        },
        direct: { email: str(direct.email, 254), phone: str(direct.phone, 30) },
      };
    }
    case "aboutComponent":
      return typeof body === "string" ? body.slice(0, 5000) : null;
    default:
      return null;
  }
};
