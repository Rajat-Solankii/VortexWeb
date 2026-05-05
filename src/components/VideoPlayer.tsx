"use client";
import { useState } from "react";
import { Search, Play, Info } from "lucide-react";

export default function VideoPlayer({ type, id, season, episode, title }: { type: "movie" | "tv", id: string, season?: number, episode?: number, title?: string }) {
  const [server, setServer] = useState(1);

  let url = "";
  const s = season || 1;
  const e = episode || 1;
  const youtubeQuery = encodeURIComponent(`${title || ""} full episode ${type === 'tv' ? `season ${s} episode ${e}` : ''}`);

  if (type === "movie") {
    if (server === 1) url = `https://player.videasy.net/movie/${id}`;
    else if (server === 2) url = `https://vidsrc.xyz/embed/movie?tmdb=${id}`;
  } else {
    if (server === 1) url = `https://player.videasy.net/tv/${id}/${s}/${e}`;
    else if (server === 2) url = `https://vidsrc.xyz/embed/tv?tmdb=${id}&sea=${s}&epi=${e}`;
  }

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(124,77,255,0.15)] border border-white/10 relative">
        {server === 3 ? (
            <div className="w-full h-full bg-gradient-to-br from-red-900/20 via-black to-black flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                    <Play className="h-10 w-10 text-white fill-white ml-1" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Watch on YouTube</h3>
                    <p className="text-gray-300 text-sm max-w-sm">Direct embedding is restricted for this content. Tap below to find the full episode on YouTube.</p>
                </div>
                <a 
                    href={`https://www.youtube.com/results?search_query=${youtubeQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition-all shadow-xl uppercase tracking-widest text-xs"
                >
                    <Search className="h-4 w-4" />
                    <span>Search YouTube</span>
                </a>
            </div>
        ) : (
            <iframe
            src={url}
            allowFullScreen
            className="w-full h-full absolute inset-0"
            style={{ border: "none" }}
            ></iframe>
        )}
      </div>

      {/* Server Switcher */}
      <div className="py-4 border-t border-white/10">
         <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-vortex-purple uppercase tracking-[0.3em] drop-shadow-sm">Playback Engines</span>
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">3 Optimized Servers Active</span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
                <button 
                    onClick={() => setServer(1)}
                    className={`py-3.5 rounded-xl text-[11px] font-black transition-all border ${server === 1 ? 'bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,0.3)] scale-[1.02]' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'}`}
                >
                    SERVER 1
                </button>
                <button 
                    onClick={() => setServer(2)}
                    className={`py-3.5 rounded-xl text-[11px] font-black transition-all border ${server === 2 ? 'bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,0.3)] scale-[1.02]' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'}`}
                >
                    SERVER 2
                </button>
                <button 
                    onClick={() => setServer(3)}
                    className={`py-3.5 rounded-xl text-[11px] font-black transition-all border ${server === 3 ? 'bg-red-600 text-white border-red-600 shadow-[0_0_25px_rgba(220,38,38,0.5)] scale-[1.02]' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'}`}
                >
                    YOUTUBE
                </button>
            </div>
         </div>
      </div>
      
      {/* High-Visibility Tip Box */}
      <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner group">
        <div className="mt-0.5">
           <Info className="h-4 w-4 text-vortex-purple" />
        </div>
        <p className="text-[11px] text-gray-200 leading-relaxed">
            <span className="text-white font-bold uppercase tracking-wider mr-1">Pro Tip:</span>
            Switch to <span className="text-white font-black underline decoration-vortex-purple underline-offset-2">Server 2</span> if Server 1 is slow. Use <span className="text-red-500 font-black">YouTube</span> for regional cartoons like Motu Patlu.
        </p>
      </div>
    </div>
  );
}
