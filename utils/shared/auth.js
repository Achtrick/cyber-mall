import jwt from "jsonwebtoken";
import User from "../../models/user.model";
import connectDB from "../connectDB";
import { isObjectId } from "./security";

// Misconfiguration warnings (secrets are never printed).
const adminSecret = process.env.JWT_ADMIN_SECRET;
const superSecret = process.env.JWT_SUPER_ADMIN_SECRET;
if (!adminSecret || !superSecret) {
  console.warn("[security] JWT_ADMIN_SECRET / JWT_SUPER_ADMIN_SECRET are not set: all authenticated requests will be rejected.");
} else if (adminSecret === superSecret || adminSecret.length < 32 || superSecret.length < 32) {
  console.warn("[security] JWT secrets must be two different random values of at least 32 characters.");
}

// Accepts both `Authorization: <jwt>` (what the frontend sends) and
// `Authorization: Bearer <jwt>`.
const readToken = (req) => {
  const header = req.headers.authorization;
  if (typeof header !== "string") return null;
  const token = header.replace(/^Bearer\s+/i, "").trim();
  return token || null;
};

const verify = (token, secret) => {
  // a missing secret makes jwt.verify throw -> we fail closed (401)
  try {
    return jwt.verify(token, secret, { algorithms: ["HS256"] });
  } catch (e) {
    return null;
  }
};

/**
 * Verifies the JWT and loads the account it belongs to from the DB, so deleted
 * users and tokens issued before a password reset stop working immediately.
 * Returns { userId, role, shopId, isSuperAdmin } or null.
 */
export const authenticate = async (req, { allowAdmin, allowSuperAdmin }) => {
  const token = readToken(req);
  if (!token) return null;

  const adminPayload = allowAdmin ? verify(token, process.env.JWT_ADMIN_SECRET) : null;
  const superPayload =
    allowSuperAdmin && !adminPayload
      ? verify(token, process.env.JWT_SUPER_ADMIN_SECRET)
      : null;
  const payload = adminPayload || superPayload;
  if (!payload || !isObjectId(payload.id)) return null;

  await connectDB();
  const user = await User.findById(payload.id)
    .select("role shop passwordChangedAt")
    .lean();
  if (!user) return null;

  const wantedRole = adminPayload ? "ADMIN" : "SUPER-ADMIN";
  if (user.role !== wantedRole) return null;
  if (
    user.passwordChangedAt &&
    // iat has second precision: compare in seconds so a token issued right after the change is valid
    payload.iat < Math.floor(new Date(user.passwordChangedAt).getTime() / 1000)
  ) {
    return null;
  }

  const isSuperAdmin = wantedRole === "SUPER-ADMIN";
  if (!isSuperAdmin && !user.shop) return null;

  return {
    userId: String(user._id),
    role: user.role,
    shopId: isSuperAdmin ? null : String(user.shop),
    isSuperAdmin,
  };
};

/**
 * For routes reached by shop admins: the shop is always the caller's own shop.
 * A body-supplied shop id that differs is rejected (IDOR). Super admins may
 * target any shop and must name it. Returns the shop id or null after
 * answering 403/400.
 */
export const resolveShop = (req, res, bodyShopId) => {
  const { isSuperAdmin, shopId } = req.auth;
  if (isSuperAdmin) {
    if (isObjectId(bodyShopId)) return bodyShopId;
    res.status(400).json({ message: "Invalid shop" });
    return null;
  }
  if (bodyShopId !== undefined && bodyShopId !== null && String(bodyShopId) !== shopId) {
    res.status(403).json({ message: "Forbidden" });
    return null;
  }
  return shopId;
};

/** Ownership check for a document carrying a `shop` reference. */
export const ownsShop = (req, docShop) =>
  req.auth.isSuperAdmin || String(docShop) === req.auth.shopId;
