"use client";
import { useEffect } from "react";

export default function AdBanner({ dataAdSlot, className = "" }: { dataAdSlot: string, className?: string }) {
  useEffect(() => {
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden flex items-center justify-center bg-white/5 border border-white/10 rounded-xl relative ${className}`}>
      <span className="absolute text-xs text-white/30 tracking-widest uppercase pointer-events-none">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2781750854299489"
        data-ad-slot={dataAdSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
