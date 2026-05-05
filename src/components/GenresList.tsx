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
