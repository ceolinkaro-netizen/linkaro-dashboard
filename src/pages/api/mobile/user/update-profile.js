import clientPromise from "@/components/auth/config";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { token, ...fields } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(decoded.id) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Build update object based on role
    const update = {};

    if (fields.name) update.name = fields.name;
    if (fields.cnic) update.cnic = fields.cnic;
    if (fields.gender) update.gender = fields.gender;
    if (fields.profileImage) update.profileImage = fields.profileImage;

    // Phone — store with +92 prefix
    if (fields.phone) {
      update.phone = fields.phone.startsWith("+92")
        ? fields.phone
        : `+92${fields.phone}`;
    }

    // Address fields
    if (fields.street || fields.city || fields.zip) {
      const existing = user.address || {};
      update.address = {
        street: fields.street ?? existing.street ?? "",
        city: fields.city ?? existing.city ?? "",
        zip: fields.zip ?? existing.zip ?? "",
      };
    }

    // Provider-only fields
    if (user.role === "provider") {
      if (fields.email) update.email = fields.email.toLowerCase().trim();
      if (fields.category) update.category = fields.category;
      if (fields.cnicFrontImage) update.cnicFrontImage = fields.cnicFrontImage;
      if (fields.cnicBackImage) update.cnicBackImage = fields.cnicBackImage;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(decoded.id) }, { $set: update });

    return res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};
