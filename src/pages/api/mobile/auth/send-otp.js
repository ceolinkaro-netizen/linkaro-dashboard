import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "Email and code are required" });
  }

  try {
    await transporter.sendMail({
      from: `"Linkaro" <${process.env.EMAIL}>`,
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #000F2C; border-radius: 12px;">
          <h2 style="color: #ffffff; margin: 0 0 8px 0;">Verify your email</h2>
          <p style="color: rgba(255,255,255,0.7); margin: 0 0 32px 0;">Use the code below to complete your verification.</p>
          <div style="background: #FE5900; border-radius: 8px; padding: 20px; text-align: center;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #ffffff;">${code}</span>
          </div>
          <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 24px 0 0 0;">This code expires in 10 minutes. Do not share it with anyone.</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({ message: "Failed to send email" });
  }
}
