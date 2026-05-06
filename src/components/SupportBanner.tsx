"use client";
import { Heart, ShieldAlert, X } from "lucide-react";
import { useState } from "react";

export default function SupportBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-10 xl:px-16 mb-8 animate-in fade-in slide-in-from-top duration-700">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-vortex-purple/20 via-vortex-blue/10 to-vortex-purple/20 border border-white/10 backdrop-blur-md p-6 sm:p-8">
        {/* Decorative Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-vortex-purple/20 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-vortex-blue/20 rounded-full blur-[80px]"></div>
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
            <div className="w-14 h-14 bg-vortex-purple/20 rounded-full flex items-center justify-center border border-vortex-purple/30 shadow-[0_0_20px_rgba(124,77,255,0.3)]">
              <Heart className="w-7 h-7 text-vortex-purple animate-pulse fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white mb-1 tracking-tight">Support Vortex!</h3>
              <p className="text-gray-300 text-sm md:text-base max-w-xl leading-relaxed">
                Vortex is powered by ads to keep our streaming service <span className="text-white font-bold underline decoration-vortex-purple decoration-2">100% free</span>. 
                Please consider <span className="text-vortex-blue font-bold">disabling your ad blocker</span> to help us maintain the servers.
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all self-start md:self-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
