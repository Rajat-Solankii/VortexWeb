import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tokenRecord = db.prepare("SELECT * FROM verification_tokens WHERE email = ? ORDER BY createdAt DESC LIMIT 1").get(email) as any;

    if (!tokenRecord) {
      return NextResponse.json({ error: "No verification request found for this email" }, { status: 404 });
    }

    if (tokenRecord.token !== otp) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    const isExpired = new Date(tokenRecord.expiresAt).getTime() < Date.now();
    if (isExpired) {
      return NextResponse.json({ error: "Verification code has expired. Please sign up again." }, { status: 400 });
    }

    // Mark user as verified
    db.prepare("UPDATE users SET isVerified = 1 WHERE email = ?").run(email);
    
    // Delete the token
    db.prepare("DELETE FROM verification_tokens WHERE email = ?").run(email);

    return NextResponse.json({ success: true, message: "Account verified successfully" });

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
