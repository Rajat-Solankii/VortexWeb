"use client";
import { useEffect, useRef } from "react";

export default function AdsterraBanner728() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.firstChild) {
      const atOptions = {
        key: '1d8411537d3433e2dc11a55e4f0f7321',
        format: 'iframe',
        height: 90,
        width: 728,
        params: {}
      };

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

      const invokeScript = document.createElement("script");
      invokeScript.type = "text/javascript";
      invokeScript.src = "//alarmpenguinmelt.com/1d8411537d3433e2dc11a55e4f0f7321/invoke.js";

      bannerRef.current.appendChild(script);
      bannerRef.current.appendChild(invokeScript);
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 my-8 w-full overflow-hidden">
      <span className="text-[10px] uppercase tracking-widest text-white/20 font-medium">Advertisement</span>
      <div 
        ref={bannerRef} 
        className="min-h-[90px] w-full max-w-[728px] bg-white/5 border border-white/10 rounded-lg flex items-center justify-center overflow-hidden"
      />
    </div>
  );
}
