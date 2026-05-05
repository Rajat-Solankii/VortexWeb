import { discoverByGenre } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";
import Link from "next/link";

export default async function GenreDetailsPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>, 
  searchParams: Promise<{ type?: string, name?: string, sort?: string, page?: string }> 
}) {
  const { id } = await params;
  const { type, name, sort, page } = await searchParams;
  
  const mediaType = (type as "movie" | "tv") || "movie";
  const genreName = name || "Genre";
  const sortBy = sort || "popularity.desc";
  const currentPage = parseInt(page || "1", 10);
  
  const data = await discoverByGenre(mediaType, id, sortBy, currentPage);
  const results = data?.results || [];

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-2 uppercase tracking-widest">
            <Link href="/genres" className="hover:text-white transition-colors">Genres</Link>
            <span>/</span>
            <span className="text-vortex-purple">{mediaType === 'movie' ? 'Movies' : 'TV'}</span>
          </nav>
          <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
              <span className="w-1.5 h-8 bg-vortex-purple rounded-full"></span>
              <span>{genreName}</span>
          </h1>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-hide">
           <Link href={`/genre/${id}?type=${mediaType}&name=${genreName}&sort=popularity.desc`} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${sortBy === 'popularity.desc' ? 'bg-vortex-purple text-white shadow-[0_0_15px_rgba(124,77,255,0.5)]' : 'bg-white/10 text-gray-300'}`}>Popular</Link>
           <Link href={`/genre/${id}?type=${mediaType}&name=${genreName}&sort=vote_average.desc`} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${sortBy === 'vote_average.desc' ? 'bg-vortex-purple text-white shadow-[0_0_15px_rgba(124,77,255,0.5)]' : 'bg-white/10 text-gray-300'}`}>Top Rated</Link>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
        {results.map((item: any) => (
          <MediaCard key={item.id} item={{ ...item, media_type: mediaType }} />
        ))}
      </div>
      
      <div className="flex justify-center mt-12 space-x-4">
         {currentPage > 1 && (
             <Link href={`/genre/${id}?type=${mediaType}&name=${genreName}&sort=${sortBy}&page=${currentPage - 1}`} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">Previous</Link>
         )}
         <Link href={`/genre/${id}?type=${mediaType}&name=${genreName}&sort=${sortBy}&page=${currentPage + 1}`} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">Next Page</Link>
      </div>
    </div>
  );
}
