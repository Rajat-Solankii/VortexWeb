import HeroSection from "@/components/HeroSection";
import HomeClientView from "@/components/HomeClientView";
import AndroidAppBanner from "@/components/AndroidAppBanner";
import { getTrending, getPopularMovies, getTopRatedTVShows, getTrendingAnime, getKDramas, getTurkishDramas, getChineseDramas, getPhilippineDramas, getBollywoodMovies, getUpcomingMovies } from "@/lib/tmdb";

export const revalidate = 3600;

export default async function Home() {
  const [trending, popularMovies, topRatedTV, anime, kDramas, turkishDramas, chineseDramas, philippineDramas, bollywood, upcoming] = await Promise.all([
    getTrending(),
    getPopularMovies(),
    getTopRatedTVShows(),
    getTrendingAnime(),
    getKDramas(),
    getTurkishDramas(),
    getChineseDramas(),
    getPhilippineDramas(),
    getBollywoodMovies(),
    getUpcomingMovies(),
  ]);

  const heroItems = trending?.length ? trending.slice(0, 5) : popularMovies?.slice(0, 5) || [];

  return (
    <div className="pb-12 -mt-16">
      <HeroSection items={heroItems} />
      <AndroidAppBanner />
       <HomeClientView 
         trending={trending}
         popularMovies={popularMovies}
         topRatedTV={topRatedTV}
         anime={anime}
         kDramas={kDramas}
         turkishDramas={turkishDramas}
         chineseDramas={chineseDramas}
         philippineDramas={philippineDramas}
         bollywood={bollywood}
         upcoming={upcoming}
       />
    </div>
  );
}
