import { authenticate } from "../utils/shared/auth";

// Shop admin (or super admin) authentication. On success `req.auth` holds
// { userId, role, shopId, isSuperAdmin }; routes must scope every query to
// req.auth.shopId instead of trusting a shop id from the request body.
const auth = async (req, res, next) => {
  let session = null;
  try {
    session = await authenticate(req, { allowAdmin: true, allowSuperAdmin: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
  if (!session) {
    return res
      .status(401)
      .json({ message: "Session expired, please log in again.", expired: true });
  }
  req.auth = session;
  next();
};

export default auth;
