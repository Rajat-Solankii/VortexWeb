"use client";
import { useState, useEffect } from "react";
import { Clock, Download, Loader2 } from "lucide-react";

export default function APKDownloadButton() {
  const [updateInfo, setUpdateInfo] = useState<{ versionName: string; updateUrl: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpdateInfo() {
      try {
        const res = await fetch("https://raw.githubusercontent.com/Rajat-Solankii/VortexApp/main/update.json", {
          cache: 'no-store' // Avoid aggressive browser caching for the update file
        });
        if (res.ok) {
          const data = await res.json();
          setUpdateInfo({
            versionName: data.versionName,
            updateUrl: data.updateUrl
          });
        }
      } catch (error) {
        console.error("Failed to fetch update info", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUpdateInfo();
  }, []);

  if (loading) {
    return (
      <div className="inline-flex items-center justify-center min-w-[220px] h-[72px] bg-vortex-purple/40 text-white rounded-full border border-white/10">
        <Loader2 className="w-6 h-6 animate-spin text-white/70" />
      </div>
    );
  }

  return (
    <a 
      href={updateInfo?.updateUrl || "https://github.com/Rajat-Solankii/VortexApp/releases/latest"}
      className="inline-flex items-center gap-3 bg-vortex-purple hover:bg-vortex-blue text-white text-lg font-bold py-4 px-10 rounded-full transition-all border border-white/10 shadow-[0_0_20px_rgba(124,77,255,0.4)] hover:shadow-[0_0_25px_rgba(0,176,255,0.6)]"
    >
      <Download className="w-6 h-6" />
      <div className="flex flex-col items-start">
        <span>Download App</span>
        <span className="text-xs font-normal text-white/80">
          {updateInfo?.versionName ? `Version ${updateInfo.versionName} • Android` : "For Android"}
        </span>
      </div>
    </a>
  );
}
