import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { LogOut, Bookmark, Play, Settings, Clock, Trash2 } from "lucide-react";
import Image from "next/image";

import ProfileDashboardClient from "./ProfileDashboardClient";

export default async function ProfilePage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const userId = (session.user as any).id;
  
  const bookmarksStmt = db.prepare('SELECT * FROM bookmarks WHERE userId = ? ORDER BY createdAt DESC');
  const bookmarks = bookmarksStmt.all(userId) as any[];

  let history = [];
  try {
    const historyStmt = db.prepare('SELECT watchHistory FROM user_profiles WHERE userId = ?');
    const historyRow = historyStmt.get(userId) as any;
    if (historyRow && historyRow.watchHistory) {
      history = JSON.parse(historyRow.watchHistory);
    }
  } catch (err) {
    console.error("Error fetching history:", err);
  }

  const collectionsStmt = db.prepare(`
    SELECT c.*, COUNT(ci.id) as itemsCount
    FROM collections c
    LEFT JOIN collection_items ci ON c.id = ci.collectionId
    WHERE c.userId = ?
    GROUP BY c.id
    ORDER BY c.createdAt DESC
  `);
  const collections = collectionsStmt.all(userId) as any[];

  return (
    <ProfileDashboardClient 
      user={session.user} 
      bookmarks={bookmarks} 
      history={history} 
      initialCollections={collections}
    />
  );
}
