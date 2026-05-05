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
      {/* Video Container */}
      <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(124,77,255,0.15)] border border-white/10 relative">
        <iframe
          src={url}
          allowFullScreen
          className="w-full h-full absolute inset-0"
          style={{ border: "none" }}
        ></iframe>
      </div>

      {/* Server Switcher */}
      <div className="flex flex-wrap items-center gap-3 py-4 border-t border-white/5">
         <div className="flex flex-col">
            <span className="text-[10px] font-black text-vortex-purple uppercase tracking-[0.2em] mb-2">Streaming Servers</span>
            <div className="flex flex-wrap gap-2">
                <button 
                onClick={() => setServer(1)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all border ${server === 1 ? 'bg-vortex-purple text-white border-vortex-purple shadow-[0_0_20px_rgba(124,77,255,0.4)]' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'}`}
                >
                Main Server
                </button>
                <button 
                onClick={() => setServer(2)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all border ${server === 2 ? 'bg-vortex-purple text-white border-vortex-purple shadow-[0_0_20px_rgba(124,77,255,0.4)]' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'}`}
                >
                Cartoon Specialist
                </button>
                <button 
                onClick={() => setServer(3)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all border ${server === 3 ? 'bg-vortex-purple text-white border-vortex-purple shadow-[0_0_20px_rgba(124,77,255,0.4)]' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'}`}
                >
                Backup Server
                </button>
            </div>
         </div>
      </div>
      
      <div className="flex items-center space-x-2 text-[10px] text-gray-500">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
        <p>Switch to <span className="text-vortex-purple font-bold">Cartoon Specialist</span> if the main server has no data for animated shows.</p>
      </div>
    </div>
  );
}
