import nc from "next-connect";
import connectDB from "../../../../utils/connectDB";
import Shop from "../../../../models/shop.model";
import auth from "../../../../middlewares/admin-auth";

const handler = nc();

handler.post(auth, async (req, res) => {
  await connectDB();
  const { shopId, component, body } = req.body;

  try {
    const shop = await Shop.findOne({ _id: shopId });
    switch (component) {
      case "sliderComponent":
        shop.architecture = {
          ...shop.architecture,
          home: { ...shop.architecture.home, sliderComponent: body },
        };
        break;
      case "categoriesComponent":
        shop.architecture = {
          ...shop.architecture,
          home: { ...shop.architecture.home, categoriesComponent: body },
        };
        break;
      case "discountComponent":
        shop.architecture = {
          ...shop.architecture,
          home: { ...shop.architecture.home, discountComponent: body },
        };
        break;
      case "galleryComponent":
        shop.architecture = {
          ...shop.architecture,
          home: { ...shop.architecture.home, galleryComponent: body },
        };
        break;
      case "contactComponent":
        shop.architecture = {
          ...shop.architecture,
          contact: body,
        };
        break;
      case "aboutComponent":
        shop.architecture = {
          ...shop.architecture,
          about: body,
        };
        break;
      default:
        break;
    }
    await shop.save();

    res.status(200).json({ message: "updated architecture" });
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb",
    },
  },
};
