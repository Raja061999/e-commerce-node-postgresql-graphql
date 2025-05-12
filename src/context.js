import { verifyToken } from "./utils/auth.js";

export async function context({ req }) {
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) {
    try {
      const token = auth.replace("Bearer ", "");
      const decoded = verifyToken(token);
      return { user: decoded };
    } catch (err) {
      console.warn("Invalid token");
    }
  }
  return {};
}
