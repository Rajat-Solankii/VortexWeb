import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified === 1) {
      return NextResponse.json({ error: "User is already verified" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

    console.log("==================================================");
    console.log(`🔑 DEV MODE RESEND OTP for ${email}: ${otp}`);
    console.log("==================================================");

    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || "rajatsolanki1210@gmail.com"; 

    if (brevoApiKey) {
      // Send Email via Brevo API
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": brevoApiKey,
        },
        body: JSON.stringify({
          sender: { name: "Vortex Auth", email: senderEmail }, 
          to: [{ email: email, name: user.name }],
          subject: "Vortex - Verify Your Email",
          htmlContent: `
            <div style="font-family: sans-serif; text-align: center; padding: 40px; background-color: #07090e; color: #fff;">
              <h1 style="color: #a78bfa;">Welcome Back to Vortex</h1>
              <p>You tried to log in, but haven't verified your email yet. Your new verification code is:</p>
              <h2 style="font-size: 32px; letter-spacing: 5px; color: #fff; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; display: inline-block;">${otp}</h2>
              <p>This code will expire in 15 minutes.</p>
            </div>
          `
        }),
      });
    }

    // Save token
    const insertToken = db.prepare(`
      INSERT INTO verification_tokens (email, token, expiresAt)
      VALUES (?, ?, ?)
    `);
    insertToken.run(email, otp, expiresAt);

    return NextResponse.json({ success: true, message: "New verification email sent" });

  } catch (error) {
    console.error("Resend OTP Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
