import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getAuthSession();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name } = await req.json();
    if (!name || !name.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const userId = (session.user as any).id;
    
    // Verify ownership
    const colStmt = db.prepare('SELECT id FROM collections WHERE id = ? AND userId = ?');
    if (!colStmt.get(id, userId)) return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });

    const updateStmt = db.prepare('UPDATE collections SET name = ? WHERE id = ?');
    updateStmt.run(name.trim(), id);

    return NextResponse.json({ success: true, name: name.trim() });
  } catch (error) {
    console.error("Collection rename error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getAuthSession();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    
    // Verify ownership
    const colStmt = db.prepare('SELECT id FROM collections WHERE id = ? AND userId = ?');
    if (!colStmt.get(id, userId)) return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });

    // Delete items first
    db.prepare('DELETE FROM collection_items WHERE collectionId = ?').run(id);
    db.prepare('DELETE FROM collections WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Collection delete error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
