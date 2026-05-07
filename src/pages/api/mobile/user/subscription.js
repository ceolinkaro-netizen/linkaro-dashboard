import clientPromise from "@/components/auth/config";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { token, subscriptionType, paymentOption, amountPaid, receiptImage } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  if (!subscriptionType) {
    return res.status(400).json({ message: "subscriptionType is required" });
  }

  if (!paymentOption) {
    return res.status(400).json({ message: "paymentOption is required" });
  }

  if (!amountPaid) {
    return res.status(400).json({ message: "amountPaid is required" });
  }

  if (!receiptImage) {
    return res.status(400).json({ message: "receiptImage is required" });
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

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(decoded.id) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const subscriptionDate = new Date();

    const subscriptionEndDate = new Date(subscriptionDate);
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

    await db.collection("subscriptions").insertOne({
      userId: new ObjectId(decoded.id),
      subscriptionType,
      paymentOption,
      amountPaid,
      subscriptionDate,
      subscriptionEndDate,
      receiptImage,
    });

    return res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: {
        userId: decoded.id,
        subscriptionType,
        paymentOption,
        amountPaid,
        subscriptionDate,
        subscriptionEndDate,
        receiptImage,
      },
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};
