"use client";
import { Download, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function APKDownloadButton() {
  const [downloadInfo, setDownloadInfo] = useState<{ url: string; version: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpdate() {
      try {
        const response = await fetch("https://raw.githubusercontent.com/Rajat-Solankii/VortexApp/main/update.json", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setDownloadInfo({
            url: data.updateUrl,
            version: data.versionName,
          });
        }
      } catch (error) {
        console.error("Failed to fetch update info:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUpdate();
  }, []);

  if (loading) {
    return (
      <div className="inline-flex items-center gap-3 bg-vortex-purple/50 text-white/80 text-lg font-bold py-4 px-10 rounded-full border border-white/10 shadow-[0_0_20px_rgba(124,77,255,0.2)]">
        <Loader2 className="w-6 h-6 animate-spin" />
        <div className="flex flex-col items-start">
          <span>Fetching details...</span>
        </div>
      </div>
    );
  }

  if (!downloadInfo) {
    return (
      <div className="inline-flex items-center gap-3 bg-gray-600/50 text-white/80 text-lg font-bold py-4 px-10 rounded-full border border-white/10 cursor-not-allowed">
        <Download className="w-6 h-6" />
        <div className="flex flex-col items-start">
          <span>Download Unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <a
      href={downloadInfo.url}
      className="inline-flex items-center gap-3 bg-vortex-purple hover:bg-vortex-purple/80 text-white text-lg font-bold py-4 px-10 rounded-full shadow-[0_0_20px_rgba(124,77,255,0.4)] transition-all transform hover:scale-105"
    >
      <Download className="w-6 h-6" />
      <div className="flex flex-col items-start">
        <span>Download APK</span>
        <span className="text-xs font-normal text-white/80">
          Version {downloadInfo.version}
        </span>
      </div>
    </a>
  );
}
