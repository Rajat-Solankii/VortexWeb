import { getProviders } from "@/lib/tmdb";
import Link from "next/link";
import ProviderImage from "@/components/ProviderImage";

const COLOR_PRESETS = [
  { color: "from-blue-600/30 to-indigo-900/40", hoverColor: "group-hover:border-blue-500/50" },
  { color: "from-red-600/30 to-red-900/40", hoverColor: "group-hover:border-red-500/50" },
  { color: "from-green-500/30 to-green-800/40", hoverColor: "group-hover:border-green-500/50" },
  { color: "from-orange-500/30 to-orange-800/40", hoverColor: "group-hover:border-orange-500/50" },
  { color: "from-purple-600/30 to-purple-900/40", hoverColor: "group-hover:border-purple-500/50" },
  { color: "from-teal-500/30 to-teal-800/40", hoverColor: "group-hover:border-teal-500/50" },
  { color: "from-yellow-600/30 to-red-800/40", hoverColor: "group-hover:border-yellow-500/50" },
  { color: "from-gray-700/30 to-black/60", hoverColor: "group-hover:border-gray-400/50" },
  { color: "from-pink-600/30 to-pink-900/40", hoverColor: "group-hover:border-pink-500/50" },
];

const hardcodedProviders = [
  { id: 8, name: "Netflix", logo: "/rK1KljqmbvO9HQa1PBFLILWah72.png", color: "from-red-600/30 to-red-900/40", hoverColor: "group-hover:border-red-500/50" },
  { id: 9, name: "Amazon Prime", logo: "/gMZdpavHmxFNnLpMHwVxfqeux2g.png", color: "from-blue-400/30 to-blue-700/40", hoverColor: "group-hover:border-blue-400/50" },
  { id: 15, name: "Hulu", logo: "/44uAnmSqvA4yBOdbPWN8YgQHjWm.png", color: "from-green-500/30 to-green-800/40", hoverColor: "group-hover:border-green-500/50" },
  { id: 337, name: "Disney+", logo: "/ruMrSFMJBMUpzjUL3dHD647qyEF.png", color: "from-blue-600/30 to-indigo-900/40", hoverColor: "group-hover:border-blue-500/50" },
  { id: 350, name: "Apple TV+", logo: "/9icYBfYFcwgCbky5VdGUIKJ4C5i.png", color: "from-gray-700/30 to-black/60", hoverColor: "group-hover:border-gray-400/50" },
  { id: 258, name: "fuboTV", logo: "/3wF8xISfVlcrc8X3jaa3uMUFGAr.png", color: "from-orange-500/30 to-orange-800/40", hoverColor: "group-hover:border-orange-500/50" },
  { id: 283, name: "Crunchyroll", logo: "/uFL3c4Cq8M6WoLymlC5Y8bmGytV.png", color: "from-orange-400/30 to-orange-700/40", hoverColor: "group-hover:border-orange-400/50" },
  { id: 531, name: "Paramount+", logo: "/4N4BMd0Mm0kHAmF7RZgL5lW3cwc.png", color: "from-blue-500/30 to-blue-800/40", hoverColor: "group-hover:border-blue-500/50" },
  { id: 384, name: "Max", logo: "/skypuy7SXuugIQeYg0IglmzoKaS.png", color: "from-indigo-600/30 to-indigo-900/40", hoverColor: "group-hover:border-indigo-500/50" },
  { id: 386, name: "Peacock", logo: "/a1UIdq5BrkcAxnxcUhFsNbXnxeu.png", color: "from-yellow-600/30 to-red-800/40", hoverColor: "group-hover:border-yellow-500/50" },
  { id: 192, name: "YouTube", logo: "/5Maob4o5w8oZnNeYpCDyVFD3M7X.png", color: "from-red-500/30 to-red-700/40", hoverColor: "group-hover:border-red-500/50" },
  { id: 3, name: "Google Play", logo: "/aZRENwYILujqs0RVOZutTh0BVGV.png", color: "from-gray-500/30 to-gray-800/40", hoverColor: "group-hover:border-gray-500/50" },
  { id: 7, name: "Vudu", logo: "/vksXbcPoeFbx5RVJk9L829QnUUI.png", color: "from-blue-400/30 to-blue-800/40", hoverColor: "group-hover:border-blue-400/50" },
  { id: 43, name: "Starz", logo: "/8rsWsgmQ1n5jKOKUuWclCAnlOSW.png", color: "from-slate-700/30 to-slate-900/40", hoverColor: "group-hover:border-slate-500/50" },
];

export default async function ProvidersPage() {
  const dynamicProviders = await getProviders();
  
  const displayProviders = dynamicProviders?.length 
    ? dynamicProviders.map((dp: any) => {
        const existing = hardcodedProviders.find(hp => hp.id === dp.provider_id);
        if (existing) return existing;
        
        const preset = COLOR_PRESETS[dp.provider_id % COLOR_PRESETS.length];
        return {
          id: dp.provider_id,
          name: dp.provider_name,
          logo: dp.logo_path,
          color: preset.color,
          hoverColor: preset.hoverColor
        };
      })
    : hardcodedProviders;

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center space-x-3 mb-2">
              <span className="w-1.5 h-8 bg-vortex-blue rounded-full drop-shadow-[0_0_8px_rgba(0,176,255,0.8)]"></span>
              <span>All Streaming Providers</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base ml-4">Browse movies and shows available on your favorite streaming platforms.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
        {displayProviders.map((provider: any) => (
          <Link
            key={provider.id}
            href={`/provider/${provider.id}?name=${encodeURIComponent(provider.name)}&type=movie`}
            className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 hover:scale-105 active:scale-95 text-center"
          >
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center bg-gradient-to-br ${provider.color} border border-white/5 shadow-lg group-hover:shadow-2xl ${provider.hoverColor} transition-all duration-300 overflow-hidden mb-4 relative p-1`}>
              <ProviderImage logo={provider.logo} name={provider.name} />
            </div>
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors line-clamp-1">{provider.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
