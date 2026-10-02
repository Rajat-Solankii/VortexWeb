"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { TMDBItem } from "@/lib/tmdb";
import { Play, Info } from "lucide-react";

export default function HeroSection({ items }: { items: TMDBItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const heroItems = items?.slice(0, 5) || [];

  useEffect(() => {
    if (heroItems.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroItems.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [heroItems.length]);

  if (!heroItems || heroItems.length === 0) return null;

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-vortex-black">
      {heroItems.map((item, idx) => {
        const title = item.title || item.name;
        const isTV = item.media_type === "tv" || (!item.media_type && item.name && !item.title);
        const link = isTV ? `/tv/${item.id}` : `/movie/${item.id}`;
        const isActive = idx === currentIndex;

        return (
          <div 
            key={item.id} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            {/* Background Image & Gradients */}
            <div className="absolute inset-0">
              <img 
                src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                alt={title || "Hero Backdrop"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-vortex-black via-vortex-black/80 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-vortex-black via-transparent to-transparent"></div>
            </div>
            
            {/* Content */}
            <div className="relative h-full w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 flex flex-col justify-center">
               <div className={`max-w-2xl transform transition-all duration-1000 delay-300 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-3 md:mb-4">
                    {title}
                  </h1>
                  <p className="text-gray-300 text-sm sm:text-base md:text-lg line-clamp-3 mb-6 md:mb-8 drop-shadow-md">
                    {item.overview}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                     <Link href={link} className="flex flex-1 sm:flex-none justify-center items-center space-x-2 bg-vortex-purple hover:bg-vortex-purple/90 text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(124,77,255,0.6)] hover:shadow-[0_0_30px_rgba(124,77,255,0.8)] hover:scale-105 pointer-events-auto text-sm sm:text-base">
                       <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                       <span>Watch Now</span>
                     </Link>
                     <Link href={link} className="flex flex-1 sm:flex-none justify-center items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold transition-all hover:scale-105 pointer-events-auto text-sm sm:text-base">
                       <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                       <span>More Info</span>
                     </Link>
                  </div>
               </div>
            </div>
          </div>
        );
      })}

      {/* Carousel Indicators */}
      {heroItems.length > 1 && (
        <div className="absolute bottom-12 right-6 md:right-16 flex space-x-2 z-20">
          {heroItems.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-vortex-purple shadow-[0_0_10px_rgba(124,77,255,0.8)]' : 'w-2 bg-white/30 hover:bg-white/60'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
