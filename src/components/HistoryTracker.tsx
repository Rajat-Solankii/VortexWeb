"use client";
import { useEffect } from "react";
import { TMDBItem } from "@/lib/tmdb";
import { useSession } from "next-auth/react";

export interface HistoryItem extends TMDBItem {
  timestamp: number;
  season?: number;
  episode?: number;
}

export default function HistoryTracker({ item, season, episode }: { item: TMDBItem; season?: number; episode?: number }) {
  const { data: session } = useSession();

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

        // Sync to custom API
        if (session?.user) {
          await fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ history })
          });
        }
      } catch (error) {
        console.error("Failed to save to history", error);
      }
    };

    const timeoutId = setTimeout(() => {
      saveHistory();
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [item.id, season, episode, session, item]);

  return null;
}
