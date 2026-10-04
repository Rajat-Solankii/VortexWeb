"use client";

import { AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const POSTERS = [
  "https://static.tvmaze.com/uploads/images/original_untouched/610/1525272.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/163/407679.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/0/15.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/143/358967.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/490/1226764.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/477/1194981.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/498/1245275.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/0/73.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/82/206879.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/69/174906.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/189/474715.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/0/137.jpg"
];

export default function MaintenanceScreen() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    const eventSource = new EventSource('/api/settings/stream');

    eventSource.onmessage = (event) => {
      if (event.data === 'false' || event.data === 'reload') {
        // Maintenance is over or global reload triggered! Auto-reload the page to get users back in.
        window.location.reload();
      }
    };

    eventSource.onerror = () => {
      console.error("SSE connection lost. Reconnecting...");
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex-grow flex items-center justify-center bg-[#07090e] px-4 relative overflow-hidden w-full min-h-screen">
      {/* Background Animated Posters */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none flex flex-col gap-4 -rotate-12 scale-125 overflow-hidden">
        {/* Row 1 - Moves Left */}
        <div className="flex gap-4 min-w-[200vw] animate-[slide-left_40s_linear_infinite]">
          {[...POSTERS, ...POSTERS, ...POSTERS].map((poster, i) => (
            <div key={`r1-${i}`} className="w-48 h-72 relative rounded-xl overflow-hidden shrink-0 shadow-2xl">
              <img src={poster} alt="Movie Poster" className="object-cover w-full h-full" />
            </div>
          ))}
        </div>
        
        {/* Row 2 - Moves Right */}
        <div className="flex gap-4 min-w-[200vw] animate-[slide-right_50s_linear_infinite]">
          {[...POSTERS.reverse(), ...POSTERS, ...POSTERS].map((poster, i) => (
            <div key={`r2-${i}`} className="w-48 h-72 relative rounded-xl overflow-hidden shrink-0 shadow-2xl">
              <img src={poster} alt="Movie Poster" className="object-cover w-full h-full" />
            </div>
          ))}
        </div>
        
        {/* Row 3 - Moves Left */}
        <div className="flex gap-4 min-w-[200vw] animate-[slide-left_35s_linear_infinite]">
          {[...POSTERS.sort(() => 0.5 - Math.random()), ...POSTERS, ...POSTERS].map((poster, i) => (
            <div key={`r3-${i}`} className="w-48 h-72 relative rounded-xl overflow-hidden shrink-0 shadow-2xl">
              <img src={poster} alt="Movie Poster" className="object-cover w-full h-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#07090e] via-transparent to-[#07090e] z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-[#07090e] z-0"></div>

      {/* Main Content Modal */}
      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 max-w-lg w-full text-center shadow-[0_0_80px_rgba(112,71,235,0.15)] relative z-10 overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-[0_0_100px_rgba(112,71,235,0.2)]">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#7047eb] to-transparent"></div>
        <div className="w-20 h-20 bg-gradient-to-br from-[#7047eb]/30 to-[#b794f6]/10 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-white/5 rotate-3 hover:rotate-6 transition-transform">
          <AlertTriangle className="w-10 h-10 text-[#b794f6]" />
        </div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-4 tracking-tight">
          We'll be right back
        </h1>
        <p className="text-gray-400 mb-10 leading-relaxed text-lg font-light">
          Vortex is currently undergoing scheduled maintenance to bring you an even better streaming experience. Please check back shortly.
        </p>
        <div className="inline-block relative">
          <div className="absolute inset-0 bg-[#7047eb] blur-xl opacity-30"></div>
          <div className="text-sm text-white font-bold tracking-[0.2em] uppercase px-6 py-3 rounded-full border border-[#7047eb]/30 bg-[#7047eb]/10 relative z-10">
            Vortex Team
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes slide-right {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }
      `}} />
    </div>
  );
}
