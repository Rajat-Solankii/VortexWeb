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
  vote_count?: number;
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
export function cleanData(items: TMDBItem[], strict: boolean = true, allowUnreleased: boolean = false, lenient: boolean = false): TMDBItem[] {
  if (!items) return [];

  const now = new Date().toISOString().split('T')[0];

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
    if (!item.poster_path || !item.backdrop_path) return false;

    // Adult content check
    if (item.adult === true) return false;

    // Playability check: Ensure it has been released (unless we allow unreleased)
    const releaseDate = item.release_date || item.first_air_date;
    if (!allowUnreleased && releaseDate && releaseDate > now) return false;
    
    // Vote Count Check: 
    // Strict mode (Homepage) requires 10+ votes.
    // Lenient mode (Discovery pages) requires at least 1 vote.
    const voteCount = item.vote_count || 0;
    if (strict && !lenient && voteCount < 10) return false;
    if (lenient && voteCount < 1) return false;

    // Filter out unplayable genres (News, Talk)
    const genreIds = item.genre_ids || [];
    const unplayableGenres = [10763, 10767];
    if (genreIds.some((id: number) => unplayableGenres.includes(id))) return false;

    // Strict Text Filtering (For Titles and Overviews)
    if (strict) {
      const title = (item.title || item.name || "").toLowerCase();
      const overview = (item.overview || "").toLowerCase();

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
  const adultFlag = "true"; 
  const [page1, page2] = await Promise.all([
    fetchTMDB(`search/multi?query=${encodeURIComponent(query)}&page=1&include_adult=${adultFlag}`),
    fetchTMDB(`search/multi?query=${encodeURIComponent(query)}&page=2&include_adult=${adultFlag}`)
  ]);
  const combined = [...(page1?.results || []), ...(page2?.results || [])];
  return cleanData(combined, false); 
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
  return data?.cast?.slice(0, 12) || []; 
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
  const [p1, p2] = await Promise.all([
    fetchTMDB(`discover/movie?sort_by=${sortBy}&page=${page * 2 - 1}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`),
    fetchTMDB(`discover/movie?sort_by=${sortBy}&page=${page * 2}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`)
  ]);
  const results = [...(p1?.results || []), ...(p2?.results || [])];
  return { results: cleanData(results, true, false, true) };
}

export async function discoverTV(sortBy: string = "popularity.desc", page: number = 1) {
  const [p1, p2] = await Promise.all([
    fetchTMDB(`discover/tv?sort_by=${sortBy}&page=${page * 2 - 1}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`),
    fetchTMDB(`discover/tv?sort_by=${sortBy}&page=${page * 2}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`)
  ]);
  const results = [...(p1?.results || []), ...(p2?.results || [])];
  return { results: cleanData(results, true, false, true) };
}

export async function discoverAnime(sortBy: string = "popularity.desc", page: number = 1) {
  const [p1, p2] = await Promise.all([
    fetchTMDB(`discover/tv?with_keywords=210024&sort_by=${sortBy}&page=${page * 2 - 1}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`),
    fetchTMDB(`discover/tv?with_keywords=210024&sort_by=${sortBy}&page=${page * 2}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`)
  ]);
  const results = [...(p1?.results || []), ...(p2?.results || [])];
  return { results: cleanData(results, true, false, true) };
}

export async function discoverBollywood(sortBy: string = "popularity.desc", page: number = 1) {
  const [p1, p2] = await Promise.all([
    fetchTMDB(`discover/movie?with_original_language=hi|ta|te&sort_by=${sortBy}&page=${page * 2 - 1}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`),
    fetchTMDB(`discover/movie?with_original_language=hi|ta|te&sort_by=${sortBy}&page=${page * 2}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`)
  ]);
  const results = [...(p1?.results || []), ...(p2?.results || [])];
  return { results: cleanData(results, true, false, true) };
}

export async function discoverHollywood(sortBy: string = "popularity.desc", page: number = 1) {
  const [p1, p2] = await Promise.all([
    fetchTMDB(`discover/movie?with_original_language=en&sort_by=${sortBy}&page=${page * 2 - 1}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`),
    fetchTMDB(`discover/movie?with_original_language=en&sort_by=${sortBy}&page=${page * 2}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`)
  ]);
  const results = [...(p1?.results || []), ...(p2?.results || [])];
  return { results: cleanData(results, true, false, true) };
}

export async function getBollywoodMovies() {
  const data = await fetchTMDB(`discover/movie?with_original_language=hi|ta|te&sort_by=popularity.desc&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`);
  return cleanData(data?.results || [], true);
}

export async function getUpcomingMovies() {
  const data = await fetchTMDB(`movie/upcoming?include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`);
  return cleanData(data?.results || [], true, true);
}

export async function getVideos(type: "movie" | "tv", id: string) {
  const data = await fetchTMDB(`${type}/${id}/videos`);
  return data?.results?.filter((v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")) || [];
}

export async function getGenres(type: "movie" | "tv") {
  const data = await fetchTMDB(`genre/${type}/list`);
  return data?.genres || [];
}

export async function getTVSeason(id: string, season: number) {
  return await fetchTMDB(`tv/${id}/season/${season}`);
}

export async function discoverByGenre(type: "movie" | "tv", genreId: string, sortBy: string = "popularity.desc", page: number = 1) {
  const data = await fetchTMDB(`discover/${type}?with_genres=${genreId}&sort_by=${sortBy}&page=${page}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`);
  if (data?.results) data.results = cleanData(data.results, true, false, true);
  return data;
}

export async function discoverKDramas(sortBy: string = "popularity.desc", page: number = 1) {
  const data = await fetchTMDB(`discover/tv?with_original_language=ko&sort_by=${sortBy}&page=${page}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`);
  if (data?.results) data.results = cleanData(data.results, true, false, true);
  return data;
}

export async function discoverDramas(sortBy: string = "popularity.desc", page: number = 1) {
  const data = await fetchTMDB(`discover/tv?with_original_language=ko|tr|zh|tl&sort_by=${sortBy}&page=${page}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`);
  if (data?.results) data.results = cleanData(data.results, true, false, true);
  return data;
}

export async function discoverCartoons(sortBy: string = "popularity.desc", page: number = 1, lang?: string) {
  const languages = lang || "en|hi|ja"; // Default to common cartoon languages
  // 16 = Animation, 10762 = Kids
  const [p1, p2, p3, p4] = await Promise.all([
    fetchTMDB(`discover/tv?with_genres=16,10762&with_original_language=${languages}&sort_by=${sortBy}&page=${page * 4 - 3}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`),
    fetchTMDB(`discover/tv?with_genres=16,10762&with_original_language=${languages}&sort_by=${sortBy}&page=${page * 4 - 2}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`),
    fetchTMDB(`discover/tv?with_genres=16,10762&with_original_language=${languages}&sort_by=${sortBy}&page=${page * 4 - 1}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`),
    fetchTMDB(`discover/tv?with_genres=16,10762&with_original_language=${languages}&sort_by=${sortBy}&page=${page * 4}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`)
  ]);
  
  const results = [...(p1?.results || []), ...(p2?.results || []), ...(p3?.results || []), ...(p4?.results || [])];
  return { results: cleanData(results, true, false, true) };
}

export async function getAllDramas(sortBy: string = "popularity.desc", page: number = 1, lang?: string, allowUnreleased: boolean = false) {
  const languages = lang || "ko|tr|zh|tl";
  
  const [p1, p2, p3, p4] = await Promise.all([
    fetchTMDB(`discover/tv?with_original_language=${languages}&sort_by=${sortBy}&page=${page * 4 - 3}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`),
    fetchTMDB(`discover/tv?with_original_language=${languages}&sort_by=${sortBy}&page=${page * 4 - 2}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`),
    fetchTMDB(`discover/tv?with_original_language=${languages}&sort_by=${sortBy}&page=${page * 4 - 1}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`),
    fetchTMDB(`discover/tv?with_original_language=${languages}&sort_by=${sortBy}&page=${page * 4}&include_adult=false&without_keywords=${WITHOUT_ADULT_KEYWORDS}&${CACHE_BUST}`)
  ]);
  
  const results = [...(p1?.results || []), ...(p2?.results || []), ...(p3?.results || []), ...(p4?.results || [])];
  return { results: cleanData(results, true, allowUnreleased, true) };
}
