import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import CollectionClient from "./CollectionClient";

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: collectionId } = await params;
  
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }

  const userId = (session.user as any).id;

  // Verify collection ownership
  const colStmt = db.prepare('SELECT * FROM collections WHERE id = ? AND userId = ?');
  const collection = colStmt.get(collectionId, userId) as any;

  if (!collection) {
    redirect("/profile");
  }

  const itemsStmt = db.prepare('SELECT * FROM collection_items WHERE collectionId = ? ORDER BY addedAt DESC');
  const items = itemsStmt.all(collectionId) as any[];

  return <CollectionClient initialCollection={collection} initialItems={items} />;
}

