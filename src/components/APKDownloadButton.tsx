"use client";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";

export default function APKDownloadButton() {
  const [url, setUrl] = useState<string | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/Rajat-Solankii/VortexApp/main/update.json")
      .then(res => res.json())
      .then(data => {
        if (data.updateUrl) {
          setUrl(data.updateUrl);
          if (data.latestVersion) setVersion(data.latestVersion);
        }
      })
      .catch(err => console.error("Failed to fetch update.json", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 bg-vortex-purple/50 text-white font-bold py-4 px-8 rounded-full animate-pulse">
        <span>Loading update info...</span>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex items-center justify-center gap-2 bg-red-500/50 text-white font-bold py-4 px-8 rounded-full">
        <span>Download currently unavailable</span>
      </div>
    );
  }

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 bg-vortex-purple hover:bg-vortex-blue text-white text-lg font-bold py-4 px-10 rounded-full transition-all shadow-[0_0_20px_rgba(124,77,255,0.6)] hover:shadow-[0_0_30px_rgba(0,176,255,0.8)] hover:scale-105"
    >
      <Download className="w-6 h-6" />
      <div className="flex flex-col items-start">
        <span>Download for Android</span>
        {version && <span className="text-xs font-normal text-white/80">Version {version}</span>}
      </div>
    </a>
  );
}
