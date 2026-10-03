"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
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
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndState = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("bookmarks")
          .select("id")
          .eq("user_id", user.id)
          .eq("media_id", mediaId.toString())
          .eq("media_type", mediaType)
          .maybeSingle();

        if (data) {
          setIsBookmarked(true);
        }
      }
      setLoading(false);
    };

    fetchUserAndState();
  }, [mediaId, mediaType, supabase]);

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
      const { error } = await supabase
        .from("bookmarks")
        .insert({
          user_id: user.id,
          media_id: mediaId.toString(),
          media_type: mediaType,
          title: title,
          poster_path: posterPath,
        });

      if (error) {
        console.error("Error adding bookmark:", error);
        setIsBookmarked(false); // Revert
      }
    } else {
      // Delete bookmark
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("media_id", mediaId.toString())
        .eq("media_type", mediaType);

      if (error) {
        console.error("Error removing bookmark:", error);
        setIsBookmarked(true); // Revert
      }
    }
  };

  if (loading) {
    return (
      <div className="flex gap-3 mt-4">
        <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={toggleAction}
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
