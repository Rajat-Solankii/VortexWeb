import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/80 backdrop-blur-md border-t border-white/10 py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity">
            VORTEX<span className="text-blue-500">.</span>
          </Link>
          <p className="text-white/40 text-sm max-w-xs text-center md:text-left">
            Vortex is a professional streaming platform providing access to the latest movies, TV shows, and anime.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-sm">
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold mb-1">Navigation</h3>
            <Link href="/movies" className="text-white/60 hover:text-white transition-colors">Movies</Link>
            <Link href="/hollywood" className="text-white/60 hover:text-white transition-colors">Hollywood</Link>
            <Link href="/bollywood" className="text-white/60 hover:text-white transition-colors">Bollywood</Link>
            <Link href="/tv" className="text-white/60 hover:text-white transition-colors">TV Shows</Link>
            <Link href="/anime" className="text-white/60 hover:text-white transition-colors">Anime</Link>
            <Link href="/genres" className="text-white/60 hover:text-white transition-colors">Genres</Link>
            <Link href="/drama" className="text-white/60 hover:text-white transition-colors">Drama</Link>
          </div>
          
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold mb-1">Legal</h3>
            <Link href="/dmca" className="text-white/60 hover:text-white transition-colors">DMCA</Link>
            <Link href="/terms" className="text-white/60 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">Privacy Policy</Link>
          </div>

          <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
            <h3 className="text-white font-semibold mb-1">Support</h3>
            <Link href="mailto:watchvortexofficial@gmail.com" className="text-white/60 hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-white/30 text-xs">
          &copy; {currentYear} Vortex Streaming. All rights reserved.
        </p>
        <p className="text-white/30 text-[10px] uppercase tracking-widest">
          Made for enthusiasts
        </p>
      </div>
    </footer>
  );
}
