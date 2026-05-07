import MediaRow from "@/components/MediaRow";
import RecentlyPlayedRow from "@/components/RecentlyPlayedRow";

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
}) {
  return (
    <div className="relative z-10 pt-4">
      {/* Rows Container */}
      <div className="animate-in fade-in duration-500">
        <RecentlyPlayedRow />
        <MediaRow title="Trending Today" items={trending?.slice(1)} />
        <MediaRow title="Popular Movies" items={popularMovies} />
        <MediaRow title="Bollywood Blockbusters" items={bollywood} />

        <MediaRow title="Coming Soon" items={upcoming} />
        <MediaRow title="Heart-Racing K-Dramas" items={kDramas} />
        <MediaRow title="Top Rated TV Shows" items={topRatedTV} />
        <MediaRow title="Turkish Delights" items={turkishDramas} />
        <MediaRow title="Trending Anime" items={anime} />
        <MediaRow title="Chinese Epics" items={chineseDramas} />
        <MediaRow title="Filipino Favorites" items={philippineDramas} />
      </div>
    </div>
  );
}
