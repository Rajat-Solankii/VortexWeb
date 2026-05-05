/* eslint-disable @next/next/no-img-element */
import TVPlayerContainer from "@/components/TVPlayerContainer";
import MediaRow from "@/components/MediaRow";
import CastSection from "@/components/CastSection";
import BackButton from "@/components/BackButton";
import TrailerPlayer from "@/components/TrailerPlayer";
import { getTVDetails, getTVRecommendations, getCredits, getVideos } from "@/lib/tmdb";

export default async function TVDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [tv, recommendations, cast, trailers] = await Promise.all([
    getTVDetails(id),
    getTVRecommendations(id),
    getCredits("tv", id),
    getVideos("tv", id)
  ]);

  if (!tv) return <div className="text-white text-center py-20">TV Show not found.</div>;

  const now = new Date().toISOString().split('T')[0];
  const isNotReleased = tv.first_air_date && tv.first_air_date > now;

  return (
    <div>
       <div className="relative w-full min-h-screen pb-12 pt-8 px-4 sm:px-6 lg:px-10 xl:px-16 mx-auto">
          <div className="mb-6 flex items-center">
             <BackButton />
          </div>
          <div className="absolute inset-0 z-[-1] opacity-20">
             <img src={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`} alt="" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-vortex-black via-vortex-black/80 to-vortex-black/20"></div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 mt-8">
             <div className="w-full lg:w-[260px] xl:w-[300px] flex-shrink-0 flex flex-col items-center lg:items-start">
                <img src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`} alt={tv.name} className="w-64 lg:w-full rounded-xl shadow-[0_0_30px_rgba(124,77,255,0.4)]" />
                <h1 className="text-3xl lg:text-4xl font-bold text-white mt-6 mb-2 text-center lg:text-left drop-shadow-md">{tv.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                   <span>{tv.first_air_date?.split('-')[0]}</span>
                   <span className="flex items-center text-vortex-purple"><span className="mr-1">★</span> {tv.vote_average?.toFixed(1)}</span>
                   <span>{tv.number_of_seasons} Seasons</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
                   {tv.genres?.map((g: any) => (
                      <span key={g.id} className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-xs">{g.name}</span>
                   ))}
                </div>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed drop-shadow-sm">{tv.overview}</p>
             </div>
             
             <div className="w-full flex-1 min-w-0 max-w-6xl">
                  {isNotReleased ? (
                     <div className="w-full aspect-video bg-vortex-black/40 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8 space-y-4">
                       <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                         <span className="text-4xl">⏳</span>
                       </div>
                       <div>
                         <h3 className="text-2xl font-bold text-white mb-2">Series Not Released Yet</h3>
                         <p className="text-gray-400 max-w-md">This show is scheduled to premiere on <span className="text-vortex-purple font-medium">{tv.first_air_date}</span>. Stay tuned!</p>
                       </div>
                     </div>
                  ) : (
                     <TVPlayerContainer id={id} tv={tv} />
                  )}
                 <TrailerPlayer trailers={trailers} />
                 <CastSection cast={cast} />
              </div>

          </div>
       </div>

       <div className="w-full mx-auto pb-20 -mt-20">
          <MediaRow title="Recommended TV Shows" items={recommendations} />
       </div>
    </div>
  );
}
