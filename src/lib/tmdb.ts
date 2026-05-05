const BASE_URL = "https://vortex-proxy-six.vercel.app/api/tmdb";

export interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: "movie" | "tv";
  vote_average?: number;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  adult?: boolean;
  genre_ids?: number[];
}

export interface TMDBResponse {
  page: number;
  results: TMDBItem[];
  total_pages: number;
  total_results: number;
}

export async function fetchTMDB(path: string, params: Record<string, string> = {}) {
  // Construct the full path with parameters included in the path string if provided
  let fullPath = path;
  const searchParams = new URLSearchParams(params);
  const paramString = searchParams.toString();
  
  if (paramString) {
    fullPath += (fullPath.includes('?') ? '&' : '?') + paramString;
  }
  
  // Directly append to BASE_URL. If fullPath contains '?', replace the first '?' with '&'
  // so it correctly chains with the '?path=' query parameter.
  const proxyPath = fullPath.replace('?', '&');
  const url = `${BASE_URL}?path=${proxyPath}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`Failed to fetch TMDB data: ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching TMDB:", error);
    return null;
  }
}

// Utility to filter out junk results
export function cleanData(items: TMDBItem[]): TMDBItem[] {
  if (!items) return [];

  const ADULT_KEYWORDS = [
    "hentai", "ecchi", "erotica", "sexual content", "nudity", 
    "uncensored", "sexual", "sex", "adult animation", "porn"
  ];

  const ADULT_TITLES = [
    "overflow", "sweet punishment", "redo of healer", "yosuga no sora",
    "high school dxd", "shimoneta", "prison school"
  ];

  return items.filter(item => {
    const title = (item.title || item.name || "").toLowerCase();
    const overview = (item.overview || "").toLowerCase();

    // 1. Filter out adult/nudity content explicitly
    if (item.adult === true) return false;

    // 2. Filter out specific blacklisted titles (common adult anime)
    if (ADULT_TITLES.some(t => title.includes(t))) return false;

    // 3. Filter out adult keywords in overview or title
    if (ADULT_KEYWORDS.some(k => overview.includes(k) || title.includes(k))) return false;

    // 4. Quality Filter: missing posters, backdrops, or empty overviews
    if (!item.poster_path || !item.backdrop_path || !item.overview) return false;
    return true;
  });
}

export async function getTrending() {
  const data = await fetchTMDB("trending/all/week?include_adult=false");
  return cleanData(data?.results || []);
}

export async function getPopularMovies() {
  const data = await fetchTMDB("movie/popular?include_adult=false");
  return cleanData(data?.results || []);
}

export async function getTopRatedTVShows() {
  const data = await fetchTMDB("tv/top_rated?include_adult=false");
  return cleanData(data?.results || []);
}

export async function getTrendingAnime() {
  const data = await fetchTMDB("discover/tv?with_keywords=210024&sort_by=popularity.desc&include_adult=false");
  return cleanData(data?.results || []);
}

export async function searchMulti(query: string, includeAdult: boolean = false) {
  const adultFlag = includeAdult ? "true" : "false";
  const [page1, page2] = await Promise.all([
    fetchTMDB(`search/multi?query=${encodeURIComponent(query)}&page=1&include_adult=${adultFlag}`),
    fetchTMDB(`search/multi?query=${encodeURIComponent(query)}&page=2&include_adult=${adultFlag}`)
  ]);
  const combined = [...(page1?.results || []), ...(page2?.results || [])];
  return cleanData(combined);
}

export async function getMovieDetails(id: string) {
  return await fetchTMDB(`movie/${id}`);
}

export async function getTVDetails(id: string) {
  return await fetchTMDB(`tv/${id}`);
}

export async function getMovieRecommendations(id: string) {
  const data = await fetchTMDB(`movie/${id}/recommendations`);
  return cleanData(data?.results || []);
}

export async function getTVRecommendations(id: string) {
  const data = await fetchTMDB(`tv/${id}/recommendations`);
  return cleanData(data?.results || []);
}

export async function discoverMovies(sortBy: string = "popularity.desc", page: number = 1) {
  const data = await fetchTMDB(`discover/movie?sort_by=${sortBy}&page=${page}&include_adult=false`);
  if (data?.results) data.results = cleanData(data.results);
  return data;
}

export async function discoverTV(sortBy: string = "popularity.desc", page: number = 1) {
  const data = await fetchTMDB(`discover/tv?sort_by=${sortBy}&page=${page}&include_adult=false`);
  if (data?.results) data.results = cleanData(data.results);
  return data;
}

export async function discoverAnime(sortBy: string = "popularity.desc", page: number = 1) {
  const data = await fetchTMDB(`discover/tv?with_keywords=210024&sort_by=${sortBy}&page=${page}&include_adult=false`);
  if (data?.results) data.results = cleanData(data.results);
  return data;
}
