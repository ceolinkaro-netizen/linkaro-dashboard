import clientPromise from "@/components/auth/config";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Subscription ID is required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    const results = await db
      .collection("subscriptions")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            subscriptionType: 1,
            subscriptionDate: 1,
            amountPaid: 1,
            paymentOption: 1,
            receiptImage: 1,
            createdAt: 1,
            "user.name": 1,
            "user.email": 1,
            "user.phone": 1,
            "user.category": 1,
            "user.gender": 1,
            "user.address": 1,
            "user.cnic": 1,
            "user.profileImage": 1,
            "user.cnicFrontImage": 1,
            "user.cnicBackImage": 1,
            "user.role": 1,
            "user.totalJobs": 1,
            "user.subscriptionStatus": 1,
            "user.badgeSubscriptionStatus": 1,
          },
        },
      ])
      .toArray();

    if (!results.length) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res.status(200).json({ success: true, subscription: results[0] });
  } catch (error) {
    console.error("Get subscription error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
