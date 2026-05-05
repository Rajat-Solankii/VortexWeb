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
    // You can replace this with your actual download service URL
    // Example: https://download-service.com/get?id=123&type=movie
    let downloadUrl = "";
    if (type === "movie") {
      downloadUrl = `https://player.videasy.net/download/movie/${id}`;
    } else {
      downloadUrl = `https://player.videasy.net/download/tv/${id}/${season}/${episode}`;
    }
    
    window.open(downloadUrl, "_blank");
  };

  return (
    <button 
      onClick={handleDownload}
      className="flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white font-bold transition-all active:scale-95 group"
    >
      <Download className="w-4 h-4 group-hover:animate-bounce" />
      <span>Download {type === 'movie' ? 'Movie' : 'Episode'}</span>
    </button>
  );
}
