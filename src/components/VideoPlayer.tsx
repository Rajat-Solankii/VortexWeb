"use client";
import { Info, Cloud } from "lucide-react";

export default function VideoPlayer({ type, id, season, episode, title, tmdbSeason, tmdbEpisode }: { type: "movie" | "tv", id: string, season?: number, episode?: number, title?: string, tmdbSeason?: number, tmdbEpisode?: number }) {
  let url = "";
  // Use TMDB-specific season/episode if provided (vital for flattened anime), otherwise fallback to UI season/episode
  const s = tmdbSeason ?? season ?? 1;
  const e = tmdbEpisode ?? episode ?? 1;

  const videasyParams = 'nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true&color=8B5CF6';

  if (type === "movie") {
    url = `https://player.videasy.net/movie/${id}?${videasyParams}`;
  } else {
    url = `https://player.videasy.net/tv/${id}/${s}/${e}?${videasyParams}`;
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
      
      {/* Information Note */}
      <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner group">
        <div className="mt-0.5 flex-shrink-0">
           <Info className="h-5 w-5 text-vortex-purple" />
        </div>
        <div className="text-[13px] text-gray-300 leading-relaxed">
            <p className="mb-2">
              <span className="text-white font-bold uppercase tracking-wider mr-2 text-[12px]">Note:</span>
              If the video is not playing, try changing the server from the 
              <span className="inline-flex items-center justify-center bg-zinc-800 w-6 h-6 rounded-full mx-1.5 shadow-sm border border-white/5 align-middle">
                <Cloud className="w-3.5 h-3.5 text-white" fill="currentColor" strokeWidth={1.5} />
              </span> 
              inside the player.
            </p>
            <p className="text-[12px] text-gray-400">
              <strong className="text-gray-300">Mobile Data Buffering?</strong> Mobile carriers often intentionally throttle video streaming speeds. If you experience buffering on mobile data but not on Wi-Fi, try connecting to Wi-Fi, using a free VPN (like 1.1.1.1), or switching the player's server above.
            </p>
        </div>
      </div>
    </div>
  );
}
