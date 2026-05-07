import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from headers

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Replace with your secret key
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
  }
}
