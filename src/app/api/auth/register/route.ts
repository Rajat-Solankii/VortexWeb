import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if public registration is enabled
    const stmt = db.prepare("SELECT value FROM settings WHERE key = 'public_registration'");
    const setting = stmt.get() as any;
    const isPublicEnabled = setting ? setting.value === 'true' : false;

    // We still allow the very first user to sign up, but if >0, we block based on the setting
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    if (userCount.count > 0 && !isPublicEnabled) {
      return NextResponse.json({ error: "Public registration is currently disabled." }, { status: 403 });
    }

    // Check if user already exists
    const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (existingUser && existingUser.isVerified === 1) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID().replace(/-/g, '').substring(0, 21); // Unique ID

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

    console.log("==================================================");
    console.log(`🔑 DEV MODE OTP for ${email}: ${otp}`);
    console.log("==================================================");

    // Prepare Brevo API call
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      console.error("BREVO_API_KEY is not set in environment variables");
      return NextResponse.json({ error: "Email service is not configured" }, { status: 500 });
    }

    // Brevo requires the sender email to be an authorized sender in your Brevo account
    // Fallback to a placeholder, but this WILL fail if not authorized in Brevo!
    const senderEmail = process.env.BREVO_SENDER_EMAIL || "rajatsolanki1210@gmail.com"; 

    // Send Email via Brevo API
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: { name: "Vortex Auth", email: senderEmail }, 
        to: [{ email: email, name: name }],
        subject: "Vortex - Verify Your Email",
        htmlContent: `
          <div style="font-family: sans-serif; text-align: center; padding: 40px; background-color: #07090e; color: #fff;">
            <h1 style="color: #a78bfa;">Welcome to Vortex</h1>
            <p>Your verification code is:</p>
            <h2 style="font-size: 32px; letter-spacing: 5px; color: #fff; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; display: inline-block;">${otp}</h2>
            <p>This code will expire in 15 minutes.</p>
          </div>
        `
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Brevo API Error:", errorData);
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
    }

    // If email sent successfully, save user (isVerified = 0) and token
    const userRole = 'user'; // Default to user always
    
    if (existingUser) {
      // User exists but isn't verified, update their info
      const updateUser = db.prepare(`
        UPDATE users SET name = ?, password = ? WHERE email = ?
      `);
      updateUser.run(name, hashedPassword, email);
    } else {
      const insertUser = db.prepare(`
        INSERT INTO users (id, name, email, password, role, isVerified)
        VALUES (?, ?, ?, ?, ?, 0)
      `);
      insertUser.run(userId, name, email, hashedPassword, userRole);
    }

    const insertToken = db.prepare(`
      INSERT INTO verification_tokens (email, token, expiresAt)
      VALUES (?, ?, ?)
    `);
    insertToken.run(email, otp, expiresAt);

    return NextResponse.json({ success: true, message: "Verification email sent" });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
