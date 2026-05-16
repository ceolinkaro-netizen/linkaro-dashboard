import clientPromise from "@/components/auth/config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    // Set registrationStatus: true on all existing providers that don't have the field yet
    const result = await db.collection("users").updateMany(
      { role: "provider", registrationStatus: { $exists: false } },
      { $set: { registrationStatus: true } }
    );

    return res.status(200).json({
      success: true,
      matched: result.matchedCount,
      updated: result.modifiedCount,
      message: `Updated ${result.modifiedCount} existing provider accounts to registrationStatus: true`,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
