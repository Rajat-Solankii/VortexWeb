import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user) {
      // Return success even if user doesn't exist for security (prevent email enumeration)
      return NextResponse.json({ success: true });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      console.error("BREVO_API_KEY is not set");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const senderEmail = process.env.BREVO_SENDER_EMAIL || "rajatsolanki1210@gmail.com"; 

    // Send Email via Brevo API
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: { name: "Vortex Support", email: senderEmail }, 
        to: [{ email: user.email, name: user.name }],
        subject: "Vortex - Password Reset Request",
        htmlContent: `
          <div style="font-family: sans-serif; text-align: center; padding: 40px; background-color: #07090e; color: #fff;">
            <h1 style="color: #a78bfa;">Reset Your Password</h1>
            <p>We received a request to reset your password. Your code is:</p>
            <h2 style="font-size: 32px; letter-spacing: 5px; color: #fff; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; display: inline-block;">${otp}</h2>
            <p>If you didn't request this, you can safely ignore this email.</p>
          </div>
        `
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 });
    }

    // Save token
    const insertToken = db.prepare(`
      INSERT INTO verification_tokens (email, token, expiresAt)
      VALUES (?, ?, ?)
    `);
    insertToken.run(email, otp, expiresAt);

    return NextResponse.json({ success: true, message: "Reset email sent" });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
