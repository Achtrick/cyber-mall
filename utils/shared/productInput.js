import ProductCategory from "../../models/productCategory.model";
import { cleanImages, isObjectId, num, str } from "./security";

/**
 * Validates and normalises the product fields an admin may set. `existing` is
 * the product's current images (when updating). Returns { value } or { error }.
 */
export const cleanProduct = async (data, shopId, existingImages = []) => {
  const designation = str(data.designation, 200);
  if (!designation) return { error: "Product name is required" };

  const value = {
    designation,
    slug: str(data.slug, 260),
    description: str(data.description, 5000),
    price: num(data.price, { min: 0, max: 1e9 }),
    discount: num(data.discount, { min: 0, max: 100 }),
    qty: num(data.qty, { min: 0, max: 1e7, int: true }),
    variants: Array.isArray(data.variants)
      ? data.variants.slice(0, 30).map((v) => str(v, 100)).filter(Boolean)
      : [],
  };

  const categoryId =
    data.category && typeof data.category === "object" ? data.category._id : data.category;
  if (categoryId) {
    // the category must belong to the same shop
    if (
      !isObjectId(categoryId) ||
      !(await ProductCategory.exists({ _id: categoryId, shop: shopId }))
    ) {
      return { error: "Invalid category" };
    }
    value.category = categoryId;
  }

  if (data.images !== undefined) {
    const images = cleanImages(data.images, shopId, existingImages);
    if (!images) return { error: "Invalid images" };
    value.images = images;
  }

  return { value };
};
