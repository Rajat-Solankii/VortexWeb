"use client";
import { useState } from "react";

export default function VideoPlayer({ type, id, season, episode }: { type: "movie" | "tv", id: string, season?: number, episode?: number }) {
  const [server, setServer] = useState(1);

  let url = "";
  const s = season || 1;
  const e = episode || 1;

  if (type === "movie") {
    switch(server) {
      case 1: url = `https://player.videasy.net/movie/${id}`; break;
      case 2: url = `https://vidsrc.me/embed/movie?tmdb=${id}`; break;
      case 3: url = `https://embed.su/embed/movie/${id}`; break;
      case 4: url = `https://vidsrc.xyz/embed/movie?tmdb=${id}`; break;
      case 5: url = `https://player.smashy.stream/movie/${id}`; break;
      default: url = `https://player.videasy.net/movie/${id}`;
    }
  } else {
    switch(server) {
      case 1: url = `https://player.videasy.net/tv/${id}/${s}/${e}`; break;
      case 2: url = `https://vidsrc.me/embed/tv?tmdb=${id}&sea=${s}&epi=${e}`; break;
      case 3: url = `https://embed.su/embed/tv/${id}/${s}/${e}`; break;
      case 4: url = `https://vidsrc.xyz/embed/tv?tmdb=${id}&sea=${s}&epi=${e}`; break;
      case 5: url = `https://player.smashy.stream/tv/${id}?s=${s}&e=${e}`; break;
      default: url = `https://player.videasy.net/tv/${id}/${s}/${e}`;
    }
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
      <div className="py-4 border-t border-white/5">
         <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-vortex-purple uppercase tracking-[0.2em]">Playback Servers</span>
                <span className="text-[9px] text-gray-500 uppercase">Try different servers if data is missing</span>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                    <button 
                        key={num}
                        onClick={() => setServer(num)}
                        className={`py-2.5 rounded-xl text-[11px] font-bold transition-all border ${server === num ? 'bg-vortex-purple text-white border-vortex-purple shadow-[0_0_20px_rgba(124,77,255,0.4)]' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'}`}
                    >
                        SERVER {num}
                    </button>
                ))}
            </div>
         </div>
      </div>
      
      <div className="flex items-center space-x-2 text-[10px] text-gray-500 p-3 bg-white/5 rounded-xl border border-white/5">
        <span className="w-1.5 h-1.5 rounded-full bg-vortex-purple animate-pulse"></span>
        <p>Pro Tip: <span className="text-white">Server 2</span> and <span className="text-white">Server 4</span> have the best libraries for cartoons and TV shows.</p>
      </div>
    </div>
  );
}
