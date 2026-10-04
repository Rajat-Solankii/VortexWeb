import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const stmt = db.prepare("SELECT value FROM settings WHERE key = ?");
    const setting = stmt.get(key) as any;

    if (!setting) {
      return NextResponse.json({ value: null }, { status: 404 });
    }

    return NextResponse.json({ value: setting.value }, { status: 200 });
  } catch (error) {
    console.error("Error fetching setting:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
