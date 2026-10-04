/* eslint-disable @next/next/no-img-element */
"use client";

import { TMDBItem } from "@/lib/tmdb";
import { Film, Tv, TrendingUp, Star } from "lucide-react";

interface SearchSuggestionsProps {
  suggestions: TMDBItem[];
  isVisible: boolean;
  activeIndex: number;
  onSelect: (item: TMDBItem) => void;
  isLoading?: boolean;
  query: string;
}

export default function SearchSuggestions({
  suggestions,
  isVisible,
  activeIndex,
  onSelect,
  isLoading,
  query
}: SearchSuggestionsProps) {
  if (!isVisible || (suggestions.length === 0 && !isLoading)) return null;

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, i) => (
          <span
            key={i}
            className={part.toLowerCase() === query.toLowerCase() ? "text-white font-black underline decoration-vortex-purple/50 underline-offset-2" : ""}
          >
            {part}
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-vortex-black/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[60] animate-in fade-in zoom-in-95 duration-200">
      {isLoading ? (
        <div className="p-4 flex items-center justify-center space-x-2 text-gray-400">
          <div className="w-4 h-4 border-2 border-vortex-purple border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Searching...</span>
        </div>
      ) : (
        <div className="max-h-[75vh] overflow-y-auto scrollbar-hide py-2">
          {suggestions.length > 0 ? (
            suggestions.slice(0, 8).map((item, index) => {
              const isMovie = item.media_type === "movie" || !!item.title;
              const title = item.title || item.name || "Unknown";
              const releaseDate = item.release_date || item.first_air_date;
              const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
              const poster = item.poster_path 
                ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                : null;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item)}
                  className={`w-full flex items-center gap-4 px-4 py-3 transition-all text-left
                    ${index === activeIndex 
                      ? "bg-white/15 text-white border-l-2 border-vortex-purple" 
                      : "text-gray-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                    }`}
                >
                  <div className="relative w-12 h-16 rounded-md overflow-hidden bg-white/5 flex-shrink-0 shadow-md">
                    {poster ? (
                      <img
                        src={poster}
                        alt={title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {isMovie ? <Film className="w-5 h-5 opacity-40" /> : <Tv className="w-5 h-5 opacity-40" />}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[15px] truncate">{highlightMatch(title, query)}</span>
                      {year && <span className="text-xs text-gray-500 font-medium flex-shrink-0 bg-white/5 px-1.5 py-0.5 rounded">{year}</span>}
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-sm">
                        {isMovie ? (
                          <Film className="w-3 h-3 text-vortex-purple" />
                        ) : (
                          <Tv className="w-3 h-3 text-vortex-blue" />
                        )}
                        <span className="text-[10px] uppercase tracking-wider font-bold">
                          {item.media_type || (isMovie ? "movie" : "tv")}
                        </span>
                      </div>
                      
                      {!!item.vote_average && item.vote_average > 0 && (
                        <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-sm">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-bold">{item.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {item.overview && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-1 pr-4">
                        {item.overview}
                      </p>
                    )}
                  </div>
                  
                  <TrendingUp className={`w-4 h-4 transition-opacity ${index === activeIndex ? "opacity-100" : "opacity-0"}`} />
                </button>
              );
            })
          ) : (
            <div className="px-6 py-8 text-center text-gray-400">
               <p className="text-sm font-medium">No results found</p>
               <p className="text-xs mt-1 text-gray-500">Try searching for something else</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
