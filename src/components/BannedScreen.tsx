import { ShieldAlert } from "lucide-react";

const POSTERS = [
  "https://static.tvmaze.com/uploads/images/original_untouched/610/1525272.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/163/407679.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/0/15.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/143/358967.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/490/1226764.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/477/1194981.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/498/1245275.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/0/73.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/82/206879.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/69/174906.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/189/474715.jpg",
  "https://static.tvmaze.com/uploads/images/original_untouched/0/137.jpg"
];

export default function BannedScreen({ ip }: { ip: string }) {
  return (
    <div className="flex-grow flex items-center justify-center bg-[#07090e] px-4 relative overflow-hidden w-full min-h-screen">
      {/* Background Animated Posters - Darkened & Red Tint for Banned */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex flex-col gap-4 -rotate-12 scale-125 overflow-hidden mix-blend-luminosity brightness-50">
        {/* Row 1 - Moves Left */}
        <div className="flex gap-4 min-w-[200vw] animate-[slide-left_40s_linear_infinite]">
          {[...POSTERS, ...POSTERS, ...POSTERS].map((poster, i) => (
            <div key={`r1-${i}`} className="w-48 h-72 relative rounded-xl overflow-hidden shrink-0 shadow-2xl">
              <img src={poster} alt="Movie Poster" className="object-cover w-full h-full" />
            </div>
          ))}
        </div>
        
        {/* Row 2 - Moves Right */}
        <div className="flex gap-4 min-w-[200vw] animate-[slide-right_50s_linear_infinite]">
          {[...POSTERS.reverse(), ...POSTERS, ...POSTERS].map((poster, i) => (
            <div key={`r2-${i}`} className="w-48 h-72 relative rounded-xl overflow-hidden shrink-0 shadow-2xl">
              <img src={poster} alt="Movie Poster" className="object-cover w-full h-full" />
            </div>
          ))}
        </div>
        
        {/* Row 3 - Moves Left */}
        <div className="flex gap-4 min-w-[200vw] animate-[slide-left_35s_linear_infinite]">
          {[...POSTERS.sort(() => 0.5 - Math.random()), ...POSTERS, ...POSTERS].map((poster, i) => (
            <div key={`r3-${i}`} className="w-48 h-72 relative rounded-xl overflow-hidden shrink-0 shadow-2xl">
              <img src={poster} alt="Movie Poster" className="object-cover w-full h-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Vignette Overlay & Ambient Red Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#07090e] via-transparent to-[#07090e] z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-[#07090e] z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Main Content Modal */}
      <div className="bg-black/60 backdrop-blur-3xl border border-white/5 rounded-3xl p-10 max-w-lg w-full text-center shadow-[0_0_80px_rgba(239,68,68,0.15)] relative z-10 overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-[0_0_100px_rgba(239,68,68,0.2)]">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
        
        {/* Glowing Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative w-full h-full bg-gradient-to-b from-red-500/20 to-red-900/40 rounded-full border border-red-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="w-12 h-12 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          </div>
        </div>
        
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-4 tracking-tight">
          Access Restricted
        </h1>
        
        <p className="text-gray-400 text-lg leading-relaxed mb-10 font-light">
          Your network has been blocked from accessing the Vortex platform due to a security policy violation.
        </p>

        <div className="inline-block relative">
          <div className="absolute inset-0 bg-red-500 blur-xl opacity-30"></div>
          <div className="text-sm text-gray-400 font-mono tracking-widest px-6 py-3 rounded-full border border-red-500/30 bg-red-950/40 relative z-10 flex items-center justify-center gap-2">
            <span className="text-red-500/60 text-xs">IP:</span> {ip}
          </div>
        </div>
      </div>
      
      {/* Subtle noise texture overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes slide-right {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }
      `}} />
    </div>
  );
}
