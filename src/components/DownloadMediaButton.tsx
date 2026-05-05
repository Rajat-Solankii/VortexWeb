"use client";
import { Download } from "lucide-react";

interface DownloadMediaButtonProps {
  type: "movie" | "tv";
  id: string;
  season?: number;
  episode?: number;
  title: string;
}

export default function DownloadMediaButton({ type, id, season, episode, title }: DownloadMediaButtonProps) {
  const handleDownload = () => {
    // 1. Try to open the Vortex External App (Custom Protocol)
    const protocolUrl = `vortex://download?type=${type}&id=${id}&title=${encodeURIComponent(title)}${type === 'tv' ? `&s=${season}&e=${episode}` : ''}`;
    
    // Attempt to open the app
    window.location.href = protocolUrl;

    // 2. Fallback to a WORKING web downloader after a short delay
    // This ensures users can still download even without the app
    setTimeout(() => {
      const mirrorUrl = type === "movie" 
        ? `https://vidsrc.me/download/movie?tmdb=${id}`
        : `https://vidsrc.me/download/tv?tmdb=${id}&sea=${season}&epi=${episode}`;
      
      window.open(mirrorUrl, "_blank");
    }, 1200);
  };

  return (
    <button 
      onClick={handleDownload}
      className="flex items-center gap-2 px-6 py-2.5 bg-vortex-purple hover:bg-vortex-blue text-white font-bold rounded-full transition-all active:scale-95 group shadow-[0_0_15px_rgba(124,77,255,0.4)]"
    >
      <Download className="w-4 h-4 group-hover:animate-bounce" />
      <span>Download {type === 'movie' ? 'Movie' : 'Episode'}</span>
    </button>
  );
}
