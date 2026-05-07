import clientPromise from "@/components/auth/config";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, name, profileImage, provider, providerId, role = "consumer" } = req.body;

  if (!email || !provider || !providerId) {
    return res
      .status(400)
      .json({ message: "Email, provider and providerId are required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    const normalizedEmail = email.toLowerCase().trim();

    // Look up by email + role so the same email can hold separate consumer/provider accounts
    let user = await db
      .collection("users")
      .findOne({ email: normalizedEmail, role });

    // ── User does not exist for this role → create ────────────────────────────
    if (!user) {
      const result = await db.collection("users").insertOne({
        name,
        email: normalizedEmail,
        profileImage: profileImage ?? null,
        provider,
        providerId,
        emailVerified: true,
        role,
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
        email: normalizedEmail,
        role,
        name,
        profileImage: profileImage ?? null,
      };
    }

    // ── Return token (log in regardless of how the account was originally created) ──
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
