"use client";
import { useEffect } from "react";
import { TMDBItem } from "@/lib/tmdb";

export interface HistoryItem extends TMDBItem {
  timestamp: number;
  season?: number;
  episode?: number;
}

export default function HistoryTracker({ item, season, episode }: { item: TMDBItem; season?: number; episode?: number }) {
  useEffect(() => {
    try {
      const historyJson = localStorage.getItem("vortex_history");
      let history: HistoryItem[] = historyJson ? JSON.parse(historyJson) : [];
      
      // Remove the item if it already exists to move it to the front
      history = history.filter((h) => h.id !== item.id);
      
      const newItem: HistoryItem = {
        ...item,
        timestamp: Date.now(),
        ...(season !== undefined && { season }),
        ...(episode !== undefined && { episode })
      };
      
      history.unshift(newItem);
      
      // Keep only the top 20 items
      if (history.length > 20) {
        history = history.slice(0, 20);
      }
      
      localStorage.setItem("vortex_history", JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save to history", error);
    }
    // Only re-run if the ID or episode changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, season, episode]);

  return null;
}
