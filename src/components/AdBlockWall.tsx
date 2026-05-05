"use client";
import { useState, useEffect } from "react";

export default function AdBlockWall() {
  const [isAdBlockActive, setIsAdBlockActive] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const checkAdBlock = async () => {
      // 1. Create a "Super Bait" element
      const bait = document.createElement("div");
      bait.setAttribute("id", "ad_unit_trap");
      bait.className = "pub_300x250 pub_728x90 text-ad textAd adsbox ad-unit ad-layer ads-container banner-ad google-ad";
      bait.setAttribute("style", "width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important; display: block !important; visibility: visible !important;");
      document.body.appendChild(bait);
      
      // Wait for a moment for blockers to react
      await new Promise(resolve => setTimeout(resolve, 100));

      const isHidden = window.getComputedStyle(bait).getPropertyValue("display") === "none" || 
                       window.getComputedStyle(bait).getPropertyValue("visibility") === "hidden" ||
                       bait.offsetParent === null ||
                       bait.offsetHeight === 0;

      // 2. Fetch multiple known ad scripts
      const scripts = [
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
        "https://pl29341352.profitablecpmratenetwork.com/78/bc/89/78bc896d2b5f195d7bb698d8e24e8c18.js"
      ];

      let isScriptBlocked = false;
      for (const url of scripts) {
        try {
          const res = await fetch(new Request(url), { method: "HEAD", mode: "no-cors", cache: "no-store" });
          if (res.status === 0) { // status 0 usually means a network block in some browsers
             // but no-cors makes this unreliable, so we rely on the catch block
          }
        } catch (e) {
          isScriptBlocked = true;
          break;
        }
      }

      setIsAdBlockActive(isHidden || isScriptBlocked);
      if (document.body.contains(bait)) document.body.removeChild(bait);
    };

    // Run check after a short delay to let blockers initialize
    const timer = setTimeout(checkAdBlock, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isClient || !isAdBlockActive) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-700">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-2xl shadow-vortex-purple/20">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">AdBlocker Detected</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            We noticed you're using an ad-blocker. To keep Vortex free and maintain our servers, we rely on ad revenue.
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-left space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-vortex-blue">How to fix:</p>
          <ol className="text-xs text-white/50 space-y-2 list-decimal pl-4">
            <li>Click on your <span className="text-white">AdBlocker extension</span> icon.</li>
            <li>Select <span className="text-white">"Disable on this site"</span> (or toggle the power button).</li>
            <li><span className="text-blue-400 font-bold">Refresh the page</span> to continue watching.</li>
          </ol>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-vortex-blue hover:text-white transition-all duration-300 shadow-lg active:scale-95"
        >
          I've disabled it, Refresh
        </button>

        <p className="text-[10px] text-white/20 uppercase tracking-tighter">
          Thank you for supporting Vortex
        </p>
      </div>
    </div>
  );
}
