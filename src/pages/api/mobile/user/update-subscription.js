import clientPromise from "@/components/auth/config";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { token, subscriptionStatus } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  if (subscriptionStatus === undefined || subscriptionStatus === null) {
    return res.status(400).json({ message: "subscriptionStatus is required" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(decoded.id) },
        {
          $set: {
            subscriptionStatus,
            subscriptionDate: new Date(),
            updatedAt: new Date(),
          },
        },
      );

    return res
      .status(200)
      .json({ success: true, message: "Subscription status updated" });
  } catch (error) {
    console.error("Update subscription error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
