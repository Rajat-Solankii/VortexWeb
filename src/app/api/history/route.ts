import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  try {
    const stmt = db.prepare('SELECT watchHistory FROM user_profiles WHERE userId = ?');
    const row = stmt.get(userId) as any;
    
    const history = row ? JSON.parse(row.watchHistory) : [];
    return NextResponse.json({ history });
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  try {
    const { history } = await req.json();
    const historyStr = JSON.stringify(history);

    const stmt = db.prepare(`
      INSERT INTO user_profiles (userId, watchHistory, updatedAt) 
      VALUES (?, ?, CURRENT_TIMESTAMP) 
      ON CONFLICT(userId) DO UPDATE SET watchHistory = excluded.watchHistory, updatedAt = CURRENT_TIMESTAMP
    `);
    stmt.run(userId, historyStr);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to sync history:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
