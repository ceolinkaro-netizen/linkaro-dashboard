import clientPromise from "@/components/auth/config";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (!role) {
    return res.status(400).json({ message: "Role is required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    const query = { email: email.toLowerCase().trim(), role };

    const user = await db.collection("users").findOne(query);

    if (!user) {
      return res.status(404).json({ message: "No account found with this email and role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").updateOne(
      query,
      { $set: { password: hashedPassword } }
    );

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
