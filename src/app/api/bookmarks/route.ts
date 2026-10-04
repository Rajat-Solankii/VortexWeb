import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const { searchParams } = new URL(req.url);
  const mediaId = searchParams.get("mediaId");
  const mediaType = searchParams.get("mediaType");

  try {
    if (mediaId && mediaType) {
      const stmt = db.prepare('SELECT id FROM bookmarks WHERE userId = ? AND mediaId = ? AND mediaType = ?');
      const bookmark = stmt.get(userId, mediaId, mediaType);
      return NextResponse.json({ isBookmarked: !!bookmark });
    }

    const stmt = db.prepare('SELECT * FROM bookmarks WHERE userId = ? ORDER BY createdAt DESC');
    const bookmarks = stmt.all(userId);
    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error("Failed to fetch bookmarks:", error);
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
    const { mediaId, mediaType, title, posterPath, action } = await req.json();

    if (action === 'remove') {
      const stmt = db.prepare('DELETE FROM bookmarks WHERE userId = ? AND mediaId = ? AND mediaType = ?');
      stmt.run(userId, mediaId, mediaType);
    } else {
      const stmt = db.prepare(`
        INSERT INTO bookmarks (userId, mediaId, mediaType, title, posterPath) 
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(userId, mediaId, mediaType) DO NOTHING
      `);
      stmt.run(userId, mediaId, mediaType, title, posterPath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to modify bookmark:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getAuthSession();
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const { searchParams } = new URL(req.url);
  const mediaId = searchParams.get("mediaId");
  const mediaType = searchParams.get("mediaType");

  if (!mediaId || !mediaType) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const stmt = db.prepare('DELETE FROM bookmarks WHERE userId = ? AND mediaId = ? AND mediaType = ?');
    stmt.run(userId, mediaId, mediaType);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete bookmark:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
