"use client";
import { useRef, useState } from "react";
import Link from "next/link";

const COLOR_PRESETS = [
  { color: "from-blue-600/30 to-indigo-900/40", hoverColor: "group-hover:border-blue-500/50" },
  { color: "from-red-600/30 to-red-900/40", hoverColor: "group-hover:border-red-500/50" },
  { color: "from-green-500/30 to-green-800/40", hoverColor: "group-hover:border-green-500/50" },
  { color: "from-orange-500/30 to-orange-800/40", hoverColor: "group-hover:border-orange-500/50" },
  { color: "from-purple-600/30 to-purple-900/40", hoverColor: "group-hover:border-purple-500/50" },
  { color: "from-teal-500/30 to-teal-800/40", hoverColor: "group-hover:border-teal-500/50" },
  { color: "from-yellow-600/30 to-red-800/40", hoverColor: "group-hover:border-yellow-500/50" },
  { color: "from-gray-700/30 to-black/60", hoverColor: "group-hover:border-gray-400/50" },
  { color: "from-pink-600/30 to-pink-900/40", hoverColor: "group-hover:border-pink-500/50" },
];

const hardcodedProviders = [
  { id: 8, name: "Netflix", logo: "/rK1KljqmbvO9HQa1PBFLILWah72.png", color: "from-red-600/30 to-red-900/40", hoverColor: "group-hover:border-red-500/50" },
  { id: 9, name: "Amazon Prime", logo: "/gMZdpavHmxFNnLpMHwVxfqeux2g.png", color: "from-blue-400/30 to-blue-700/40", hoverColor: "group-hover:border-blue-400/50" },
  { id: 15, name: "Hulu", logo: "/44uAnmSqvA4yBOdbPWN8YgQHjWm.png", color: "from-green-500/30 to-green-800/40", hoverColor: "group-hover:border-green-500/50" },
  { id: 337, name: "Disney+", logo: "/ruMrSFMJBMUpzjUL3dHD647qyEF.png", color: "from-blue-600/30 to-indigo-900/40", hoverColor: "group-hover:border-blue-500/50" },
  { id: 350, name: "Apple TV+", logo: "/9icYBfYFcwgCbky5VdGUIKJ4C5i.png", color: "from-gray-700/30 to-black/60", hoverColor: "group-hover:border-gray-400/50" },
  { id: 258, name: "fuboTV", logo: "/3wF8xISfVlcrc8X3jaa3uMUFGAr.png", color: "from-orange-500/30 to-orange-800/40", hoverColor: "group-hover:border-orange-500/50" },
  { id: 283, name: "Crunchyroll", logo: "/uFL3c4Cq8M6WoLymlC5Y8bmGytV.png", color: "from-orange-400/30 to-orange-700/40", hoverColor: "group-hover:border-orange-400/50" },
  { id: 531, name: "Paramount+", logo: "/4N4BMd0Mm0kHAmF7RZgL5lW3cwc.png", color: "from-blue-500/30 to-blue-800/40", hoverColor: "group-hover:border-blue-500/50" },
  { id: 384, name: "Max", logo: "/skypuy7SXuugIQeYg0IglmzoKaS.png", color: "from-indigo-600/30 to-indigo-900/40", hoverColor: "group-hover:border-indigo-500/50" },
  { id: 386, name: "Peacock", logo: "/a1UIdq5BrkcAxnxcUhFsNbXnxeu.png", color: "from-yellow-600/30 to-red-800/40", hoverColor: "group-hover:border-yellow-500/50" },
  { id: 192, name: "YouTube", logo: "/5Maob4o5w8oZnNeYpCDyVFD3M7X.png", color: "from-red-500/30 to-red-700/40", hoverColor: "group-hover:border-red-500/50" },
  { id: 3, name: "Google Play", logo: "/aZRENwYILujqs0RVOZutTh0BVGV.png", color: "from-gray-500/30 to-gray-800/40", hoverColor: "group-hover:border-gray-500/50" },
  { id: 7, name: "Vudu", logo: "/vksXbcPoeFbx5RVJk9L829QnUUI.png", color: "from-blue-400/30 to-blue-800/40", hoverColor: "group-hover:border-blue-400/50" },
  { id: 43, name: "Starz", logo: "/8rsWsgmQ1n5jKOKUuWclCAnlOSW.png", color: "from-slate-700/30 to-slate-900/40", hoverColor: "group-hover:border-slate-500/50" },
];

export default function ProvidersRow({ providers: dynamicProviders }: { providers?: any[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleScroll = () => {
    if (rowRef.current) {
      setIsMoved(rowRef.current.scrollLeft > 0);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const displayProviders = dynamicProviders?.length 
    ? dynamicProviders.map((dp) => {
        const existing = hardcodedProviders.find(hp => hp.id === dp.provider_id);
        if (existing) return existing;
        
        const preset = COLOR_PRESETS[dp.provider_id % COLOR_PRESETS.length];
        return {
          id: dp.provider_id,
          name: dp.provider_name,
          logo: dp.logo_path,
          color: preset.color,
          hoverColor: preset.hoverColor
        };
      }).filter(p => p.logo) // Only show providers with logos
    : hardcodedProviders;

  if (!displayProviders || displayProviders.length === 0) return null;

  return (
    <div className="py-6 md:py-8 group/row relative">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-16 mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide flex items-center space-x-3">
            <span className="w-1.5 h-6 bg-vortex-blue rounded-full drop-shadow-[0_0_5px_rgba(0,176,255,0.8)]"></span>
            <span>Providers</span>
        </h2>
        
        {/* Top Right Arrows (matching the screenshot style) */}
        <div className="flex items-center space-x-4">
          <Link href="/providers" className="text-sm md:text-base font-medium text-vortex-blue hover:text-white transition-colors">
            View All
          </Link>
          <div className="hidden md:flex items-center space-x-2">
          <button 
            onClick={() => scroll("left")}
            className={`w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all border border-white/5 ${isMoved ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`}
            disabled={!isMoved}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all border border-white/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        </div>
      </div>
      
      <div className="relative">
        {/* Scroll Container */}
        <div 
          ref={rowRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-4 md:gap-5 py-6 -my-6 scrollbar-hide snap-x relative z-10"
        >
          {displayProviders.map((provider, index) => (
            <div 
              key={`${provider.id}-${index}`} 
              className={`snap-start shrink-0 group ${index === 0 ? "pl-4 sm:pl-6 lg:pl-10 xl:pl-16" : ""} ${index === displayProviders.length - 1 ? "pr-4 sm:pr-6 lg:pr-10 xl:pr-16" : ""}`}
            >
               <Link href={`/provider/${provider.id}?name=${provider.name}&type=movie`} className={`relative block w-[120px] md:w-[150px] aspect-square rounded-2xl md:rounded-3xl bg-gradient-to-br ${provider.color} border border-white/10 ${provider.hoverColor} p-4 md:p-6 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] overflow-hidden`}>
                  {/* Subtle overlay gloss */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Provider Logo Image */}
                  <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl flex items-center justify-center bg-black/50 border border-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={`https://image.tmdb.org/t/p/w200${provider.logo}`}
                      alt={provider.name}
                      className="w-full h-full object-cover scale-110"
                      loading="lazy"
                      onError={(e) => {
                         // Fallback if logo fails
                         e.currentTarget.style.display = 'none';
                         e.currentTarget.parentElement!.innerHTML = `<span class="text-xs font-bold text-white text-center">${provider.name}</span>`;
                      }}
                    />
                  </div>
               </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
