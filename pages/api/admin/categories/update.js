import nc from "next-connect";
import connectDB from "../../../../utils/connectDB";
import ProductCategory from "../../../../models/productCategory.model";
import auth from "../../../../middlewares/admin-auth";
import { removeFile } from "../../../../utils/shared/removeFile";

const handler = nc();

handler.put(auth, async (req, res) => {
  await connectDB();
  const data = req.body;

  try {
    const category = await ProductCategory.findById(data._id);

    if (data.icon) {
      removeFile(category.icon.split("/").pop());
      category.icon = data.icon;
    }

    category.name = data.name;
    category.description = data.description;

    await category.save();

    res.status(200).json({ message: "updated category" });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export default handler;
