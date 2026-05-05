import Link from "next/link";

interface Genre {
  id: number;
  name: string;
}

export default function GenresList({ movieGenres, tvGenres }: { movieGenres: Genre[], tvGenres: Genre[] }) {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="w-1.5 h-6 bg-vortex-purple rounded-full mr-3 shadow-[0_0_10px_rgba(124,77,255,0.8)]"></span>
          Featured
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/drama"
            className="bg-gradient-to-br from-vortex-purple/20 to-vortex-blue/10 hover:from-vortex-purple/30 hover:to-vortex-blue/20 border border-white/10 hover:border-vortex-purple/50 rounded-2xl p-6 transition-all group relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-1">International Drama</h3>
              <p className="text-sm text-gray-400">Korean, Turkish, Chinese, and more.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-8xl">🎬</span>
            </div>
          </Link>
          <Link
            href="/anime"
            className="bg-gradient-to-br from-vortex-blue/20 to-vortex-purple/10 hover:from-vortex-blue/30 hover:to-vortex-purple/20 border border-white/10 hover:border-vortex-blue/50 rounded-2xl p-6 transition-all group relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-1">Anime Collection</h3>
              <p className="text-sm text-gray-400">Latest trending anime series.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-8xl">🎌</span>
            </div>
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="w-1.5 h-6 bg-vortex-blue rounded-full mr-3"></span>
          Movie Genres
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movieGenres.map((genre) => (
            <Link
              key={genre.id}
              href={`/genre/${genre.id}?type=movie&name=${genre.name}`}
              className="bg-white/5 hover:bg-vortex-blue/20 border border-white/10 hover:border-vortex-blue/50 rounded-xl p-4 text-center transition-all group"
            >
              <span className="text-gray-300 group-hover:text-white font-medium">{genre.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="w-1.5 h-6 bg-vortex-purple rounded-full mr-3"></span>
          TV Show Genres
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tvGenres.map((genre) => (
            <Link
              key={genre.id}
              href={`/genre/${genre.id}?type=tv&name=${genre.name}`}
              className="bg-white/5 hover:bg-vortex-purple/20 border border-white/10 hover:border-vortex-purple/50 rounded-xl p-4 text-center transition-all group"
            >
              <span className="text-gray-300 group-hover:text-white font-medium">{genre.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
