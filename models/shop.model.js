import { Schema, model, models } from "mongoose";

const shopSchema = new Schema(
  {
    verified: { type: Boolean, default: false },
    banned: { type: Boolean, default: false },
    name: { type: String, unique: true },
    logo: { type: String, default: "" },
    domainName: { type: String, default: "" },
    activityDomain: String,
    pack: {
      type: Object,
    },
    shippingFee: { type: Number, default: 7 },
    currency: { type: String, default: "EUR" },
    freeShipping: Number,
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
            visible: true,
            selectedCategoriesIds: [],
          },
          discountComponent: {
            visibleIndex: 0,
            visible: true,
          },
          galleryComponent: {
            visibleIndex: 0,
            visible: true,
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
