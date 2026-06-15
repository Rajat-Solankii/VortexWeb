"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Smartphone, ChevronRight, X } from "lucide-react";

export default function AndroidAppBanner() {
  const [isAndroid, setIsAndroid] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user is on Android
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroidDevice = userAgent.indexOf("android") > -1;
    
    // Check if they haven't dismissed it
    const hasDismissed = localStorage.getItem("vortex_android_banner_dismissed");
    
    if (isAndroidDevice && !hasDismissed) {
      setIsAndroid(true);
      // Slight delay for smooth entrance
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem("vortex_android_banner_dismissed", "true");
  };

  if (!isAndroid) return null;

  return (
    <div 
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 mt-6 transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none h-0 mt-0 overflow-hidden"
      }`}
    >
      <Link href="/android" className="block relative overflow-hidden bg-gradient-to-r from-vortex-purple/20 to-vortex-blue/20 hover:from-vortex-purple/30 hover:to-vortex-blue/30 border border-vortex-purple/30 rounded-2xl p-4 shadow-[0_0_20px_rgba(124,77,255,0.15)] group transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-vortex-purple/30 rounded-full">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base">Experience Vortex on Android!</h3>
              <p className="text-gray-300 text-xs sm:text-sm mt-0.5">Ad-free streaming, native UI, and watch history.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center text-vortex-purple font-semibold text-sm mr-2 group-hover:text-white transition-colors">
              Get the App <ChevronRight className="w-4 h-4 ml-1" />
            </span>
            <button 
              onClick={handleDismiss}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10 relative"
              aria-label="Dismiss banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
