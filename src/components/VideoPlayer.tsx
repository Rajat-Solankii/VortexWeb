"use client";
import { useState } from "react";

export default function VideoPlayer({ type, id, season, episode }: { type: "movie" | "tv", id: string, season?: number, episode?: number }) {
  const [server, setServer] = useState(1);

  let url = "";
  if (type === "movie") {
    if (server === 1) url = `https://player.videasy.net/movie/${id}`;
    else if (server === 2) url = `https://vidsrc.me/embed/movie?tmdb=${id}`;
    else if (server === 3) url = `https://embed.su/embed/movie/${id}`;
  } else {
    const s = season || 1;
    const e = episode || 1;
    if (server === 1) url = `https://player.videasy.net/tv/${id}/${s}/${e}`;
    else if (server === 2) url = `https://vidsrc.me/embed/tv?tmdb=${id}&sea=${s}&epi=${e}`;
    else if (server === 3) url = `https://embed.su/embed/tv/${id}/${s}/${e}`;
  }

  return (
    <div className="space-y-4">
      <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(124,77,255,0.2)] border border-white/10 relative group">
        <iframe
          src={url}
          allowFullScreen
          className="w-full h-full absolute inset-0"
          style={{ border: "none" }}
        ></iframe>
        
        {/* Loading Overlay Hint */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
           <p className="text-xs text-white/20 uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">Server {server} Active</p>
        </div>
      </div>

      {/* Server Switcher */}
      <div className="flex flex-wrap items-center gap-3 py-2">
         <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">Switch Server:</span>
         <button 
           onClick={() => setServer(1)}
           className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${server === 1 ? 'bg-vortex-purple text-white shadow-[0_0_15px_rgba(124,77,255,0.5)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
         >
           SERVER 1
         </button>
         <button 
           onClick={() => setServer(2)}
           className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${server === 2 ? 'bg-vortex-purple text-white shadow-[0_0_15px_rgba(124,77,255,0.5)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
         >
           SERVER 2 (Best for Cartoons)
         </button>
         <button 
           onClick={() => setServer(3)}
           className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${server === 3 ? 'bg-vortex-purple text-white shadow-[0_0_15px_rgba(124,77,255,0.5)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
         >
           SERVER 3
         </button>
      </div>
      
      <p className="text-[10px] text-gray-500 italic">
        *Tip: If one server doesn&apos;t work or has no data, try switching to another server.
      </p>
    </div>
  );
}
