"use client";
import { useState } from "react";

interface Season {
  season_number: number;
  episode_count: number;
  name: string;
}

export default function EpisodeSelector({ seasons, onSelect }: { seasons: Season[], onSelect: (s: number, e: number) => void }) {
  const validSeasons = seasons?.filter(s => s.season_number > 0) || [];
  const [selectedSeason, setSelectedSeason] = useState(validSeasons[0]?.season_number || 1);
  const currentSeason = validSeasons.find(s => s.season_number === selectedSeason);

  if (validSeasons.length === 0) return null;

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
         <span className="w-1.5 h-6 bg-vortex-purple rounded-full shadow-[0_0_10px_rgba(124,77,255,0.8)]"></span>
         <span>Episodes</span>
      </h3>
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
         {validSeasons.map(s => (
           <button
             key={s.season_number}
             onClick={() => setSelectedSeason(s.season_number)}
             className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${selectedSeason === s.season_number ? 'bg-vortex-purple text-white shadow-[0_0_15px_rgba(124,77,255,0.5)]' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
           >
             {s.name}
           </button>
         ))}
      </div>
      
      {currentSeason && (
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
           {Array.from({ length: currentSeason.episode_count }).map((_, i) => (
             <button
               key={i}
               onClick={() => onSelect(currentSeason.season_number, i + 1)}
               className="bg-white/5 hover:bg-white/15 border border-white/10 hover:border-vortex-blue/50 rounded-lg p-3 text-center transition-all hover:shadow-[0_0_15px_rgba(0,176,255,0.4)] group"
             >
               <span className="text-gray-400 text-sm group-hover:text-white transition-colors">Episode {i + 1}</span>
             </button>
           ))}
         </div>
      )}
    </div>
  );
}
