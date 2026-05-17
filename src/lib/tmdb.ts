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
  popularity?: number;
  _score?: number;
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

  const FORBIDDEN_KEYWORDS = [
    "video game", "music video", "behind the scenes", "making of", "soundtrack",
    "roblox", "fan made", "fanmade", "fan-made", "tribute", "edit", "whatsapp status",
    "concept trailer", "unauthorized", "full movie in"
  ];

  return items.filter(item => {
    // Media Type Filter: Only allow movies and tv shows
    if (item.media_type && !["movie", "tv"].includes(item.media_type)) return false;
    
    // Quality Filter: Must have title/name and poster/backdrop
    if (!(item.title || item.name)) return false;
    if (!item.poster_path || !item.backdrop_path) return false;

    const title = (item.title || item.name || "").toLowerCase();
    const overview = (item.overview || "").toLowerCase();

    // Filter out games and irrelevant non-movie content
    if (FORBIDDEN_KEYWORDS.some(k => title.includes(k) || overview.includes(k))) return false;

    // Adult content check
    if (item.adult === true) return false;

    // Playability check: Ensure it has been released (unless we allow unreleased)
    const releaseDate = item.release_date || item.first_air_date;
    if (!allowUnreleased && releaseDate && releaseDate > now) return false;
    
    const voteCount = item.vote_count || 0;
    if (strict && !lenient && voteCount < 10) return false;
    if (lenient && voteCount < 0) return false; 

    // Filter out unplayable genres (News, Talk)
    const genreIds = item.genre_ids || [];
    const unplayableGenres = [10763, 10767];
    if (genreIds.some((id: number) => unplayableGenres.includes(id))) return false;

    // Strict Text Filtering (For Titles and Overviews)
    if (strict) {
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

// Levenshtein distance for typo tolerance
function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

async function getGoogleCorrection(query: string): Promise<string | null> {
  try {
    const isBrowser = typeof window !== "undefined";
    const url = isBrowser 
      ? `/api/suggestions?q=${encodeURIComponent(query)}`
      : `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`;
    
    const res = await fetch(url);
    const data = await res.json();
    // Google returns [query, [suggestions]]
    if (data && data[1] && data[1].length > 0) {
      const bestMatch = data[1][0];
      if (bestMatch.toLowerCase() !== query.toLowerCase()) {
        return bestMatch;
      }
    }
  } catch (e) {
    console.error("Correction error:", e);
  }
  return null;
}

export async function searchMulti(query: string, includeAdult: boolean = true, isForced: boolean = false) {
  const adultFlag = "true"; 
  const cleanQuery = query.toLowerCase().trim();
  const words = cleanQuery.split(/\s+/);
  let correctedQuery: string | undefined;
  
  // 1. Initial search
  let [page1, page2] = await Promise.all([
    fetchTMDB(`search/multi?query=${encodeURIComponent(query)}&page=1&include_adult=${adultFlag}`),
    fetchTMDB(`search/multi?query=${encodeURIComponent(query)}&page=2&include_adult=${adultFlag}`)
  ]);
  
  let combined = [...(page1?.results || []), ...(page2?.results || [])];
  
  // 2. Fallback for typos (Google-like correction)
  if (combined.length === 0 && !isForced) {
    const correction = await getGoogleCorrection(query);
    if (correction) {
      correctedQuery = correction;
      const [corrPage1, corrPage2] = await Promise.all([
        fetchTMDB(`search/multi?query=${encodeURIComponent(correction)}&page=1&include_adult=${adultFlag}`),
        fetchTMDB(`search/multi?query=${encodeURIComponent(correction)}&page=2&include_adult=${adultFlag}`)
      ]);
      combined = [...(corrPage1?.results || []), ...(corrPage2?.results || [])];
    }
  }

  // 3. Fallback for multi-word queries that return nothing
  if (combined.length === 0 && words.length > 1) {
    const fallback2Word = words.slice(0, 2).join(" ");
    const fallback1Word = words[0];
    
    const [data2, data1] = await Promise.all([
      fetchTMDB(`search/multi?query=${encodeURIComponent(fallback2Word)}&page=1&include_adult=${adultFlag}`),
      fetchTMDB(`search/multi?query=${encodeURIComponent(fallback1Word)}&page=1&include_adult=${adultFlag}`)
    ]);
    
    combined = [...(data2?.results || []), ...(data1?.results || [])];
  }
  
  // Deduplicate results
  const seenIds = new Set();
  const uniqueCombined = combined.filter(item => {
    if (seenIds.has(item.id)) return false;
    seenIds.add(item.id);
    return true;
  });

  // Clean and filter
  let cleaned = cleanData(uniqueCombined, false, true, true); 

  // Re-rank based on relevance (levenshtein) and popularity
  const ranked = cleaned.map(item => {
    const title = (item.title || item.name || "").toLowerCase();
    const distance = getLevenshteinDistance(cleanQuery, title);
    
    // Exact matches get a huge boost
    const isExact = title.includes(cleanQuery);
    // Partial word matches
    const containsAnyWord = words.some(w => w.length > 2 && title.includes(w));
    
    const score = (isExact ? 1000 : 0) + 
                  (containsAnyWord ? 200 : 0) + 
                  (item.popularity || 0) / 10 - 
                  distance * 5;
    
    return { ...item, _score: score };
  });

  const finalResults = ranked.sort((a: any, b: any) => b._score - a._score);
  return { results: finalResults, correctedQuery };
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

/**
 * Detect if a TV show is anime based on its metadata.
 * Checks for Animation genre (16) + Japanese original language.
 */
export function isAnime(tv: any): boolean {
  if (!tv) return false;
  const isJapanese = tv.original_language === 'ja';
  const hasAnimationGenre = tv.genres?.some((g: any) => g.id === 16) || false;
  return isJapanese && hasAnimationGenre;
}

/**
 * Look up the AniList ID for an anime by title.
 * Uses our /api/anilist route to query AniList's GraphQL API.
 */
export async function getAniListId(title: string): Promise<number | null> {
  try {
    const res = await fetch(`/api/anilist?title=${encodeURIComponent(title)}`);
    const data = await res.json();
    return data?.anilistId || null;
  } catch {
    return null;
  }
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

// Episode Groups API for anime with flattened seasons
export async function getEpisodeGroups(tvId: string) {
  return await fetchTMDB(`tv/${tvId}/episode_groups`);
}

export async function getEpisodeGroupDetails(groupId: string) {
  return await fetchTMDB(`tv/episode_group/${groupId}`);
}

/**
 * For anime that TMDB flattens into a single season, this finds the
 * "Seasons" episode group and returns properly structured season data.
 * Returns null if no episode group is found or the show isn't flattened.
 */
export async function getAnimeSeasonsFromEpisodeGroups(tvId: string, seasons: any[]) {
  // Only attempt this for shows with 1 real season (flattened anime)
  const realSeasons = seasons?.filter((s: any) => s.season_number > 0) || [];
  if (realSeasons.length !== 1) return null;
  
  try {
    const groupsData = await getEpisodeGroups(tvId);
    const groups = groupsData?.results || [];
    
    // Look for a "Seasons" type group (type 6 = Seasons order)
    const seasonsGroup = groups.find((g: any) => g.type === 6 && g.group_count > 1);
    if (!seasonsGroup) return null;
    
    const details = await getEpisodeGroupDetails(seasonsGroup.id);
    if (!details?.groups) return null;
    
    // Filter out specials (order 0 typically) and sort by order
    const seasonGroups = details.groups
      .filter((g: any) => g.name !== 'Specials' && g.episodes?.length > 0)
      .sort((a: any, b: any) => a.order - b.order);
    
    if (seasonGroups.length <= 1) return null;
    
    // Transform into the format EpisodeSelector expects
    const transformedSeasons = seasonGroups.map((g: any, idx: number) => ({
      season_number: idx + 1,
      episode_count: g.episodes.length,
      name: g.name || `Season ${idx + 1}`,
    }));
    
    // Build a map of season episodes with re-numbered episode_numbers
    const episodeMap: Record<number, any[]> = {};
    seasonGroups.forEach((g: any, idx: number) => {
      const seasonNum = idx + 1;
      episodeMap[seasonNum] = g.episodes.map((ep: any, epIdx: number) => ({
        ...ep,
        episode_number: epIdx + 1, // Re-number within season
        original_episode_number: ep.episode_number, // Keep absolute number
      }));
    });
    
    return { seasons: transformedSeasons, episodeMap };
  } catch (error) {
    console.error('Failed to fetch episode groups:', error);
    return null;
  }
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
