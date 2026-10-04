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

    const { newEmail, otp } = await req.json();

    if (!newEmail || !otp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tokenRecord = db.prepare("SELECT * FROM verification_tokens WHERE email = ? ORDER BY createdAt DESC LIMIT 1").get(newEmail) as any;

    if (!tokenRecord) {
      return NextResponse.json({ error: "No verification request found for this email" }, { status: 404 });
    }

    if (tokenRecord.token !== otp) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    const isExpired = new Date(tokenRecord.expiresAt).getTime() < Date.now();
    if (isExpired) {
      return NextResponse.json({ error: "Verification code has expired." }, { status: 400 });
    }

    // Update user's email
    db.prepare("UPDATE users SET email = ? WHERE email = ?").run(newEmail, session.user.email);
    
    // Delete the token
    db.prepare("DELETE FROM verification_tokens WHERE email = ?").run(newEmail);

    return NextResponse.json({ success: true, message: "Email changed successfully" });

  } catch (error) {
    console.error("Change Email Verify Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
