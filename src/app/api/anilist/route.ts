import { NextRequest, NextResponse } from "next/server";

const ANILIST_API = "https://graphql.anilist.co";

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title");

  if (!title) {
    return NextResponse.json({ error: "Missing title" }, { status: 400 });
  }

  try {
    const query = `
      query ($search: String) {
        Media(search: $search, type: ANIME, format_in: [TV, TV_SHORT, ONA]) {
          id
          idMal
          title {
            romaji
            english
          }
          episodes
        }
      }
    `;

    const res = await fetch(ANILIST_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { search: title } }),
    });

    const data = await res.json();
    const media = data?.data?.Media;

    if (!media) {
      return NextResponse.json({ anilistId: null });
    }

    return NextResponse.json({
      anilistId: media.id,
      malId: media.idMal,
      title: media.title,
      episodes: media.episodes,
    });
  } catch (error) {
    console.error("AniList lookup error:", error);
    return NextResponse.json({ anilistId: null });
  }
}
