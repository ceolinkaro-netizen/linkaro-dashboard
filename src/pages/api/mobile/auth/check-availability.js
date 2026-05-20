import clientPromise from "@/components/auth/config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, cnic, phone, role } = req.body;

  if (!email || !cnic || !role) {
    return res.status(400).json({ message: "Email, CNIC and role are required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    const existingEmail = await db
      .collection("users")
      .findOne({ email: email.toLowerCase().trim(), role });
    if (existingEmail) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const existingCnic = await db
      .collection("users")
      .findOne({ cnic, role });
    if (existingCnic) {
      return res.status(409).json({ message: "CNIC is already registered" });
    }

    if (phone && role === "provider") {
      const existingPhone = await db
        .collection("users")
        .findOne({ phone: `+92${phone}`, role });
      if (existingPhone) {
        return res.status(409).json({ message: "Phone number is already registered" });
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Check availability error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
