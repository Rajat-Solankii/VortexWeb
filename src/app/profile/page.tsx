import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Play } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch bookmarks
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        {user.user_metadata.avatar_url && (
          <img 
            src={user.user_metadata.avatar_url} 
            alt="Profile" 
            className="w-16 h-16 rounded-full border-2 border-vortex-purple shadow-[0_0_20px_rgba(124,77,255,0.4)]"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </div>

      <div className="space-y-12 pb-20">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🔖</span>
            <h2 className="text-2xl font-bold text-white">My Watchlist</h2>
          </div>
          
          {(!bookmarks || bookmarks.length === 0) ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <p className="text-gray-400">Your watchlist is empty. Go bookmark some movies!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {bookmarks.map((item) => (
                <Link key={`${item.media_type}-${item.media_id}`} href={`/${item.media_type}/${item.media_id}`} className="group relative block aspect-[2/3] overflow-hidden rounded-xl bg-vortex-black/50 border border-white/5 transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(124,77,255,0.3)] hover:border-vortex-purple/50">
                  <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title || "Poster"} className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-vortex-black/90 via-vortex-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vortex-purple text-white shadow-[0_0_20px_rgba(124,77,255,0.6)] transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play className="h-5 w-5 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <h3 className="text-sm font-bold text-white line-clamp-2 drop-shadow-md">{item.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
