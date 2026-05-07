import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const MONGODB_URI =
  "mongodb+srv://kanitaabeera123_db_user:bdaFZ21acEosMUYy@cluster0.ttdklws.mongodb.net/";

const users = [
  { email: "admin@linkaro.com", password: "admin123", role: "admin" },
  { email: "usermanager@linkaro.com", password: "user123", role: "user manager" },
  { email: "ticketmanager@linkaro.com", password: "ticket123", role: "ticket manager" },
];

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db("linkaro");
  const col = db.collection("users");

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await col.updateOne(
      { email: u.email },
      { $set: { email: u.email, password: hashed, role: u.role } },
      { upsert: true }
    );
    console.log(`✓ ${u.role} — ${u.email} / ${u.password}`);
  }

  await client.close();
  console.log("\nDone. You can now log in with the credentials above.");
}

seed().catch(console.error);
