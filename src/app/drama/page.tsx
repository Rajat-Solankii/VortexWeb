import { getAllDramas } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";
import Link from "next/link";

const LANGUAGES = [
  { label: "All", value: "" },
  { label: "Korean", value: "ko" },
  { label: "Turkish", value: "tr" },
  { label: "Chinese", value: "zh" },
  { label: "Filipino", value: "tl" },
];

export default async function DramaPage({ searchParams }: { searchParams: Promise<{ sort?: string, page?: string, lang?: string }> }) {
  const { sort, page, lang } = await searchParams;
  const sortBy = sort || "popularity.desc";
  const currentPage = parseInt(page || "1", 10);
  const selectedLang = lang || "";
  
  // If sorting by newest, we should allow unreleased content to fill the grid
  const allowUnreleased = sortBy === "first_air_date.desc";
  const data = await getAllDramas(sortBy, currentPage, selectedLang, allowUnreleased);
  const results = data?.results || [];

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center space-x-3 mb-2">
              <span className="w-1.5 h-10 bg-vortex-purple rounded-full shadow-[0_0_15px_rgba(124,77,255,0.8)]"></span>
              <span>Dramas</span>
          </h1>
          <p className="text-gray-400">Premium international drama series from across the globe.</p>
        </div>
        
        <div className="flex flex-col gap-4 w-full md:w-auto">
          {/* Language Selector */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {LANGUAGES.map((l) => (
              <Link
                key={l.value}
                href={`/drama?lang=${l.value}&sort=${sortBy}`}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${selectedLang === l.value ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
             <Link href={`/drama?lang=${selectedLang}&sort=popularity.desc`} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${sortBy === 'popularity.desc' ? 'bg-vortex-purple text-white shadow-[0_0_15px_rgba(124,77,255,0.5)]' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>Most Popular</Link>
             <Link href={`/drama?lang=${selectedLang}&sort=vote_average.desc`} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${sortBy === 'vote_average.desc' ? 'bg-vortex-purple text-white shadow-[0_0_15px_rgba(124,77,255,0.5)]' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>Top Rated</Link>
             <Link href={`/drama?lang=${selectedLang}&sort=first_air_date.desc`} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${sortBy === 'first_air_date.desc' ? 'bg-vortex-purple text-white shadow-[0_0_15px_rgba(124,77,255,0.5)]' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>Recently Added</Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
        {results.map((item: any) => (
          <MediaCard key={item.id} item={{ ...item, media_type: 'tv' }} />
        ))}
      </div>
      
      {results.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No dramas found for this category.
        </div>
      )}

      <div className="flex justify-center mt-12 space-x-4">
         {currentPage > 1 && (
             <Link href={`/drama?lang=${selectedLang}&sort=${sortBy}&page=${currentPage - 1}`} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">Previous</Link>
         )}
         <Link href={`/drama?lang=${selectedLang}&sort=${sortBy}&page=${currentPage + 1}`} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">Next Page</Link>
      </div>
    </div>
  );
}
