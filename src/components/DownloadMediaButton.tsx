"use client";
import { Download } from "lucide-react";

interface DownloadMediaButtonProps {
  type?: "movie" | "tv";
  id?: string;
  season?: number;
  episode?: number;
  title?: string;
}

export default function DownloadMediaButton({}: DownloadMediaButtonProps) {
  const handleClick = () => {
    alert("Currently the download is not working. This feature will be available soon.");
  };

  return (
    <button 
      onClick={handleClick}
      className="flex items-center gap-2 px-6 py-2.5 bg-vortex-purple/50 hover:bg-vortex-purple text-white/80 hover:text-white font-bold rounded-full transition-all active:scale-95 group shadow-[0_0_10px_rgba(124,77,255,0.2)]"
    >
      <Download className="w-4 h-4 group-hover:animate-bounce" />
      <span>Download</span>
    </button>
  );
}
