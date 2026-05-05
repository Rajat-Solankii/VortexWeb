"use client";
import { useState, useEffect } from "react";

export default function AdBlockWall() {
  const [isAdBlockActive, setIsAdBlockActive] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const checkAdBlock = async () => {
      // 1. Element-based check (Bait div)
      const bait = document.createElement("div");
      bait.innerHTML = "&nbsp;";
      bait.className = "adsbox ad-unit ad-layer ads-container banner-ad pub_300x250 pub_728x90 text-ad textAd";
      bait.setAttribute("style", "width: 1px; height: 1px; position: absolute; left: -10000px; top: -1000px;");
      document.body.appendChild(bait);
      
      // Use MutationObserver to see if uBlock removes it instantly
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (Array.from(mutation.removedNodes).includes(bait)) {
             setIsAdBlockActive(true);
          }
        });
      });
      observer.observe(document.body, { childList: true });

      // Check if already hidden by CSS
      const isElementBlocked = window.getComputedStyle(bait).getPropertyValue("display") === "none" || 
                               bait.offsetHeight === 0;

      // 2. Fetch-based check (Bait URL)
      let isFetchBlocked = false;
      try {
        const baitUrl = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        await fetch(new Request(baitUrl), { method: "HEAD", mode: "no-cors", cache: "no-store" });
      } catch (error) {
        isFetchBlocked = true;
      }

      setIsAdBlockActive(isElementBlocked || isFetchBlocked);
      
      // Cleanup after a delay
      setTimeout(() => {
        if (document.body.contains(bait)) document.body.removeChild(bait);
        observer.disconnect();
      }, 5000);
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
