import jwt from "jsonwebtoken";

const secret = process.env.JWT_ADMIN_SECRET;
const superAdminSecret = process.env.JWT_SUPER_ADMIN_SECRET;

const auth = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    jwt.verify(token, secret);
    next();
  } catch (error) {
    try {
      jwt.verify(token, superAdminSecret);
      next();
    } catch (error) {
      res
        .status(401)
        .json({ message: "Session expirée, Reconnectez Vous.", expired: true });
    }
  }
};

export default auth;
