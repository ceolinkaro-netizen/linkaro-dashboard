import clientPromise from "@/components/auth/config";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    const jobs = await db
      .collection("jobs")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "consumer",
          },
        },
        {
          $unwind: {
            path: "$consumer",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();

    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("Get jobs error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
