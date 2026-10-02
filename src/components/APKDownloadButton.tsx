"use client";
import { Clock } from "lucide-react";

export default function APKDownloadButton() {
  return (
    <div 
      className="inline-flex items-center gap-3 bg-vortex-purple/60 text-white text-lg font-bold py-4 px-10 rounded-full cursor-not-allowed border border-white/10 shadow-[0_0_20px_rgba(124,77,255,0.3)]"
    >
      <Clock className="w-6 h-6" />
      <div className="flex flex-col items-start">
        <span>Coming Soon</span>
        <span className="text-xs font-normal text-white/80">App is currently in development</span>
      </div>
    </div>
  );
}
