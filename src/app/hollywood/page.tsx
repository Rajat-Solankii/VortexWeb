import { discoverHollywood } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";
import Link from "next/link";

export default async function HollywoodPage({ searchParams }: { searchParams: Promise<{ sort?: string, page?: string }> }) {
  const { sort, page } = await searchParams;
  const sortBy = sort || "popularity.desc";
  const currentPage = parseInt(page || "1", 10);
  
  const data = await discoverHollywood(sortBy, currentPage);
  const results = data?.results || [];

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center space-x-3 mb-2">
              <span className="w-1.5 h-8 bg-vortex-blue rounded-full"></span>
              <span>Hollywood Hits</span>
          </h1>
          <p className="text-gray-400 text-sm">The best of Western cinema and global blockbusters.</p>
        </div>
        <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-hide">
           <Link href="/hollywood?sort=popularity.desc" className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${sortBy === 'popularity.desc' ? 'bg-vortex-blue text-white shadow-[0_0_15px_rgba(0,176,255,0.5)]' : 'bg-white/10 text-gray-300'}`}>Popular</Link>
           <Link href="/hollywood?sort=vote_average.desc" className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${sortBy === 'vote_average.desc' ? 'bg-vortex-blue text-white shadow-[0_0_15px_rgba(0,176,255,0.5)]' : 'bg-white/10 text-gray-300'}`}>Top Rated</Link>
           <Link href="/hollywood?sort=primary_release_date.desc" className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${sortBy === 'primary_release_date.desc' ? 'bg-vortex-blue text-white shadow-[0_0_15px_rgba(0,176,255,0.5)]' : 'bg-white/10 text-gray-300'}`}>Newest</Link>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
        {results.map((item: any) => (
          <MediaCard key={item.id} item={{ ...item, media_type: 'movie' }} />
        ))}
      </div>
      
      <div className="flex justify-center mt-12 space-x-4">
         {currentPage > 1 && (
             <Link href={`/hollywood?sort=${sortBy}&page=${currentPage - 1}`} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">Previous</Link>
         )}
         <Link href={`/hollywood?sort=${sortBy}&page=${currentPage + 1}`} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">Next Page</Link>
      </div>
    </div>
  );
}
