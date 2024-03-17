import { Schema, model, models } from "mongoose";

const shopSchema = new Schema(
  {
    name: { type: String, unique: true },
    logo: { type: String, default: "" },
    pack: { type: String, default: "FREE" }, // FREE PREMIUM
    shippingFee: { type: Number, default: 7 },
    settings: {
      type: Object,
      default: {
        headerColor: { type: String, default: "black" },
        footerColor: { type: String, default: "black" },
        primaryColor: { type: String, default: "#bb84e8" },
        secondaryColor: { type: String, default: "#ec008c" },
      },
    },
    architecture: {
      type: Object,
      default: {
        home: {
          sliderComponent: [],
          categoriesComponent: {
            visibleIndex: 0,
            selectedCategoriesIds: [],
          },
          discountComponent: {
            visibleIndex: 0,
          },
          galleryComponent: {
            visibleIndex: 0,
            content: [],
          },
        },
        contact: {
          address: "",
          socials: {
            instagram: "",
            tiktok: "",
            facebook: "",
            youtube: "",
            linkedIn: "",
          },
          direct: { email: "", phone: "" },
        },
        about: "",
      },
    },
  },
  { timestamps: true }
);
const Shop = models.Shop || model("Shop", shopSchema);

export default Shop;
