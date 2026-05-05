import HeroSection from "@/components/HeroSection";
import HomeClientView from "@/components/HomeClientView";
import { getTrending, getPopularMovies, getTopRatedTVShows, getTrendingAnime, getKDramas, getTurkishDramas, getChineseDramas, getPhilippineDramas } from "@/lib/tmdb";

export const revalidate = 3600;

export default async function Home() {
  const [trending, popularMovies, topRatedTV, anime, kDramas, turkishDramas, chineseDramas, philippineDramas] = await Promise.all([
    getTrending(),
    getPopularMovies(),
    getTopRatedTVShows(),
    getTrendingAnime(),
    getKDramas(),
    getTurkishDramas(),
    getChineseDramas(),
    getPhilippineDramas(),
  ]);

  const heroItem = trending?.[0] || popularMovies?.[0] || null;

  return (
    <div className="pb-12 -mt-16">
      <HeroSection item={heroItem} />
       <HomeClientView 
         trending={trending}
         popularMovies={popularMovies}
         topRatedTV={topRatedTV}
         anime={anime}
         kDramas={kDramas}
         turkishDramas={turkishDramas}
         chineseDramas={chineseDramas}
         philippineDramas={philippineDramas}
       />
    </div>
  );
}
