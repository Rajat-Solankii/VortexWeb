import { getGenres } from "@/lib/tmdb";
import GenresList from "@/components/GenresList";

export default async function GenresPage() {
  const [movieGenres, tvGenres] = await Promise.all([
    getGenres("movie"),
    getGenres("tv")
  ]);

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">Browse by Genre</h1>
        <p className="text-gray-400">Find exactly what you're looking for in our curated categories.</p>
      </div>
      
      <GenresList movieGenres={movieGenres} tvGenres={tvGenres} />
    </div>
  );
}
