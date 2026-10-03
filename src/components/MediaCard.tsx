/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { TMDBItem } from "@/lib/tmdb";

export default function MediaCard({ item, onRemove }: { item: TMDBItem, onRemove?: (id: number) => void }) {
  // If media_type isn't strictly defined, we can guess based on 'title' (movie) vs 'name' (tv)
  // For discovery endpoints we'll just have to pass a prop, but here we assume 'name' means TV.
  const isTV = item.media_type === "tv" || (!item.media_type && item.name && !item.title);
  const title = item.title || item.name;
  
  // Check if this is a HistoryItem with season/episode progress
  const season = (item as any).season;
  const episode = (item as any).episode;
  const hasProgress = season !== undefined && episode !== undefined;
  
  const link = isTV 
    ? (hasProgress ? `/tv/${item.id}?s=${season}&e=${episode}` : `/tv/${item.id}`) 
    : `/movie/${item.id}`;
  
  const now = new Date().toISOString().split('T')[0];
  const releaseDate = item.release_date || item.first_air_date;
  const isComingSoon = releaseDate && releaseDate > now;

  return (
    <div className="relative group w-full h-full flex-shrink-0">
      <Link href={link} className="block">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/5 group-hover:border-vortex-purple/50 group-hover:shadow-[0_0_20px_rgba(124,77,255,0.6)] transition-all bg-white/5">
          {item.poster_path ? (
            <img 
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
              alt={title || "Poster"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4 text-center text-sm text-gray-500">
              {title}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <span className="text-white text-xs font-semibold drop-shadow-md">{isComingSoon ? 'Coming Soon' : (hasProgress ? `Resume S${season} E${episode}` : 'Watch Now')}</span>
          </div>
          {isComingSoon && (
            <div className="absolute top-2 left-2 bg-vortex-purple text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg backdrop-blur-sm z-10 border border-white/20">
              COMING SOON
            </div>
          )}
          {hasProgress && !isComingSoon && (
            <div className="absolute top-2 left-2 bg-vortex-blue text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg backdrop-blur-sm z-10 border border-white/20 drop-shadow-[0_0_5px_rgba(0,176,255,0.8)]">
              S{season} E{episode}
            </div>
          )}
        </div>
      </Link>

      {onRemove && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(item.id);
          }}
          className="absolute top-2 right-2 z-50 w-7 h-7 bg-red-500/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-transform hover:scale-110 md:opacity-0 md:group-hover:opacity-100"
          title="Remove from history"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <h3 className="mt-3 text-sm text-gray-300 font-medium truncate group-hover:text-vortex-blue transition-colors group-hover:drop-shadow-[0_0_5px_rgba(0,176,255,0.8)]">
        {title}
      </h3>
      {item.vote_average ? (
         <div className="flex items-center mt-1 space-x-1">
             <span className="text-vortex-purple text-xs">★</span>
             <span className="text-gray-400 text-xs">{item.vote_average.toFixed(1)}</span>
         </div>
      ) : null}
    </div>
  );
}
