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
    <div className="xl:mt-0 mt-8 space-y-6 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
      <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
         <span className="w-1.5 h-6 bg-vortex-purple rounded-full shadow-[0_0_10px_rgba(124,77,255,0.8)]"></span>
         <span>Episodes</span>
      </h3>

      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
         {validSeasons.map(s => (
           <button
             key={s.season_number}
             onClick={() => setSelectedSeason(s.season_number)}
             className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedSeason === s.season_number ? 'bg-vortex-purple text-white shadow-[0_0_15px_rgba(124,77,255,0.5)]' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
           >
             {s.name}
           </button>
         ))}
      </div>
      
      {currentSeason && (
         <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-2 gap-3 max-h-[400px] xl:max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
           {Array.from({ length: currentSeason.episode_count }).map((_, i) => (
             <button
               key={i}
               onClick={() => onSelect(currentSeason.season_number, i + 1)}
               className="bg-white/5 hover:bg-white/15 border border-white/10 hover:border-vortex-purple/50 rounded-xl p-3 text-left transition-all group relative overflow-hidden"
             >
               <div className="absolute inset-0 bg-gradient-to-br from-vortex-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <span className="text-gray-400 text-xs font-medium block mb-0.5 group-hover:text-vortex-purple transition-colors">Episode</span>
               <span className="text-white text-sm font-bold block">{i + 1}</span>
             </button>
           ))}
         </div>
      )}
    </div>
  );
}
