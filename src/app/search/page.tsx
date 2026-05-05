import { searchMulti } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";
import { cookies } from "next/headers";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q || "";
  const cookieStore = await cookies();
  // Force safe search regardless of cookie for global filtering
  const results = query ? await searchMulti(query, false) : [];

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">
        Search Results for <span className="text-vortex-purple">&quot;{query}&quot;</span>
      </h1>
      
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
          {results.map((item: any) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400">No results found.</p>
        </div>
      )}
    </div>
  );
}
