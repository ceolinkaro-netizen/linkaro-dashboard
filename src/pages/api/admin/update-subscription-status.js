import clientPromise from "@/components/auth/config";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ message: "id and status are required" });
  }

  const VALID = ["active", "rejected", "fraud"];
  if (!VALID.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    const subscription = await db
      .collection("subscriptions")
      .findOne({ _id: new ObjectId(id) });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    await db
      .collection("subscriptions")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status } });

    const isBadge = (subscription.subscriptionType || "").toLowerCase().includes("badge");
    const userStatusField = isBadge ? "badgeSubscriptionStatus" : "subscriptionStatus";

    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(subscription.userId) },
        { $set: { [userStatusField]: status } }
      );

    return res.status(200).json({ success: true, status });
  } catch (error) {
    console.error("Update subscription status error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
