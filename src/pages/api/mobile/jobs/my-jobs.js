import clientPromise from "@/components/auth/config";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { token } = req.query;
  if (!token) return res.status(400).json({ message: "Token is required" });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    const jobs = await db
      .collection("jobs")
      .find({ userId: new ObjectId(decoded.id) })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("Get my jobs error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
