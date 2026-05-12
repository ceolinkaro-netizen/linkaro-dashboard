import clientPromise from "@/components/auth/config";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    const users = await db
      .collection("users")
      .find({ role: { $in: ["consumer", "provider"] } })
      .project({ password: 0, cnicFrontImage: 0, cnicBackImage: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const revenueAgg = await db
      .collection("subscriptions")
      .aggregate([
        { $match: { createdAt: { $gte: monthStart }, amountPaid: { $type: "number" } } },
        { $group: { _id: null, total: { $sum: "$amountPaid" } } },
      ])
      .toArray();

    const monthlyRevenue = revenueAgg[0]?.total || 0;
    const serviceProviders = users.filter((u) => u.role === "provider").length;
    const consumers = users.filter((u) => u.role === "consumer").length;

    return res.status(200).json({
      success: true,
      users,
      stats: {
        totalUsers: users.length,
        serviceProviders,
        consumers,
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
