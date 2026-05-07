import clientPromise from "@/components/auth/config";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    const providers = await db
      .collection("users")
      .find({
        role: "provider",
        subscriptionStatus: { $ne: "inactive" },
        badgeSubscriptionStatus: { $ne: "inactive" },
      })
      .sort({ subscriptionDate: -1 })
      .project({
        // ── Only remove sensitive fields ──
        password: 0,
        cnicFrontImage: 0,
        cnicBackImage: 0,
      })
      .toArray();

    return res.status(200).json({
      success: true,
      count: providers.length,
      providers,
    });
  } catch (error) {
    console.error("Get providers error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
