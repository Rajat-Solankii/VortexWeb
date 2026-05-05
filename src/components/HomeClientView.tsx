"use client";
import { useState } from "react";
import MediaRow from "@/components/MediaRow";
import RecentlyPlayedRow from "@/components/RecentlyPlayedRow";
import AdsterraBanner300 from "@/components/AdsterraBanner300";

type Mode = "all" | "movies" | "tv" | "anime";

export default function HomeClientView({
  trending,
  popularMovies,
  topRatedTV,
  anime,
  kDramas,
  turkishDramas,
  chineseDramas,
  philippineDramas,
  bollywood,
  upcoming,
}: {
  trending: any[];
  popularMovies: any[];
  topRatedTV: any[];
  anime: any[];
  kDramas: any[];
  turkishDramas: any[];
  chineseDramas: any[];
  philippineDramas: any[];
  bollywood: any[];
  upcoming: any[];
}) {
  const [mode, setMode] = useState<Mode>("all");

  return (
    <div className="-mt-16 md:mt-[-80px] relative z-10">
      
      {/* Category Toggles */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 px-4 sm:px-6 lg:px-10 xl:px-16 mb-8 mt-16 md:mt-0 relative z-30">
        <button 
          type="button"
          onClick={() => setMode("all")}
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-lg ${mode === "all" ? "bg-white text-black scale-105" : "bg-white/10 text-white hover:bg-white/20"}`}
        >
          All
        </button>
        <button 
          type="button"
          onClick={() => setMode("movies")}
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-lg ${mode === "movies" ? "bg-white text-black scale-105" : "bg-white/10 text-white hover:bg-white/20"}`}
        >
          Movies
        </button>
        <button 
          type="button"
          onClick={() => setMode("tv")}
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-lg ${mode === "tv" ? "bg-white text-black scale-105" : "bg-white/10 text-white hover:bg-white/20"}`}
        >
          TV Shows
        </button>
        <button 
          type="button"
          onClick={() => setMode("anime")}
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-lg ${mode === "anime" ? "bg-white text-black scale-105" : "bg-white/10 text-white hover:bg-white/20"}`}
        >
          Anime
        </button>
      </div>

      {/* Rows Container */}
      <div className="animate-in fade-in duration-500">
        {(mode === "all" || mode === "movies" || mode === "tv" || mode === "anime") && (
            <RecentlyPlayedRow />
        )}
        
        {(mode === "all") && (
            <MediaRow title="Trending Today" items={trending?.slice(1)} />
        )}
        
        {(mode === "all" || mode === "movies") && (
            <MediaRow title="Popular Movies" items={popularMovies} />
        )}

        {(mode === "all" || mode === "movies") && (
            <MediaRow title="Bollywood Blockbusters" items={bollywood} />
        )}
        
        {mode === "all" && <AdsterraBanner300 />}
        
        {(mode === "all" || mode === "movies") && (
            <MediaRow title="Coming Soon" items={upcoming} />
        )}

        {(mode === "all" || mode === "tv") && (
            <MediaRow title="Heart-Racing K-Dramas" items={kDramas} />
        )}

        {(mode === "all" || mode === "tv") && (
            <MediaRow title="Top Rated TV Shows" items={topRatedTV} />
        )}

        {(mode === "all" || mode === "tv") && (
            <MediaRow title="Turkish Delights" items={turkishDramas} />
        )}
        
        {(mode === "all" || mode === "anime") && (
            <MediaRow title="Trending Anime" items={anime} />
        )}

        {(mode === "all" || mode === "tv") && (
            <MediaRow title="Chinese Epics" items={chineseDramas} />
        )}

        {(mode === "all" || mode === "tv") && (
            <MediaRow title="Filipino Favorites" items={philippineDramas} />
        )}
      </div>
    </div>
  );
}
