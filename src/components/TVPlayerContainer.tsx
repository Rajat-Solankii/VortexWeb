"use client";
import { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import EpisodeSelector from "./EpisodeSelector";
import AdBanner from "./AdBanner";
import HistoryTracker from "./HistoryTracker";

export default function TVPlayerContainer({ id, tv }: { id: string, tv: any }) {
  const seasons = tv?.seasons || [];
  const validSeasons = seasons?.filter((s: any) => s.season_number > 0) || [];
  const initialSeason = validSeasons.length > 0 ? validSeasons[0].season_number : 1;
  const [season, setSeason] = useState(initialSeason);
  const [episode, setEpisode] = useState(1);

  return (
    <div className="w-full flex flex-col xl:flex-row gap-8 items-start">
      <HistoryTracker item={{ ...tv, media_type: 'tv' }} season={season} episode={episode} />
      
      <div className="flex-1 min-w-0 w-full">
        <h2 className="text-2xl font-bold text-white mb-4">
          Watch S{season} E{episode}
        </h2>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-vortex-purple to-vortex-blue rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative">
            <VideoPlayer type="tv" id={id} season={season} episode={episode} />
          </div>
        </div>
        
        {/* Adaptive Horizontal Ad */}
        <div className="w-full mt-8">
           <AdBanner className="h-auto min-h-[100px] aspect-[6/1] sm:aspect-[8/1]" dataAdSlot="7705358528" />
        </div>
      </div>

      <div className="w-full xl:w-[350px] shrink-0 xl:sticky xl:top-24">
        <EpisodeSelector 
           seasons={seasons} 
           onSelect={(s, e) => {
              setSeason(s);
              setEpisode(e);
              window.scrollTo({ top: 0, behavior: 'smooth' });
           }} 
        />
      </div>
    </div>
  );
}
