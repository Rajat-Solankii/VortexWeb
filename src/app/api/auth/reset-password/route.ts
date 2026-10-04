import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tokenRecord = db.prepare("SELECT * FROM verification_tokens WHERE email = ? ORDER BY createdAt DESC LIMIT 1").get(email) as any;

    if (!tokenRecord) {
      return NextResponse.json({ error: "No reset request found for this email" }, { status: 404 });
    }

    if (tokenRecord.token !== otp) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    const isExpired = new Date(tokenRecord.expiresAt).getTime() < Date.now();
    if (isExpired) {
      return NextResponse.json({ error: "Verification code has expired." }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    db.prepare("UPDATE users SET password = ? WHERE email = ?").run(hashedPassword, email);
    
    // Delete the token
    db.prepare("DELETE FROM verification_tokens WHERE email = ?").run(email);

    return NextResponse.json({ success: true, message: "Password reset successfully" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
