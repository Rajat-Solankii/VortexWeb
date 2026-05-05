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
}: {
  trending: any[];
  popularMovies: any[];
  topRatedTV: any[];
  anime: any[];
}) {
  const [mode, setMode] = useState<Mode>("all");

  return (
    <div className="-mt-32 relative z-10 md:mt-[-100px]">
      
      {/* AdBlock / Support Message */}
      <div className="px-4 sm:px-6 lg:px-10 xl:px-16 mb-8 relative z-20">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 backdrop-blur-sm">
          <p className="text-white/60 text-sm md:text-base font-medium leading-relaxed">
            <span className="text-blue-500 font-bold mr-2">💡 Support Vortex:</span> 
            Our platform is free to use. Please consider disabling your ad-blocker to help us maintain the website and keep the streaming quality high for everyone.
          </p>
        </div>
      </div>
      
      {/* Category Toggles */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 px-4 sm:px-6 lg:px-10 xl:px-16 mb-8 mt-12 md:mt-0 relative z-20">
        <button 
          onClick={() => setMode("all")}
          className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${mode === "all" ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
        >
          All
        </button>
        <button 
          onClick={() => setMode("movies")}
          className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${mode === "movies" ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
        >
          Movies
        </button>
        <button 
          onClick={() => setMode("tv")}
          className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${mode === "tv" ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
        >
          TV Shows
        </button>
        <button 
          onClick={() => setMode("anime")}
          className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${mode === "anime" ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
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
        
        {mode === "all" && <AdsterraBanner300 />}
        
        {(mode === "all" || mode === "tv") && (
            <MediaRow title="Top Rated TV Shows" items={topRatedTV} />
        )}
        
        {(mode === "all" || mode === "anime") && (
            <MediaRow title="Trending Anime" items={anime} />
        )}
      </div>
    </div>
  );
}
