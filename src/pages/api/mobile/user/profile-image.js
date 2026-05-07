import clientPromise from "@/components/auth/config";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, token } = req.query;

  if (!id || !token) {
    return res.status(400).json({ message: "User ID and token are required" });
  }

  // Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // Token must belong to the requested user
  if (decoded.id !== id) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) }, { projection: { profileImage: 1, totalJobs: 1, name: 1, email: 1 } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      name: user.name || null,
      email: user.email || null,
      profileImage: user.profileImage || null,
      totalJobs: user.totalJobs ?? 0,
    });
  } catch (error) {
    console.error("Profile image error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
