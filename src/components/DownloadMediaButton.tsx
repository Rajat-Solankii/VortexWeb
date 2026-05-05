"use client";
import { useState } from "react";
import { Download, Clock } from "lucide-react";

interface DownloadMediaButtonProps {
  type?: "movie" | "tv";
  id?: string;
  season?: number;
  episode?: number;
  title?: string;
}

export default function DownloadMediaButton({}: DownloadMediaButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (isClicked) return;
    setIsClicked(true);
    // Reset back to original state after a few seconds
    setTimeout(() => setIsClicked(false), 3000);
  };

  return (
    <button 
      onClick={handleClick}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all active:scale-95 group relative overflow-hidden min-w-[140px] justify-center ${
        isClicked 
          ? "bg-vortex-purple text-white shadow-[0_0_20px_rgba(124,77,255,0.6)] scale-105" 
          : "bg-vortex-purple/50 hover:bg-vortex-purple text-white/80 hover:text-white shadow-[0_0_10px_rgba(124,77,255,0.2)]"
      }`}
    >
      {isClicked ? (
        <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
          <Clock className="w-4 h-4 animate-pulse" />
          <span>Coming Soon</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 group-hover:animate-bounce" />
          <span>Download</span>
        </div>
      )}
    </button>
  );
}
