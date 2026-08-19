"use client";

import { useState, useEffect } from "react";
import { getTVSeason } from "@/lib/tmdb";
import { Play } from "lucide-react";

interface Season {
  season_number: number;
  episode_count: number;
  name: string;
}

interface Episode {
  id: number;
  episode_number: number;
  original_episode_number?: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
}

export default function EpisodeSelector({ tvId, seasons, onSelect, animeEpisodeMap, isAnime }: { 
  tvId: string, 
  seasons: Season[], 
  onSelect: (s: number, e: number, absEp?: number) => void,
  animeEpisodeMap?: Record<number, any[]> | null,
  isAnime?: boolean
}) {
  const validSeasons = seasons?.filter(s => s.season_number > 0) || [];
  const [selectedSeason, setSelectedSeason] = useState(validSeasons[0]?.season_number || 1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSeason() {
      setLoading(true);
      try {
        // If we have anime episode map (from episode groups), use that directly
        if (isAnime && animeEpisodeMap && animeEpisodeMap[selectedSeason]) {
          const eps = animeEpisodeMap[selectedSeason];
          const now = new Date().toISOString().split('T')[0];
          const releasedEpisodes = eps.filter((ep: Episode) => ep.air_date && ep.air_date <= now);
          setEpisodes(releasedEpisodes);
        } else {
          // Default: fetch from TMDB season API
          const data = await getTVSeason(tvId, selectedSeason);
          const allEpisodes = data?.episodes || [];
          
          // Only show episodes that have already aired
          const now = new Date().toISOString().split('T')[0];
          const releasedEpisodes = allEpisodes.filter((ep: Episode) => ep.air_date && ep.air_date <= now);
          
          setEpisodes(releasedEpisodes);
        }
      } catch (error) {
        console.error("Failed to load episodes", error);
      } finally {
        setLoading(false);
      }
    }
    loadSeason();
  }, [tvId, selectedSeason, isAnime, animeEpisodeMap]);

  if (validSeasons.length === 0) return null;

  return (
    <div className="mt-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
           <span className="w-1.5 h-6 bg-vortex-purple rounded-full shadow-[0_0_10px_rgba(124,77,255,0.8)]"></span>
           <span>Episodes</span>
        </h3>
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide max-w-full">
           {validSeasons.map(s => (
             <button
               key={s.season_number}
               onClick={() => setSelectedSeason(s.season_number)}
               className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedSeason === s.season_number ? 'bg-vortex-purple text-white shadow-[0_0_15px_rgba(124,77,255,0.5)]' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
             >
               {s.name}
             </button>
           ))}
        </div>
      </div>
      
      <div className="space-y-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
              {episodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => onSelect(selectedSeason, ep.episode_number, ep.original_episode_number)}
                  className="flex items-start bg-white/5 hover:bg-white/10 border border-white/10 hover:border-vortex-purple/50 rounded-xl overflow-hidden text-left transition-all group"
                >
                  <div className="w-32 sm:w-40 flex-shrink-0 aspect-video relative">
                    {ep.still_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w300${ep.still_path}`} 
                        alt={ep.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-vortex-black/60 flex items-center justify-center text-xs text-gray-600">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white fill-current" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] text-white">
                      EP {ep.episode_number}
                    </div>
                  </div>
                  <div className="p-3 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-vortex-purple transition-colors">{ep.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{ep.overview || "No description available."}</p>
                    <p className="text-[10px] text-gray-600 mt-2">{ep.air_date}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
