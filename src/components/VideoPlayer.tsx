"use client";
import { Info, Cloud, Server, Download } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function VideoPlayer({ type, id, season, episode, title, posterPath, tmdbSeason, tmdbEpisode, anilistId, absoluteEpisode }: { type: "movie" | "tv", id: string, season?: number, episode?: number, title?: string, posterPath?: string, tmdbSeason?: number, tmdbEpisode?: number, anilistId?: number | null, absoluteEpisode?: number }) {
  const [activeServer, setActiveServer] = useState<"ythd" | "nxsha" | "rozgarlelo" | "vixsrc" | "vidcore" | "vidrock" | "primesrc">("nxsha");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  let url = "";
  let downloadUrl = "";

  // Use TMDB-specific season/episode if provided (vital for flattened anime), otherwise fallback to UI season/episode
  const s = tmdbSeason ?? season ?? 1;
  const e = tmdbEpisode ?? episode ?? 1;
  const ep = absoluteEpisode ?? e;

  useEffect(() => {
    const faviconElements = document.querySelectorAll("link[rel*='icon']");
    const originalFavicons = Array.from(faviconElements).map((el: any) => ({ el, href: el.href }));

    if (title) {
      if (type === "tv") {
        document.title = `Watching ${title} - S${s} E${e} | Vortex`;
      } else {
        document.title = `Watching ${title} | Vortex`;
      }
    }

    if (posterPath) {
      const iconUrl = `https://image.tmdb.org/t/p/w92${posterPath}`;
      if (faviconElements.length > 0) {
        faviconElements.forEach((el: any) => {
          el.href = iconUrl;
        });
      } else {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = iconUrl;
        link.id = 'dynamic-favicon';
        document.head.appendChild(link);
      }
    }

    return () => {
      document.title = "Vortex | Premium Streaming";
      if (originalFavicons.length > 0) {
        originalFavicons.forEach(({ el, href }) => {
          el.href = href;
        });
      } else {
        const dynamicFavicon = document.getElementById('dynamic-favicon');
        if (dynamicFavicon) {
          dynamicFavicon.remove();
        }
      }
    };
  }, [title, type, s, e, posterPath]);

  // Handle 'f' key for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'f' || e.key === 'F') {
        // Toggle fullscreen on the iframe container for best results
        const container = iframeRef.current?.parentElement;
        if (container) {
          if (!document.fullscreenElement) {
            container.requestFullscreen().catch((err) => {
              console.error("Error attempting to enable fullscreen:", err);
            });
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (activeServer === "ythd") {
    if (type === "movie") {
      url = `https://ythd.org/embed/${id}`;
    } else {
      url = `https://ythd.org/embed/${id}/${s}-${e}`;
    }
  } else if (activeServer === "nxsha") {
    if (type === "movie") {
      url = `https://nxsha.space/embed/movie/${id}`;
    } else {
      url = `https://nxsha.space/embed/tv/${id}/${s}/${e}`;
    }
  } else if (activeServer === "rozgarlelo") {
    if (type === "movie") {
      url = `https://rozgarlelo.modiplay.xyz/embed/tmdb/movie?id=${id}`;
    } else {
      url = `https://rozgarlelo.modiplay.xyz/embed/tmdb/tv?id=${id}&s=${s}&e=${e}`;
    }
  } else if (activeServer === "vixsrc") {
    if (type === "movie") {
      url = `https://vixsrc.to/embed/movie/${id}`;
    } else {
      url = `https://vixsrc.to/embed/tv/${id}/${s}/${e}`;
    }
  } else if (activeServer === "vidcore") {
    if (type === "movie") {
      url = `https://vidcore.io/embed/movie/${id}`;
    } else {
      url = `https://vidcore.io/embed/tv/${id}/${s}/${e}`;
    }
  } else if (activeServer === "vidrock") {
    if (type === "movie") {
      url = `https://vidrock.net/embed/movie/${id}`;
    } else {
      url = `https://vidrock.net/embed/tv/${id}/${s}/${e}`;
    }
  } else if (activeServer === "primesrc") {
    if (type === "movie") {
      url = `https://primesrc.me/embed/movie?tmdb=${id}`;
    } else {
      url = `https://primesrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`;
    }
  }

  downloadUrl = `https://moviesdl.cc/p/info.html?id=${id}&type=${type}`;

  return (
    <div className="space-y-4">
      {/* Server Selection and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm font-medium flex items-center gap-1.5">
              <Server className="w-4 h-4" /> Server:
            </span>
            <select
              value={activeServer}
              onChange={(e) => setActiveServer(e.target.value as any)}
              className="bg-black border border-white/10 text-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-vortex-purple focus:ring-1 focus:ring-vortex-purple transition-all"
            >
              <option value="nxsha">Server 1 (Multi Language)</option>
              <option value="rozgarlelo">Server 2 (Multi Language)</option>
              <option value="primesrc">Server 3</option>
              <option value="ythd">Server 4</option>
              <option value="vixsrc">Server 5</option>
              <option value="vidcore">Server 6</option>
              <option value="vidrock">Server 7</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 italic max-w-sm">
            <Info className="w-3 h-3 inline-block mr-1 mb-0.5 opacity-80" />
            Note: Switch to Server 2 if you want to watch Anime. Use Server 3 as a last resort.
          </p>
        </div>

        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          <Download className="w-4 h-4" />
          Download
        </a>
      </div>

      {/* Video Container */}
      <div
        className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(124,77,255,0.15)] border border-white/10 relative"
        style={{ transform: 'translateZ(0)', willChange: 'transform', backfaceVisibility: 'hidden' }}
        onClick={() => iframeRef.current?.focus()}
        onMouseEnter={() => iframeRef.current?.focus()}
      >
        <iframe
          key={activeServer}
          ref={iframeRef}
          src={url}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="eager"
          referrerPolicy="same-origin"
          className="w-full h-full absolute inset-0"
          style={{ border: "none" }}
          onLoad={() => {
            // Auto-focus iframe so space/arrows work for the video player out of the box
            iframeRef.current?.focus();
          }}
        ></iframe>
      </div>

      {/* Information Note */}
      <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner group">
        <div className="mt-0.5 flex-shrink-0">
          <Info className="h-5 w-5 text-vortex-purple" />
        </div>
        <div className="text-[13px] text-gray-300 leading-relaxed">
          <p className="mb-2">
            <span className="text-white font-bold uppercase tracking-wider mr-2 text-[12px]">Note:</span>
            If the video is not playing, try changing the server from the options above or the
            <span className="inline-flex items-center justify-center bg-zinc-800 w-6 h-6 rounded-full mx-1.5 shadow-sm border border-white/5 align-middle">
              <Cloud className="w-3.5 h-3.5 text-white" fill="currentColor" strokeWidth={1.5} />
            </span>
            inside the player itself.
          </p>
          <p className="text-[12px] text-gray-400">
            <strong className="text-gray-300">Mobile Data Buffering?</strong> Mobile carriers often intentionally throttle video streaming speeds. If you experience buffering on mobile data but not on Wi-Fi, try connecting to Wi-Fi, using a free VPN (like 1.1.1.1), or switching the player's server above.
          </p>
        </div>
      </div>
    </div>
  );
}
