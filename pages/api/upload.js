import multer from "multer";
import nc from "next-connect";
import auth from "../../middlewares/admin-auth";

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
      const uniqueFilename =
        Date.now().toString() + "." + file.mimetype.split("/").pop();
      cb(null, uniqueFilename);
    },
  }),
});

const handler = nc();

handler.use(upload.array("images")).post(auth, (req, res) => {
  res.status(200).json(req.files);
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
