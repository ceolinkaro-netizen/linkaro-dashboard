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

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await db.collection("jobs").updateMany(
      { status: "open", createdAt: { $lt: cutoff } },
      { $set: { status: "expired" } }
    );

    return res.status(200).json({ success: true, expired: result.modifiedCount });
  } catch (error) {
    console.error("Expire jobs error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
