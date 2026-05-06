import { searchMulti } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string, force?: string }> }) {
  const { q, force } = await searchParams;
  const query = q || "";
  const isForced = force === "true";
  const cookieStore = await cookies();
  // Force safe search regardless of cookie for global filtering
  const { results, correctedQuery } = query 
    ? await searchMulti(query, false, isForced) 
    : { results: [], correctedQuery: undefined };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">
        Search Results for <span className="text-vortex-purple">&quot;{query}&quot;</span>
      </h1>
      
      {correctedQuery && (
        <div className="mb-8 space-y-1">
          <p className="text-gray-400 italic">
            Showing results for {" "}
            <Link 
              href={`/search?q=${encodeURIComponent(correctedQuery)}`}
              className="text-vortex-blue font-semibold hover:underline cursor-pointer"
            >
              &quot;{correctedQuery}&quot;
            </Link>
            {" "} instead
          </p>
          <p className="text-sm text-gray-500">
            Search instead for {" "}
            <Link 
              href={`/search?q=${encodeURIComponent(query)}&force=true`}
              className="text-vortex-purple hover:underline cursor-pointer"
            >
              &quot;{query}&quot;
            </Link>
          </p>
        </div>
      )}
      
      <div className={correctedQuery ? "" : "mt-8"}>
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
    </div>
  );
}
