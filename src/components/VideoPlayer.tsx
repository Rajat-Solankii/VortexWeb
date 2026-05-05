"use client";
import { useState } from "react";

export default function VideoPlayer({ type, id, season, episode, title }: { type: "movie" | "tv", id: string, season?: number, episode?: number, title?: string }) {
  const [server, setServer] = useState(1);

  let url = "";
  const s = season || 1;
  const e = episode || 1;

  if (type === "movie") {
    switch(server) {
      case 1: url = `https://player.videasy.net/movie/${id}`; break;
      case 2: url = `https://vidsrc.me/embed/movie?tmdb=${id}`; break;
      case 3: url = `https://vidsrc.xyz/embed/movie?tmdb=${id}`; break;
      case 4: url = `https://vidsrc.cc/v2/embed/movie/${id}`; break;
      case 5: url = `https://www.superembed.cc/embed/movie/${id}`; break;
      default: url = `https://player.videasy.net/movie/${id}`;
    }
  } else {
    switch(server) {
      case 1: url = `https://player.videasy.net/tv/${id}/${s}/${e}`; break;
      case 2: url = `https://vidsrc.me/embed/tv?tmdb=${id}&sea=${s}&epi=${e}`; break;
      case 3: url = `https://vidsrc.xyz/embed/tv?tmdb=${id}&sea=${s}&epi=${e}`; break;
      case 4: url = `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`; break;
      case 5: url = `https://www.superembed.cc/embed/tv/${id}/${s}/${e}`; break;
      default: url = `https://player.videasy.net/tv/${id}/${s}/${e}`;
    }
  }

  const youtubeQuery = encodeURIComponent(`${title || ""} full episode ${type === 'tv' ? `season ${s} episode ${e}` : ''}`);

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
                <span className="text-[9px] text-gray-500 uppercase">Server 2 & 4 are best for Cartoons</span>
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
      
      {/* Dynamic Fallback for Cartoons/Missing Content */}
      <div className="p-4 bg-gradient-to-r from-vortex-purple/10 to-vortex-blue/10 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 animate-pulse">
                <span className="text-xl">!</span>
            </div>
            <div>
                <p className="text-sm font-bold text-white">Still not working?</p>
                <p className="text-[10px] text-gray-400">Some Indian cartoons like Motu Patlu have restricted data.</p>
            </div>
        </div>
        <a 
          href={`https://www.youtube.com/results?search_query=${youtubeQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] uppercase tracking-wider"
        >
          Watch on YouTube
        </a>
      </div>
    </div>
  );
}
