const BASE_URL = "https://vortex-proxy-six.vercel.app/api/tmdb";
const WITHOUT_ADULT_KEYWORDS = "12113,190370,181827,12053,155455,155456,155457,234333"; 
const CACHE_BUST = "v=4"; 

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
  let fullPath = path;
  const searchParams = new URLSearchParams(params);
  const paramString = searchParams.toString();
  
  if (paramString) {
    fullPath += (fullPath.includes('?') ? '&' : '?') + paramString;
  }
  
  const proxyPath = fullPath.replace('?', '&');
  const url = `${BASE_URL}?path=${proxyPath}`;

  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
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
export function cleanData(items: TMDBItem[], strict: boolean = true): TMDBItem[] {
  if (!items) return [];

  const ADULT_KEYWORDS = [
    "hentai", "ecchi", "erotica", "sexual content", "nudity", 
    "uncensored", "sexual", "sex", "adult animation", "porn",
    "joshiochi", "sweet punishment", "overflow", "redo of healer",
    "isekai meikyū", "harem in the labyrinth", "world's end harem"
  ];

  const ADULT_TITLES = [
    "overflow", "sweet punishment", "redo of healer", "yosuga no sora",
    "high school dxd", "shimoneta", "prison school", "joshiochi",
    "my wife is the student council president", "kiss x sis", 
    "monster musume", "to love ru", "testament of sister new devil",
    "labyrinth of another world", "harem in the labyrinth",
    "world's end harem", "valkyrie drive", "freezing", "seikon no qwaser"
  ];

  return items.filter(item => {
    // Basic Quality Filter: missing posters/backdrops
    if (!item.poster_path || !item.backdrop_path || !item.overview) return false;

    // Strict Filtering (For Homepage / Trending / Discover)
    if (strict) {
      const title = (item.title || item.name || "").toLowerCase();
      const overview = (item.overview || "").toLowerCase();

      if (item.adult === true) return false;
      if (ADULT_TITLES.some(t => title.includes(t))) return false;
      if (ADULT_KEYWORDS.some(k => overview.includes(k) || title.includes(k))) return false;
    }

    return true;
  });
}

export async function getTrending() {
  const data = await fetchTMDB(`trending/all/week?include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`);
  return cleanData(data?.results || [], true);
}

export async function getPopularMovies() {
  const data = await fetchTMDB(`movie/popular?include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`);
  return cleanData(data?.results || [], true);
}

export async function getTopRatedTVShows() {
  const data = await fetchTMDB(`tv/top_rated?include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`);
  return cleanData(data?.results || [], true);
}

export async function getTrendingAnime() {
  const data = await fetchTMDB(`discover/tv?with_keywords=210024&sort_by=popularity.desc&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`);
  return cleanData(data?.results || [], true);
}

export async function searchMulti(query: string, includeAdult: boolean = true) {
  // Search is unrestricted as per user request
  const adultFlag = "true"; 
  const [page1, page2] = await Promise.all([
    fetchTMDB(`search/multi?query=${encodeURIComponent(query)}&page=1&include_adult=${adultFlag}`),
    fetchTMDB(`search/multi?query=${encodeURIComponent(query)}&page=2&include_adult=${adultFlag}`)
  ]);
  const combined = [...(page1?.results || []), ...(page2?.results || [])];
  return cleanData(combined, false); // strict = false for search
}

export async function getKDramas() {
  const data = await fetchTMDB(`discover/tv?with_original_language=ko&sort_by=popularity.desc&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`);
  return cleanData(data?.results || [], true);
}

export async function getTurkishDramas() {
  const data = await fetchTMDB(`discover/tv?with_original_language=tr&sort_by=popularity.desc&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`);
  return cleanData(data?.results || [], true);
}

export async function getChineseDramas() {
  const data = await fetchTMDB(`discover/tv?with_original_language=zh&sort_by=popularity.desc&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`);
  return cleanData(data?.results || [], true);
}

export async function getPhilippineDramas() {
  const data = await fetchTMDB(`discover/tv?with_original_language=tl&sort_by=popularity.desc&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`);
  return cleanData(data?.results || [], true);
}

export async function getCredits(type: "movie" | "tv", id: string) {
  const data = await fetchTMDB(`${type}/${id}/credits`);
  return data?.cast?.slice(0, 12) || []; // Top 12 cast members
}

export async function getMovieDetails(id: string) {
  return await fetchTMDB(`movie/${id}`);
}

export async function getTVDetails(id: string) {
  return await fetchTMDB(`tv/${id}`);
}

export async function getMovieRecommendations(id: string) {
  const data = await fetchTMDB(`movie/${id}/recommendations?include_adult=false&${CACHE_BUST}`);
  return cleanData(data?.results || [], true);
}

export async function getTVRecommendations(id: string) {
  const data = await fetchTMDB(`tv/${id}/recommendations?include_adult=false&${CACHE_BUST}`);
  return cleanData(data?.results || [], true);
}

export async function discoverMovies(sortBy: string = "popularity.desc", page: number = 1) {
  const data = await fetchTMDB(`discover/movie?sort_by=${sortBy}&page=${page}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`);
  if (data?.results) data.results = cleanData(data.results, true);
  return data;
}

export async function discoverTV(sortBy: string = "popularity.desc", page: number = 1) {
  const data = await fetchTMDB(`discover/tv?sort_by=${sortBy}&page=${page}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`);
  if (data?.results) data.results = cleanData(data.results, true);
  return data;
}

export async function discoverAnime(sortBy: string = "popularity.desc", page: number = 1) {
  const data = await fetchTMDB(`discover/tv?with_keywords=210024&sort_by=${sortBy}&page=${page}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`);
  if (data?.results) data.results = cleanData(data.results, true);
  return data;
}
