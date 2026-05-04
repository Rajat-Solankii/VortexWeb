/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { TMDBItem } from "@/lib/tmdb";
import { Play, Info } from "lucide-react";

export default function HeroSection({ item }: { item: TMDBItem | null }) {
  if (!item) return null;
  
  const title = item.title || item.name;
  const isTV = item.media_type === "tv" || (!item.media_type && item.name && !item.title);
  const link = isTV ? `/tv/${item.id}` : `/movie/${item.id}`;

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh]">
      <div className="absolute inset-0">
        <img 
          src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
          alt={title || "Hero Backdrop"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-vortex-black via-vortex-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-vortex-black via-transparent to-transparent"></div>
      </div>
      
      <div className="relative h-full w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 flex flex-col justify-center">
         <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-4">
              {title}
            </h1>
            <p className="text-gray-300 text-lg md:text-xl line-clamp-3 mb-8 drop-shadow-md">
              {item.overview}
            </p>
            <div className="flex items-center space-x-4">
               <Link href={link} className="flex items-center space-x-2 bg-vortex-purple hover:bg-vortex-purple/90 text-white px-8 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(124,77,255,0.6)] hover:shadow-[0_0_30px_rgba(124,77,255,0.8)] hover:scale-105">
                 <Play className="w-5 h-5 fill-current" />
                 <span>Watch Now</span>
               </Link>
               <Link href={link} className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-8 py-3 rounded-full font-bold transition-all hover:scale-105">
                 <Info className="w-5 h-5" />
                 <span>More Info</span>
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
