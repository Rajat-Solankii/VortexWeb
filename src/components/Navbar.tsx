"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import DownloadAppButton from "./DownloadAppButton";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsMobileMenuOpen(false);
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
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-6">
                <Link href="/movies" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,176,255,0.8)] text-sm font-medium transition-all">Movies</Link>
                <Link href="/hollywood" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,176,255,0.8)] text-sm font-medium transition-all">Hollywood</Link>
                <Link href="/bollywood" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,176,255,0.8)] text-sm font-medium transition-all">Bollywood</Link>
                <Link href="/tv" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,176,255,0.8)] text-sm font-medium transition-all">TV Shows</Link>
                <Link href="/anime" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,176,255,0.8)] text-sm font-medium transition-all">Anime</Link>
                <Link href="/genres" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,176,255,0.8)] text-sm font-medium transition-all">Genres</Link>
                <Link href="/drama" className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,176,255,0.8)] text-sm font-medium transition-all">Drama</Link>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
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
          <div className="md:hidden flex items-center gap-3">
             <div className="scale-90"><DownloadAppButton /></div>
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white">
               {isMobileMenuOpen ? <X /> : <Menu />}
             </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-vortex-black/95 backdrop-blur-xl border-b border-white/10 px-4 pt-2 pb-4 space-y-4">
           <form onSubmit={handleSearch} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-white/5 border border-white/10 text-white text-sm rounded-full focus:ring-vortex-purple focus:border-vortex-purple block w-full pl-10 p-2 transition-all placeholder-gray-400 focus:bg-white/10"
              />
            </form>
            <div className="flex flex-col space-y-3">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/movies" className="text-gray-300 hover:text-white font-medium">Movies</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/hollywood" className="text-gray-300 hover:text-white font-medium">Hollywood</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/bollywood" className="text-gray-300 hover:text-white font-medium">Bollywood</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/tv" className="text-gray-300 hover:text-white font-medium">TV Shows</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/anime" className="text-gray-300 hover:text-white font-medium">Anime</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/genres" className="text-gray-300 hover:text-white font-medium">Genres</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/drama" className="text-gray-300 hover:text-white font-medium">Drama</Link>
            </div>
        </div>
      )}
    </nav>
  );
}
