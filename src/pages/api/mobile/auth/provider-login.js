import clientPromise from "@/components/auth/config";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, name, profileImage, provider, providerId } = req.body;

  if (!email || !provider || !providerId) {
    return res
      .status(400)
      .json({ message: "Email, provider and providerId are required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    let user = await db
      .collection("users")
      .findOne({ email: email.toLowerCase().trim() });

    // ── User does not exist → create ──────────────────────────────────────────
    if (!user) {
      const result = await db.collection("users").insertOne({
        name,
        email: email.toLowerCase().trim(),
        profileImage: profileImage ?? null,
        provider,
        providerId,
        emailVerified: true,
        role: "consumer",
        totalJobs: 0,
        phone: null,
        cnic: null,
        address: null,
        gender: null,
        password: null,
        createdAt: new Date(),
      });

      user = {
        _id: result.insertedId,
        email: email.toLowerCase().trim(),
        role: "consumer",
        name,
        profileImage: profileImage ?? null,
      };
    }

    // ── User exists with password account ─────────────────────────────────────
    if (!user.provider) {
      return res.status(409).json({
        message:
          "This email is registered with a password. Please login normally.",
      });
    }

    // ── Return token ──────────────────────────────────────────────────────────
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Social login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
