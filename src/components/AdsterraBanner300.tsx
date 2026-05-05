"use client";
import { useEffect, useRef } from "react";

export default function AdsterraBanner300() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.firstChild) {
      const atOptions = {
        key: '75ac6d4cd6fcb8544055a81a094b4d92',
        format: 'iframe',
        height: 250,
        width: 300,
        params: {}
      };

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;
      
      const invokeScript = document.createElement("script");
      invokeScript.type = "text/javascript";
      invokeScript.src = "//www.highperformanceformat.com/75ac6d4cd6fcb8544055a81a094b4d92/invoke.js";

      bannerRef.current.appendChild(script);
      bannerRef.current.appendChild(invokeScript);
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 my-8">
      <span className="text-[10px] uppercase tracking-widest text-white/20 font-medium">Sponsored</span>
      <div 
        ref={bannerRef} 
        className="min-h-[250px] min-w-[300px] bg-white/5 border border-white/10 rounded-lg flex items-center justify-center overflow-hidden"
      />
    </div>
  );
}
