"use client";
import { useEffect } from "react";
import { TMDBItem } from "@/lib/tmdb";
import { createClient } from "@/utils/supabase/client";

export interface HistoryItem extends TMDBItem {
  timestamp: number;
  season?: number;
  episode?: number;
}

export default function HistoryTracker({ item, season, episode }: { item: TMDBItem; season?: number; episode?: number }) {
  const supabase = createClient();

  useEffect(() => {
    const saveHistory = async () => {
      try {
        const historyJson = localStorage.getItem("vortex_history");
        let history: HistoryItem[] = historyJson ? JSON.parse(historyJson) : [];
        
        history = history.filter((h) => h.id !== item.id);
        
        const newItem: HistoryItem = {
          ...item,
          timestamp: Date.now(),
          ...(season !== undefined && { season }),
          ...(episode !== undefined && { episode })
        };
        
        history.unshift(newItem);
        
        if (history.length > 20) {
          history = history.slice(0, 20);
        }
        
        localStorage.setItem("vortex_history", JSON.stringify(history));

        // Sync to Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from("user_profiles")
            .upsert({ 
              user_id: user.id, 
              watch_history: history,
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
            
          if (error) {
            console.error("Failed to sync history to Supabase:", error);
          } else {
            console.log("Successfully synced history to Supabase");
          }
        }
      } catch (error) {
        console.error("Failed to save to history", error);
      }
    };

    // Use a small timeout to ensure localStorage has time to settle
    const timeoutId = setTimeout(() => {
      saveHistory();
    }, 1000);
    
    return () => clearTimeout(timeoutId);
    // Only re-run if the ID or episode changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, season, episode]);

  return null;
}
