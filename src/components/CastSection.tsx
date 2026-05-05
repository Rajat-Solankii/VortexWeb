/* eslint-disable @next/next/no-img-element */
"use client";

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export default function CastSection({ cast }: { cast: CastMember[] }) {
  if (!cast || cast.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">Series Cast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {cast.map((member) => (
          <div key={member.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-vortex-purple/50 transition-all group">
            <div className="aspect-[2/3] relative overflow-hidden">
              {member.profile_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w185${member.profile_path}`} 
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-vortex-black/40 flex items-center justify-center text-gray-500 italic text-xs p-4 text-center">
                  No Image Available
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-bold text-white truncate">{member.name}</h3>
              <p className="text-xs text-gray-400 truncate mt-0.5">{member.character}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
