import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newEmail } = await req.json();

    if (!newEmail) {
      return NextResponse.json({ error: "New email is required" }, { status: 400 });
    }

    if (newEmail.toLowerCase() === session.user.email.toLowerCase()) {
      return NextResponse.json({ error: "This is already your email address" }, { status: 400 });
    }

    // Check if new email is already taken
    const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(newEmail);
    if (existingUser) {
      return NextResponse.json({ error: "This email is already in use by another account" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
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
        sender: { name: "Vortex Security", email: senderEmail }, 
        to: [{ email: newEmail, name: session.user.name || "User" }],
        subject: "Vortex - Verify New Email Address",
        htmlContent: `
          <div style="font-family: sans-serif; text-align: center; padding: 40px; background-color: #07090e; color: #fff;">
            <h1 style="color: #a78bfa;">Verify Your New Email</h1>
            <p>You requested to change your Vortex account email to this address. Your verification code is:</p>
            <h2 style="font-size: 32px; letter-spacing: 5px; color: #fff; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; display: inline-block;">${otp}</h2>
            <p>This code will expire in 15 minutes.</p>
          </div>
        `
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
    }

    // Save token
    const insertToken = db.prepare(`
      INSERT INTO verification_tokens (email, token, expiresAt)
      VALUES (?, ?, ?)
    `);
    insertToken.run(newEmail, otp, expiresAt);

    return NextResponse.json({ success: true, message: "Verification code sent to new email" });

  } catch (error) {
    console.error("Change Email Request Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
