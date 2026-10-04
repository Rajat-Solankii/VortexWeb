import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const stmt = db.prepare(`
      SELECT c.*, COUNT(ci.id) as itemsCount
      FROM collections c
      LEFT JOIN collection_items ci ON c.id = ci.collectionId
      WHERE c.userId = ?
      GROUP BY c.id
      ORDER BY c.createdAt DESC
    `);
    const collectionsWithCount = stmt.all(userId);

    return NextResponse.json({ collections: collectionsWithCount });
  } catch (error) {
    console.error("Collections fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Collection name is required" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    const collectionId = randomUUID();

    const stmt = db.prepare('INSERT INTO collections (id, userId, name) VALUES (?, ?, ?)');
    stmt.run(collectionId, userId, name.trim());

    return NextResponse.json({ 
      collection: { 
        id: collectionId, 
        userId, 
        name: name.trim(), 
        itemsCount: 0 
      } 
    });
  } catch (error) {
    console.error("Collections create error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
