"use client";

import { useState, useEffect, useRef } from "react";
import { Bookmark, FolderPlus, Plus, Check } from "lucide-react";
import { useSession } from "next-auth/react";

interface UserActionsProps {
  mediaId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath?: string;
}

export default function UserActions({ mediaId, mediaType, title, posterPath }: UserActionsProps) {
  const { data: session, status } = useSession();
  const loadingSession = status === "loading";
  const user = session?.user;
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(true);

  // Collections state
  const [collections, setCollections] = useState<any[]>([]);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [savingCollectionId, setSavingCollectionId] = useState<string | null>(null);
  const [savedCollectionId, setSavedCollectionId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchState = async () => {
      if (user) {
        try {
          const res = await fetch(`/api/bookmarks?mediaId=${mediaId}&mediaType=${mediaType}`);
          if (res.ok) {
            const data = await res.json();
            setIsBookmarked(data.bookmarked);
          }
          // Fetch collections
          const colRes = await fetch(`/api/collections`);
          if (colRes.ok) {
            const colData = await colRes.json();
            setCollections(colData.collections || []);
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLoadingBookmark(false);
    };

    if (!loadingSession) {
      fetchState();
    }
  }, [mediaId, mediaType, user, loadingSession]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCollectionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleAction = async () => {
    if (!user) {
      window.dispatchEvent(
        new CustomEvent("open-auth-modal", {
          detail: { message: "Please sign in to save your favorites!" },
        })
      );
      return;
    }

    const newBookmarkedState = !isBookmarked;

    // Optimistic UI update
    setIsBookmarked(newBookmarkedState);

    if (newBookmarkedState) {
      // Insert bookmark
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId, mediaType, title, posterPath }),
      });

      if (!res.ok) {
        setIsBookmarked(false); // Revert
      }
    } else {
      // Delete bookmark
      const res = await fetch(`/api/bookmarks?mediaId=${mediaId}&mediaType=${mediaType}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setIsBookmarked(true); // Revert
      }
    }
  };

  const handleAddToCollection = async (collectionId: string) => {
    if (!user) return;
    setSavingCollectionId(collectionId);
    try {
      const res = await fetch("/api/collections/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collectionId, mediaId, mediaType, title, posterPath }),
      });
      if (res.ok) {
        setSavedCollectionId(collectionId);
        setTimeout(() => setSavedCollectionId(null), 2000);
      }
    } catch (e) {
      console.error(e);
    }
    setSavingCollectionId(null);
  };

  if (loadingSession || loadingBookmark) {
    return (
      <div className="flex gap-3 mt-4">
        <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
        <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mt-4 relative" ref={dropdownRef}>
      <button
        onClick={toggleAction}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isBookmarked 
            ? "bg-vortex-purple/20 text-vortex-purple border border-vortex-purple/50 shadow-[0_0_15px_rgba(124,77,255,0.3)]" 
            : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
        }`}
        title={isBookmarked ? "Remove Bookmark" : "Watchlist"}
      >
        <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
      </button>

      <button
        onClick={() => {
          if (!user) {
            window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { message: "Please sign in to use collections!" } }));
            return;
          }
          setIsCollectionsOpen(!isCollectionsOpen);
        }}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isCollectionsOpen 
            ? "bg-white/15 text-white border border-white/30" 
            : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
        }`}
        title="Add to Collection"
      >
        <FolderPlus className="w-5 h-5" />
      </button>

      {/* Collections Dropdown */}
      {isCollectionsOpen && (
        <div className="absolute top-full mt-2 left-0 sm:left-auto w-64 bg-[#141519] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="p-3 bg-white/5 border-b border-white/10">
            <h3 className="text-sm font-bold text-white">Save to Collection</h3>
          </div>
          <div className="max-h-60 overflow-y-auto p-2 space-y-1">
            {collections.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                You haven't created any collections yet.
              </div>
            ) : (
              collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => handleAddToCollection(col.id)}
                  disabled={savingCollectionId === col.id}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors text-left group"
                >
                  <span className="text-sm text-gray-300 group-hover:text-white truncate pr-2">
                    {col.name}
                  </span>
                  {savedCollectionId === col.id ? (
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  ) : savingCollectionId === col.id ? (
                    <div className="w-4 h-4 border-2 border-[#7047eb] border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                  ) : (
                    <Plus className="w-4 h-4 text-gray-500 group-hover:text-white flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
