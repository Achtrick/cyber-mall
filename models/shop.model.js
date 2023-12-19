import { Schema, model, models } from "mongoose";

const shopSchema = new Schema(
  {
    name: { type: String, unique: true },
    logo: { type: String, default: "" },
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
      home: {
        type: Object,
        default: {
          sliderComponent: {
            type: [Object],
            default: [
              {
                image: { type: String, default: "" },
                link: { type: String, default: "" },
              },
            ],
          },
          categoriesComponent: {
            type: Object,
            default: {
              visibleIndex: { type: Number, default: 0 },
              selectedCategories: { type: [String], default: [] },
            },
          },
          discountComponent: {
            type: Object,
            default: {
              visibleIndex: { type: Number, default: 0 },
            },
          },
          galleryComponent: {
            type: Object,
            default: {
              visibleIndex: { type: Number, default: 0 },
              content: {
                type: [Object],
                default: [
                  {
                    title: {
                      type: Object,
                      default: {
                        text: { type: String, default: "" },
                        visible: { type: Boolean, default: false },
                      },
                    },
                    description: {
                      type: Object,
                      default: {
                        text: { type: String, default: "" },
                        visible: { type: Boolean, default: false },
                      },
                    },
                    backgroundImage: { type: String, default: "" },
                    link: { type: String, default: "" },
                  },
                ],
              },
            },
          },
        },
      },
      contact: {
        type: Object,
        default: {
          address: { type: String, default: "" },
          socials: {
            type: [Object],
            default: [
              { instagram: { type: String, default: "" } },
              { tiktok: { type: String, default: "" } },
              { facebook: { type: String, default: "" } },
              { youtube: { type: String, default: "" } },
              { linkedIn: { type: String, default: "" } },
            ],
          },
          direct: {
            type: [Object],
            default: [
              { email: { type: String, default: "" } },
              { phone: { type: [String], default: [""] } },
            ],
          },
        },
      },
      about: { type: String, default: "" },
    },
  },
  { timestamps: true }
);
const Shop = models.Shop || model("Shop", shopSchema);

export default Shop;
