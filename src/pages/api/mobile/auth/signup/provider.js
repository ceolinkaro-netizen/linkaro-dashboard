import clientPromise from "@/components/auth/config";
import bcrypt from "bcryptjs";

const VALID_GENDERS = ["Male", "Female"];
const VALID_CATEGORIES = [
  "Computer Repair", "Laptop Repair", "Printer Repair", "Mobile Phone Repair",
  "Network Technician", "System Technician", "Technical Support", "Software Installation",
  "Data Recovery Service", "Website Developer", "Graphic Designer",
  "CCTV Camera Installation & Repair", "Mechanic", "Tire Repair / Puncture Service",
  "Electrician", "Plumber", "AC Repair & Installation", "Refrigerator Repair",
  "Washing Machine Repair", "Geyser / Water Heater Repair", "Generator Repair",
  "UPS / Inverter Repair", "Solar Panel Technician", "Carpenter",
  "Mason / Construction Worker", "Painter", "Welder", "Glass & Aluminum Work",
  "Rooftop Waterproofing", "Home Cleaner", "Gardener / Mali", "Labor / Mazdoor",
  "Barber", "Beautician", "Makeup Artist", "Hair Stylist", "Tailor",
  "Home Food Service", "Lunch Box Service", "Catering Service", "Home Baker",
  "Car Wash Service", "Bike Mechanic", "Car Towing Service", "Photographer",
  "Videographer", "Drone Camera Service", "Event Decorator",
  "DJ & Sound System Service", "Fitness Trainer",
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    name,
    phone,
    email,
    street,
    city,
    cnic,
    zip,
    password,
    gender,
    category,
    profileImage,
    cnicFrontImage,
    cnicBackImage,
  } = req.body;

  // Required field check
  if (
    !name ||
    !phone ||
    !email ||
    !street ||
    !city ||
    !cnic ||
    !zip ||
    !password ||
    !gender ||
    !category
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validation
  if (!/^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  if (String(phone).length !== 10) {
    return res
      .status(400)
      .json({ message: "Phone must be 10 digits (without +92)" });
  }

  if (String(cnic).length !== 13) {
    return res.status(400).json({ message: "CNIC must be 13 digits" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  if (!VALID_GENDERS.includes(gender)) {
    return res.status(400).json({ message: "Gender must be Male or Female" });
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  if (!profileImage || !cnicFrontImage || !cnicBackImage) {
    return res.status(400).json({
      message: "Profile photo, CNIC front and back images are required",
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db("linkaro");

    const existing = await db
      .collection("users")
      .findOne({ email: email.toLowerCase().trim(), role: "provider" });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      name,
      phone: `+92${phone}`,
      email: email.toLowerCase().trim(),
      address: { street, city, zip },
      cnic,
      gender,
      category,
      password: hashedPassword,
      role: "provider",
      profileImage,
      totalJobs: 0,
      cnicFrontImage,
      cnicBackImage,
      subscriptionStatus: "inactive",
      badgeSubscriptionStatus: "inactive",
      createdAt: new Date(),
    });

    return res
      .status(201)
      .json({ success: true, message: "Account created. Pending approval." });
  } catch (error) {
    console.error("Provider signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb", // increase to 10mb
    },
  },
};
