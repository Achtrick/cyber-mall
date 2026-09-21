import { authenticate } from "../utils/shared/auth";

const auth = async (req, res, next) => {
  let session = null;
  try {
    session = await authenticate(req, { allowAdmin: false, allowSuperAdmin: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
  if (!session) {
    return res
      .status(401)
      .json({ message: "Session expired", expired: true });
  }
  req.auth = session;
  next();
};

export default auth;
