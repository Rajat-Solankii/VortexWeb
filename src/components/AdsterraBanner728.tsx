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
    <div className="flex justify-center my-8 w-full overflow-hidden">
      <div 
        ref={bannerRef} 
        className="min-h-[90px] w-full max-w-[728px]"
      />
    </div>
  );
}
