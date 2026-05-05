import { discoverDramas } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";
import Link from "next/link";

export default async function DramasPage({ searchParams }: { searchParams: Promise<{ sort?: string, page?: string }> }) {
  const { sort, page } = await searchParams;
  const sortBy = sort || "popularity.desc";
  const currentPage = parseInt(page || "1", 10);
  
  // Fetch 2 pages at once to fill the screen better
  const [page1, page2] = await Promise.all([
    discoverDramas(sortBy, currentPage * 2 - 1),
    discoverDramas(sortBy, currentPage * 2)
  ]);
  
  const results = [...(page1?.results || []), ...(page2?.results || [])];

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
            <span className="w-1.5 h-8 bg-vortex-purple rounded-full"></span>
            <span>Global Dramas</span>
        </h1>
        <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-hide">
           <Link href="/dramas?sort=popularity.desc" className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${sortBy === 'popularity.desc' ? 'bg-vortex-purple text-white shadow-[0_0_15px_rgba(124,77,255,0.5)]' : 'bg-white/10 text-gray-300'}`}>Popular</Link>
           <Link href="/dramas?sort=vote_average.desc" className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${sortBy === 'vote_average.desc' ? 'bg-vortex-purple text-white shadow-[0_0_15px_rgba(124,77,255,0.5)]' : 'bg-white/10 text-gray-300'}`}>Top Rated</Link>
           <Link href="/dramas?sort=first_air_date.desc" className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${sortBy === 'first_air_date.desc' ? 'bg-vortex-purple text-white shadow-[0_0_15px_rgba(124,77,255,0.5)]' : 'bg-white/10 text-gray-300'}`}>Newest</Link>
        </div>
      </div>
      
      <p className="text-gray-400 mb-8 text-sm">Discover the best Turkish, Chinese, and Filipino series.</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
        {results.map((item: any) => (
          <MediaCard key={item.id} item={{ ...item, media_type: 'tv' }} />
        ))}
      </div>
      
      <div className="flex justify-center mt-12 space-x-4">
         {currentPage > 1 && (
             <Link href={`/dramas?sort=${sortBy}&page=${currentPage - 1}`} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">Previous</Link>
         )}
         <Link href={`/dramas?sort=${sortBy}&page=${currentPage + 1}`} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">Next Page</Link>
      </div>
    </div>
  );
}
