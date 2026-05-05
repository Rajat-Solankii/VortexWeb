"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import DownloadAppButton from "./DownloadAppButton";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsMobileMenuOpen(false);
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-vortex-black/80 backdrop-blur-md border-b border-white/10">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-black text-vortex-purple tracking-tighter drop-shadow-[0_0_10px_rgba(124,77,255,0.8)]">
              VORTEX
            </Link>
            <div className="hidden lg:block">
              <div className="flex items-baseline space-x-4 xl:space-x-6">
                <Link href="/movies" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,176,255,0.8)] text-sm font-medium transition-all">Movies</Link>
                <Link href="/hollywood" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,176,255,0.8)] text-sm font-medium transition-all hidden xl:block">Hollywood</Link>
                <Link href="/bollywood" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,176,255,0.8)] text-sm font-medium transition-all hidden xl:block">Bollywood</Link>
                <Link href="/tv" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,176,255,0.8)] text-sm font-medium transition-all">TV Shows</Link>
                <Link href="/anime" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,176,255,0.8)] text-sm font-medium transition-all hidden 2xl:block">Anime</Link>
                <Link href="/genres" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,176,255,0.8)] text-sm font-medium transition-all">Genres</Link>
                <Link href="/drama" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,176,255,0.8)] text-sm font-medium transition-all">Drama</Link>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search movies, tv..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-white/5 border border-white/10 text-white text-sm rounded-full focus:ring-vortex-purple focus:border-vortex-purple block w-64 pl-10 p-2 transition-all placeholder-gray-400 focus:bg-white/10"
              />
            </form>
            <DownloadAppButton />
          </div>

          <div className="lg:hidden flex items-center gap-2">
             <button 
               onClick={() => setIsSearchOpen(!isSearchOpen)}
               className="p-2 text-gray-400 hover:text-white"
             >
               {isSearchOpen ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
             </button>
             <div className="scale-75 -mx-2"><DownloadAppButton /></div>
             <button
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="p-2 text-gray-400 hover:text-white"
             >
               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
             </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="lg:hidden bg-vortex-black border-b border-white/10 p-4 animate-in slide-in-from-top duration-300">
           <form onSubmit={handleSearch} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                autoFocus
                placeholder="Search Vortex..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-white/5 border border-white/10 text-white text-sm rounded-full focus:ring-vortex-purple focus:border-vortex-purple block w-full pl-10 p-3 transition-all placeholder-gray-400 focus:bg-white/10"
              />
            </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-vortex-black/95 backdrop-blur-xl border-b border-white/10 px-4 pt-6 pb-8 space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 gap-4">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/movies" className="text-gray-300 hover:text-white font-medium p-3 bg-white/5 rounded-xl text-center border border-white/5">Movies</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/hollywood" className="text-gray-300 hover:text-white font-medium p-3 bg-white/5 rounded-xl text-center border border-white/5">Hollywood</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/bollywood" className="text-gray-300 hover:text-white font-medium p-3 bg-white/5 rounded-xl text-center border border-white/5">Bollywood</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/tv" className="text-gray-300 hover:text-white font-medium p-3 bg-white/5 rounded-xl text-center border border-white/5">TV Shows</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/anime" className="text-gray-300 hover:text-white font-medium p-3 bg-white/5 rounded-xl text-center border border-white/5">Anime</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/genres" className="text-gray-300 hover:text-white font-medium p-3 bg-white/5 rounded-xl text-center border border-white/5">Genres</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/drama" className="text-gray-300 hover:text-white font-medium p-3 bg-white/5 rounded-xl text-center border border-white/5 col-span-2">Drama</Link>
            </div>
        </div>
      )}
    </nav>
  );
}
