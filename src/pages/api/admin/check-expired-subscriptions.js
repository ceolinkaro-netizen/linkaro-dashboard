import clientPromise from "@/components/auth/config";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");
    const now = new Date();

    const expired = await db
      .collection("subscriptions")
      .find({
        subscriptionEndDate: { $lt: now, $exists: true },
      })
      .project({ _id: 1, userId: 1, subscriptionType: 1 })
      .toArray();

    if (expired.length === 0) {
      return res.status(200).json({ success: true, updated: 0 });
    }

    let updated = 0;

    for (const sub of expired) {
      const isBadge = (sub.subscriptionType || "").toLowerCase().includes("badge");
      const userField = isBadge ? "badgeSubscriptionStatus" : "subscriptionStatus";

      const result = await db.collection("users").updateOne(
        {
          _id: sub.userId,
          [userField]: { $nin: ["inactive", "fraud"] },
        },
        { $set: { [userField]: "inactive" } }
      );

      if (result.modifiedCount > 0) updated++;
    }

    return res.status(200).json({ success: true, updated });
  } catch (error) {
    console.error("Check expired subscriptions error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
