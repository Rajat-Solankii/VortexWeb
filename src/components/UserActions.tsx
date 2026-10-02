"use client";

import { useState, useEffect } from "react";
import { Heart, Bookmark } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface UserActionsProps {
  mediaId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath?: string;
}

export default function UserActions({ mediaId, mediaType, title, posterPath }: UserActionsProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndState = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("user_interactions")
          .select("is_liked, is_bookmarked")
          .eq("user_id", user.id)
          .eq("media_id", mediaId)
          .eq("media_type", mediaType)
          .single();

        if (data) {
          setIsLiked(data.is_liked);
          setIsBookmarked(data.is_bookmarked);
        }
      }
      setLoading(false);
    };

    fetchUserAndState();
  }, [mediaId, mediaType, supabase]);

  const toggleAction = async (action: "like" | "bookmark") => {
    if (!user) {
      window.dispatchEvent(
        new CustomEvent("open-auth-modal", {
          detail: { message: "Please sign in to save your favorites!" },
        })
      );
      return;
    }

    const newLikedState = action === "like" ? !isLiked : isLiked;
    const newBookmarkedState = action === "bookmark" ? !isBookmarked : isBookmarked;

    // Optimistic UI update
    if (action === "like") setIsLiked(newLikedState);
    if (action === "bookmark") setIsBookmarked(newBookmarkedState);

    const { error } = await supabase
      .from("user_interactions")
      .upsert(
        {
          user_id: user.id,
          media_id: mediaId,
          media_type: mediaType,
          title: title,
          poster_path: posterPath,
          is_liked: newLikedState,
          is_bookmarked: newBookmarkedState,
        },
        { onConflict: 'user_id,media_id,media_type' }
      );

    if (error) {
      console.error("Error updating interaction:", error);
      // Revert on error
      if (action === "like") setIsLiked(!newLikedState);
      if (action === "bookmark") setIsBookmarked(!newBookmarkedState);
    }
  };

  if (loading) {
    return (
      <div className="flex gap-3 mt-4">
        <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
        <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={() => toggleAction("like")}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isLiked 
            ? "bg-red-500/20 text-red-500 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
            : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
        }`}
        title={isLiked ? "Unlike" : "Like"}
      >
        <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
      </button>

      <button
        onClick={() => toggleAction("bookmark")}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isBookmarked 
            ? "bg-vortex-purple/20 text-vortex-purple border border-vortex-purple/50 shadow-[0_0_15px_rgba(124,77,255,0.3)]" 
            : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
        }`}
        title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
      >
        <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
      </button>
    </div>
  );
}
