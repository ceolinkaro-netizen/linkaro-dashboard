import clientPromise from "@/components/auth/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const VALID_ROLES = ["consumer", "provider"];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ message: "Email, password and role are required" });
  }

  if (!VALID_ROLES.includes(role)) {
    return res
      .status(400)
      .json({ message: "Invalid role. Must be 'consumer' or 'provider'" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    const user = await db
      .collection("users")
      .findOne({ email: email.toLowerCase().trim(), role: role });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isHashed = /^\$2[aby]\$/.test(user.password);
    const passwordMatch = isHashed
      ? await bcrypt.compare(password, user.password)
      : password === user.password;

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.role !== role) {
      return res
        .status(403)
        .json({ message: "You don't have access with this role" });
    }

    // Provider whose registration hasn't been approved yet
    if (role === "provider" && user.registrationStatus === false) {
      return res.status(200).json({ success: false, registrationPending: true });
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "30d" },
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || null,
      },
    });
  } catch (error) {
    console.error("Mobile login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
