import clientPromise from "@/components/auth/config";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { token, title, category, problem, location, scheduledTime } = req.body;

  if (!token) return res.status(400).json({ message: "Token is required" });
  if (!title || !category || !problem || !location) {
    return res.status(400).json({ message: "All fields are required" });
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

    const result = await db.collection("jobs").insertOne({
      userId: new ObjectId(decoded.id),
      title: title.trim(),
      category,
      problem: problem.trim(),
      location: location.trim(),
      scheduledTime: scheduledTime || "ASAP",
      status: "open",
      createdAt: new Date(),
    });

    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(decoded.id) }, { $inc: { totalJobs: 1 } });

    return res.status(201).json({ success: true, jobId: result.insertedId });
  } catch (error) {
    console.error("Post job error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
