"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VideoPlayer from "./VideoPlayer";
import EpisodeSelector from "./EpisodeSelector";
import HistoryTracker from "./HistoryTracker";

interface AnimeSeasons {
  seasons: { season_number: number; episode_count: number; name: string }[];
  episodeMap: Record<number, any[]>;
}

function TVPlayerContent({ id, tv, isAnimeShow, animeSeasons }: { id: string, tv: any, isAnimeShow?: boolean, animeSeasons?: AnimeSeasons | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Use anime episode group seasons if available, otherwise default TMDB seasons
  const effectiveSeasons = animeSeasons?.seasons || tv?.seasons || [];
  const validSeasons = effectiveSeasons?.filter((s: any) => s.season_number > 0) || [];
  const initialSeason = validSeasons.length > 0 ? validSeasons[0].season_number : 1;
  
  const [season, setSeason] = useState(initialSeason);
  const [episode, setEpisode] = useState(1);
  // For anime, we need the absolute episode number for the video player
  const [absoluteEpisode, setAbsoluteEpisode] = useState(1);


  useEffect(() => {
    const s = searchParams.get("s");
    const e = searchParams.get("e");
    
    if (s) setSeason(parseInt(s, 10));
    if (e) {
      const epNum = parseInt(e, 10);
      setEpisode(epNum);
      
      // For anime with episode groups, calculate absolute episode number
      if (isAnimeShow && animeSeasons?.episodeMap) {
        const seasonEps = animeSeasons.episodeMap[parseInt(s || String(initialSeason), 10)];
        if (seasonEps && seasonEps[epNum - 1]) {
          setAbsoluteEpisode(seasonEps[epNum - 1].original_episode_number);
        } else {
          setAbsoluteEpisode(epNum);
        }
      } else {
        setAbsoluteEpisode(epNum);
      }
    }
  }, [searchParams, isAnimeShow, animeSeasons, initialSeason]);

  const handleEpisodeSelect = (s: number, e: number, absEp?: number) => {
    router.push(`/tv/${id}?s=${s}&e=${e}`, { scroll: false });
    setSeason(s);
    setEpisode(e);
    if (absEp !== undefined) {
      setAbsoluteEpisode(absEp);
    } else {
      setAbsoluteEpisode(e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col justify-start">
      <HistoryTracker item={{ ...tv, media_type: 'tv' }} season={season} episode={episode} />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">
          Watch S{season} E{episode}
        </h2>
      </div>
      <VideoPlayer 
        type="tv" 
        id={id} 
        season={season} 
        episode={episode} 
        title={tv.name}
        tmdbSeason={season}
        tmdbEpisode={episode}
      />
      
      <EpisodeSelector 
         tvId={id}
         seasons={effectiveSeasons} 
         onSelect={handleEpisodeSelect}
         animeEpisodeMap={animeSeasons?.episodeMap}
         isAnime={isAnimeShow}
      />
    </div>
  );
}

export default function TVPlayerContainer({ id, tv, isAnimeShow, animeSeasons }: { id: string, tv: any, isAnimeShow?: boolean, animeSeasons?: AnimeSeasons | null }) {
  return (
    <Suspense fallback={<div className="w-full aspect-video bg-white/5 animate-pulse rounded-2xl flex items-center justify-center text-gray-500">Loading Player...</div>}>
      <TVPlayerContent id={id} tv={tv} isAnimeShow={isAnimeShow} animeSeasons={animeSeasons} />
    </Suspense>
  );
}
