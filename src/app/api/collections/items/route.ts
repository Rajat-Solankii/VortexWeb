import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { collectionId, mediaId, mediaType, title, posterPath } = await req.json();

    if (!collectionId || !mediaId || !mediaType || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    
    // Verify user owns the collection
    const colStmt = db.prepare('SELECT id FROM collections WHERE id = ? AND userId = ?');
    const col = colStmt.get(collectionId, userId);
    
    if (!col) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    const stmt = db.prepare(`
      INSERT INTO collection_items (collectionId, mediaId, mediaType, title, posterPath)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(collectionId, mediaId, mediaType) DO NOTHING
    `);
    
    stmt.run(collectionId, String(mediaId), mediaType, title, posterPath || null);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Collection add item error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const collectionId = searchParams.get('collectionId');
    const mediaId = searchParams.get('mediaId');
    const mediaType = searchParams.get('mediaType');

    if (!collectionId || !mediaId || !mediaType) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    
    const colStmt = db.prepare('SELECT id FROM collections WHERE id = ? AND userId = ?');
    if (!colStmt.get(collectionId, userId)) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    const stmt = db.prepare('DELETE FROM collection_items WHERE collectionId = ? AND mediaId = ? AND mediaType = ?');
    stmt.run(collectionId, String(mediaId), mediaType);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Collection delete item error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
