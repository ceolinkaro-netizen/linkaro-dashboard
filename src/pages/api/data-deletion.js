import clientPromise from "@/components/auth/config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, accountType, reason } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Full name is required" });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ message: "Email address is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    const recentRequest = await db.collection("dataDeletionRequests").findOne({
      email: email.toLowerCase().trim(),
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    if (recentRequest) {
      return res.status(409).json({
        message: "A deletion request for this email was already submitted within the last 7 days. We will process it within 30 days.",
      });
    }

    await db.collection("dataDeletionRequests").insertOne({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      accountType: accountType || "Not specified",
      reason: reason?.trim() || "",
      status: "pending",
      createdAt: new Date(),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Data deletion request error:", error);
    return res.status(500).json({ message: "Internal server error. Please try again or email us directly." });
  }
}
