"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VideoPlayer from "./VideoPlayer";
import EpisodeSelector from "./EpisodeSelector";
import HistoryTracker from "./HistoryTracker";
import DownloadMediaButton from "./DownloadMediaButton";

function TVPlayerContent({ id, tv }: { id: string, tv: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const seasons = tv?.seasons || [];
  const validSeasons = seasons?.filter((s: any) => s.season_number > 0) || [];
  const initialSeason = validSeasons.length > 0 ? validSeasons[0].season_number : 1;
  
  const [season, setSeason] = useState(initialSeason);
  const [episode, setEpisode] = useState(1);

  useEffect(() => {
    const s = searchParams.get("s");
    const e = searchParams.get("e");
    
    if (s) setSeason(parseInt(s, 10));
    if (e) setEpisode(parseInt(e, 10));
  }, [searchParams]);

  const handleEpisodeSelect = (s: number, e: number) => {
    router.push(`/tv/${id}?s=${s}&e=${e}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col justify-start">
      <HistoryTracker item={{ ...tv, media_type: 'tv' }} season={season} episode={episode} />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">
          Watch S{season} E{episode}
        </h2>
        <DownloadMediaButton type="tv" id={id} season={season} episode={episode} title={tv.name} />
      </div>
      <VideoPlayer type="tv" id={id} season={season} episode={episode} title={tv.name} />
      
      <EpisodeSelector 
         tvId={id}
         seasons={seasons} 
         onSelect={handleEpisodeSelect} 
      />
    </div>
  );
}

export default function TVPlayerContainer({ id, tv }: { id: string, tv: any }) {
  return (
    <Suspense fallback={<div className="w-full aspect-video bg-white/5 animate-pulse rounded-2xl flex items-center justify-center text-gray-500">Loading Player...</div>}>
      <TVPlayerContent id={id} tv={tv} />
    </Suspense>
  );
}
