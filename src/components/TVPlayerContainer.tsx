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
    <div className="w-full flex flex-col justify-start">
      <HistoryTracker item={{ ...tv, media_type: 'tv' }} season={season} episode={episode} />
      <h2 className="text-2xl font-bold text-white mb-4">
        Watch S{season} E{episode}
      </h2>
      <VideoPlayer type="tv" id={id} season={season} episode={episode} />
      
      {/* Adaptive Horizontal Ad */}
      <div className="w-full mt-6 mb-2">
         <AdBanner className="h-auto min-h-[100px] aspect-[6/1] sm:aspect-[8/1]" dataAdSlot="7705358528" />
      </div>

      <EpisodeSelector 
         seasons={seasons} 
         onSelect={(s, e) => {
            setSeason(s);
            setEpisode(e);
            window.scrollTo({ top: 0, behavior: 'smooth' });
         }} 
      />
    </div>
  );
}
