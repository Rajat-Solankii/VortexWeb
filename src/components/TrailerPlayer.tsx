"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";

interface Trailer {
  key: string;
  name: string;
}

export default function TrailerPlayer({ trailers }: { trailers: Trailer[] }) {
  const [activeTrailer, setActiveTrailer] = useState<string | null>(null);

  if (!trailers || trailers.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Play className="w-5 h-5 mr-2 text-vortex-purple fill-vortex-purple" />
          Official Trailers
        </h2>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {trailers.map((trailer) => (
          <button
            key={trailer.key}
            onClick={() => setActiveTrailer(trailer.key)}
            className="flex-shrink-0 group relative w-64 aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-vortex-purple/50 transition-all shadow-lg"
          >
            <img
              src={`https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg`}
              alt={trailer.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-100"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-vortex-purple/80 rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-current ml-1" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
              <p className="text-xs text-white font-medium truncate">{trailer.name}</p>
            </div>
          </button>
        ))}
      </div>

      {activeTrailer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(124,77,255,0.3)]">
            <button
              onClick={() => setActiveTrailer(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeTrailer}?autoplay=1`}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay"
            />
          </div>
        </div>
      )}
    </div>
  );
}
