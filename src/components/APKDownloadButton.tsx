"use client";
import { Clock } from "lucide-react";

export default function APKDownloadButton() {
  return (
    <div className="inline-flex items-center gap-3 bg-vortex-purple/50 text-white/80 text-lg font-bold py-4 px-10 rounded-full border border-white/10 shadow-[0_0_20px_rgba(124,77,255,0.2)] cursor-not-allowed">
      <Clock className="w-6 h-6" />
      <div className="flex flex-col items-start">
        <span>Coming Soon</span>
        <span className="text-xs font-normal text-white/60">
          App is under development
        </span>
      </div>
    </div>
  );
}
