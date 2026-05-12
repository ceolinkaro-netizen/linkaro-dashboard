import clientPromise from "@/components/auth/config";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    await db.collection("users").deleteOne({ _id: new ObjectId(id) });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
