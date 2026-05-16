import clientPromise from "@/components/auth/config";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, name, profileImage, provider, providerId, role } = req.body;

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

    // ── User does not exist → tell the app to redirect to signup ─────────────
    if (!user) {
      return res.status(200).json({ success: false, newUser: true });
    }

    // ── Registration pending check ────────────────────────────────────────────
    if (user.role === "provider" && user.registrationStatus === false) {
      return res.status(200).json({ success: false, registrationPending: true });
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
