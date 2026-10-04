"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Search, Menu, X, LayoutGrid } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import DownloadAppButton from "./DownloadAppButton";
import SignInButton from "./SignInButton";
import SearchSuggestions from "./SearchSuggestions";
import { searchMulti, TMDBItem } from "@/lib/tmdb";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<TMDBItem[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);


  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        setShowSuggestions(true);
        try {
          const { results } = await searchMulti(query);
          setSuggestions(results || []);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      let isInside = false;
      if (searchRef.current?.contains(event.target as Node)) isInside = true;
      if (mobileSearchRef.current?.contains(event.target as Node)) isInside = true;
      
      if (!isInside) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      handleSelectSuggestion(suggestions[activeIndex]);
      return;
    }
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
      setIsMobileMenuOpen(false);
      setIsSearchOpen(false);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (item: TMDBItem) => {
    const type = item.media_type || (item.title ? "movie" : "tv");
    router.push(`/${type}/${item.id}`);
    setQuery("");
    setShowSuggestions(false);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  if (pathname === "/") {
    return null;
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-vortex-black/80 backdrop-blur-md border-b border-white/10">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Navigation */}
          <div className="flex items-center gap-6 xl:gap-8 flex-shrink-0">
            <Link href="/home" className="text-2xl font-black text-vortex-purple tracking-tighter drop-shadow-[0_0_10px_rgba(124,77,255,0.8)]">
              VORTEX
            </Link>
            <div className="hidden lg:block">
              <div className="flex items-center space-x-1 xl:space-x-2">
                <Link href="/anime" className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg text-sm font-bold transition-all">Anime</Link>
                <Link href="/movies" className="text-gray-300 hover:text-white hover:bg-white/10 px-2 xl:px-3 py-1.5 rounded-lg text-[13px] xl:text-sm font-bold transition-all">Movies</Link>
                <Link href="/tv" className="text-gray-300 hover:text-white hover:bg-white/10 px-2 xl:px-3 py-1.5 rounded-lg text-[13px] xl:text-sm font-bold transition-all">TV Shows</Link>
                <Link href="/genres" className="text-gray-300 hover:text-white hover:bg-white/10 px-2 xl:px-3 py-1.5 rounded-lg text-[13px] xl:text-sm font-bold transition-all hidden xl:block">Genres</Link>
              </div>
            </div>
          </div>
          
          {/* Middle: Wide Search Bar */}
          <div className="hidden lg:flex flex-1 justify-center max-w-2xl px-6">
            <div ref={searchRef} className="relative w-full">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search movies, tv shows, anime..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(-1);
                  }}
                  onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  className="bg-white/5 border border-white/10 text-white text-[15px] rounded-full focus:ring-2 focus:ring-[#7047eb]/50 focus:border-[#7047eb] block w-full pl-12 pr-4 py-2.5 transition-all placeholder-gray-500 focus:bg-[#141519] shadow-inner"
                />
              </form>
              <SearchSuggestions 
                suggestions={suggestions} 
                isVisible={showSuggestions} 
                activeIndex={activeIndex}
                onSelect={handleSelectSuggestion}
                isLoading={isLoading}
                query={query}
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-5 flex-shrink-0">
            <SignInButton />
            <DownloadAppButton />
          </div>

          <div className="lg:hidden flex items-center gap-2">
             <button 
               onClick={() => setIsSearchOpen(!isSearchOpen)}
               className="p-2 text-gray-400 hover:text-white relative w-10 h-10 flex items-center justify-center"
               aria-label="Toggle search"
             >
               <Search className={`absolute h-6 w-6 transition-all duration-300 ${isSearchOpen ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`} />
               <X className={`absolute h-6 w-6 transition-all duration-300 ${isSearchOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'}`} />
             </button>
             <div className="flex items-center gap-2 scale-90 sm:scale-100">
               <SignInButton />
               <DownloadAppButton />
             </div>
             <button
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="p-2 text-gray-400 hover:text-white relative w-10 h-10 flex items-center justify-center"
               aria-label="Toggle mobile menu"
             >
               <Menu className={`absolute h-6 w-6 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`} />
               <X className={`absolute h-6 w-6 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'}`} />
             </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-vortex-black border-b border-white/10 p-4"
          >
           <div ref={mobileSearchRef} className="relative w-full">
             <form onSubmit={handleSearch} className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  autoFocus
                  placeholder="Search Vortex..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  className="bg-white/5 border border-white/10 text-white text-sm rounded-full focus:ring-vortex-purple focus:border-vortex-purple block w-full pl-10 p-3 transition-all placeholder-gray-400 focus:bg-white/10"
                />
              </form>
              <SearchSuggestions 
                suggestions={suggestions} 
                isVisible={showSuggestions} 
                activeIndex={activeIndex}
                onSelect={handleSelectSuggestion}
                isLoading={isLoading}
                query={query}
              />
           </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-vortex-black/95 backdrop-blur-xl border-b border-white/10 px-4 pt-6 pb-8 space-y-8"
          >
            <div className="grid grid-cols-2 gap-4">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/anime" className="text-gray-300 hover:text-white font-medium p-3 bg-white/5 rounded-xl text-center border border-white/5">Anime</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/bollywood" className="text-gray-300 hover:text-white font-medium p-3 bg-white/5 rounded-xl text-center border border-white/5">Bollywood</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/cartoons" className="text-gray-300 hover:text-white font-medium p-3 bg-white/5 rounded-xl text-center border border-white/5">Cartoons</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/drama" className="text-gray-300 hover:text-white font-medium p-3 bg-white/5 rounded-xl text-center border border-white/5">Drama</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/hollywood" className="text-gray-300 hover:text-white font-medium p-3 bg-white/5 rounded-xl text-center border border-white/5">Hollywood</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/movies" className="text-gray-300 hover:text-white font-medium p-3 bg-white/5 rounded-xl text-center border border-white/5">Movies</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/tv" className="text-gray-300 hover:text-white font-medium p-3 bg-white/5 rounded-xl text-center border border-white/5">TV Shows</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/genres" className="text-white font-bold p-3 bg-vortex-purple/20 rounded-xl text-center border border-vortex-purple/40">Genres</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

