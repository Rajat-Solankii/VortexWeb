import MediaRow from "@/components/MediaRow";
import RecentlyPlayedRow from "@/components/RecentlyPlayedRow";
import ProvidersRow from "@/components/ProvidersRow";

export default function HomeClientView({
  trending,
  popularMovies,
  topRatedTV,
  anime,
  kDramas,
  turkishDramas,
  chineseDramas,
  philippineDramas,
  bollywood,
  upcoming,
  providers,
}: {
  trending: any[];
  popularMovies: any[];
  topRatedTV: any[];
  anime: any[];
  kDramas: any[];
  turkishDramas: any[];
  chineseDramas: any[];
  philippineDramas: any[];
  bollywood: any[];
  upcoming: any[];
  providers?: any[];
}) {
  return (
    <div className="relative z-10 pt-4">
      {/* Rows Container */}
      <div className="animate-in fade-in duration-500">
        <RecentlyPlayedRow />
        <ProvidersRow providers={providers} />
        <MediaRow title="Trending Today" items={trending?.slice(1)} viewAllLink="/movies" />
        <MediaRow title="Popular Movies" items={popularMovies} viewAllLink="/movies" />
        <MediaRow title="Bollywood Blockbusters" items={bollywood} viewAllLink="/bollywood" />

        <MediaRow title="Coming Soon" items={upcoming} viewAllLink="/movies" />
        <MediaRow title="Heart-Racing K-Dramas" items={kDramas} viewAllLink="/kdrama" />
        <MediaRow title="Top Rated TV Shows" items={topRatedTV} viewAllLink="/tv" />
        <MediaRow title="Turkish Delights" items={turkishDramas} viewAllLink="/dramas" />
        <MediaRow title="Trending Anime" items={anime} viewAllLink="/anime" />
        <MediaRow title="Chinese Epics" items={chineseDramas} viewAllLink="/dramas" />
        <MediaRow title="Filipino Favorites" items={philippineDramas} viewAllLink="/dramas" />
      </div>
    </div>
  );
}
