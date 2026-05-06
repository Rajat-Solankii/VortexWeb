import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const googleUrl = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(q)}`;
    const res = await fetch(googleUrl);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Suggestion proxy error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
