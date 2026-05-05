/* eslint-disable @next/next/no-img-element */
import HistoryTracker from "@/components/HistoryTracker";
import DownloadMediaButton from "@/components/DownloadMediaButton";
import CastSection from "@/components/CastSection";
import BackButton from "@/components/BackButton";
import VideoPlayer from "@/components/VideoPlayer";
import TrailerPlayer from "@/components/TrailerPlayer";
import MediaRow from "@/components/MediaRow";
import { getMovieDetails, getMovieRecommendations, getCredits, getVideos } from "@/lib/tmdb";

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
   const [movie, recommendations, cast, trailers] = await Promise.all([
     getMovieDetails(id),
     getMovieRecommendations(id),
     getCredits("movie", id),
     getVideos("movie", id)
   ]);

  if (!movie) return <div className="text-white text-center py-20">Movie not found.</div>;

  const now = new Date().toISOString().split('T')[0];
  const isNotReleased = movie.release_date && movie.release_date > now;

  return (
    <div>
       <HistoryTracker item={{ ...movie, media_type: 'movie' }} />
       <div className="relative w-full min-h-screen pb-12 pt-8 px-4 sm:px-6 lg:px-10 xl:px-16 mx-auto">
          <div className="mb-6 flex items-center">
             <BackButton />
          </div>
          <div className="absolute inset-0 z-[-1] opacity-20">
             <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt="" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-vortex-black via-vortex-black/80 to-vortex-black/20"></div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 mt-8">
             <div className="w-full lg:w-[260px] xl:w-[300px] flex-shrink-0 flex flex-col items-center lg:items-start">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-64 lg:w-full rounded-xl shadow-[0_0_30px_rgba(124,77,255,0.4)]" />
                <h1 className="text-3xl lg:text-4xl font-bold text-white mt-6 mb-2 text-center lg:text-left drop-shadow-md">{movie.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                   <span>{movie.release_date?.split('-')[0]}</span>
                   <span className="flex items-center text-vortex-blue"><span className="mr-1">★</span> {movie.vote_average?.toFixed(1)}</span>
                   {movie.runtime && <span>{movie.runtime} min</span>}
                </div>
                <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
                   {movie.genres?.map((g: any) => (
                      <span key={g.id} className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-xs">{g.name}</span>
                   ))}
                </div>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed drop-shadow-sm">{movie.overview}</p>
             </div>
             
             <div className="w-full flex-1 min-w-0 flex flex-col justify-start max-w-6xl">
                <div className="flex items-center justify-between mb-4">
                   <h2 className="text-2xl font-bold text-white">Watch Now</h2>
                   {!isNotReleased && <DownloadMediaButton type="movie" id={id} title={movie.title} />}
                </div>
                 {isNotReleased ? (
                    <div className="w-full aspect-video bg-vortex-black/40 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8 space-y-4">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                        <span className="text-4xl">⏳</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Not Released Yet</h3>
                        <p className="text-gray-400 max-w-md">This title is scheduled for release on <span className="text-vortex-purple font-medium">{movie.release_date}</span>. Stay tuned!</p>
                      </div>
                    </div>
                  ) : (
                    <VideoPlayer type="movie" id={id} title={movie.title} />
                  )}
                 <TrailerPlayer trailers={trailers} />
                 <CastSection cast={cast} />
              </div>


          </div>
       </div>

       <div className="w-full mx-auto pb-20 -mt-20">
          <MediaRow title="Recommended Movies" items={recommendations} />
       </div>
    </div>
  );
}
