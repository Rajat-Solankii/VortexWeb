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
    <div className="flex justify-center my-8">
      <div 
        ref={bannerRef} 
        className="min-h-[250px] min-w-[300px]"
      />
    </div>
  );
}
