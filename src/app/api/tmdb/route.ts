import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  
  if (!path) {
    return NextResponse.json({ error: "Missing 'path' parameter" }, { status: 400 });
  }

  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  if (!TMDB_API_KEY) {
    console.warn("TMDB_API_KEY is not set in environment variables!");
  }

  // Pass all other parameters directly to TMDB
  const params = new URLSearchParams(searchParams.toString());
  params.delete('path');
  params.set('api_key', TMDB_API_KEY || '');
  
  const url = `https://api.themoviedb.org/3/${path}?${params.toString()}`;

  let cacheSeconds = 3600;
  if (path.includes('trending') || path.includes('popular') || path.includes('discover')) {
    cacheSeconds = 86400; 
  } else if (path.includes('movie/') || path.includes('tv/')) {
    cacheSeconds = 604800; 
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // IMPORTANT: Setting Access-Control-Allow-Origin to '*' allows your Android App to fetch this API
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Cache-Control': `public, s-maxage=${cacheSeconds}, stale-while-revalidate=86400`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS preflight (important for mobile apps)
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
