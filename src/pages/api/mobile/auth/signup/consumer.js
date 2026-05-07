import clientPromise from "@/components/auth/config";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { fullName, email, cnic, password, profileImage } = req.body;

  if (!fullName || !email || !cnic || !password) {
    return res
      .status(400)
      .json({ message: "Full name, email, CNIC and password are required" });
  }

  if (!/^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  if (String(cnic).length !== 13) {
    return res.status(400).json({ message: "CNIC must be 13 digits" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  if (!profileImage) {
    return res.status(400).json({ message: "Profile photo is required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    const existing = await db
      .collection("users")
      .findOne({ email: email.toLowerCase().trim(), role: "consumer" });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      name: fullName,
      email: email.toLowerCase().trim(),
      cnic,
      password: hashedPassword,
      role: "consumer",
      profileImage,
      totalJobs: 0,
      createdAt: new Date(),
    });

    return res
      .status(201)
      .json({ success: true, message: "Account created successfully" });
  } catch (error) {
    console.error("Consumer signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // increase to 10mb
    },
  },
};
