"use client";
import { useEffect, useState } from "react";
import MediaRow from "./MediaRow";
import { HistoryItem } from "./HistoryTracker";
import { createClient } from "@/utils/supabase/client";

export default function RecentlyPlayedRow() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    setIsClient(true);
    const loadHistory = async () => {
      try {
        let localHistory: HistoryItem[] = [];
        const historyJson = localStorage.getItem("vortex_history");
        if (historyJson) {
          localHistory = JSON.parse(historyJson);
          setHistory(localHistory);
        }

        // Try to fetch from Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("user_profiles")
            .select("watch_history")
            .eq("user_id", user.id)
            .single();
            
          if (data && data.watch_history) {
            // If cloud history has more items or is newer (we just assume cloud wins for now)
            // But realistically we should merge them based on timestamp. For simplicity, we just use cloud if it exists and has items
            const cloudHistory = data.watch_history as HistoryItem[];
            if (cloudHistory.length > 0) {
              setHistory(cloudHistory);
              localStorage.setItem("vortex_history", JSON.stringify(cloudHistory));
            }
          }
        }
      } catch (error) {
        console.error("Failed to load history", error);
      }
    };
    
    loadHistory();
  }, []);

  const syncToCloud = async (newHistory: HistoryItem[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("user_profiles")
        .upsert({ 
          user_id: user.id, 
          watch_history: newHistory,
          updated_at: new Date().toISOString()
        });
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("vortex_history");
    setHistory([]);
    setShowConfirm(false);
    syncToCloud([]);
  };

  const removeItem = (id: number) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem("vortex_history", JSON.stringify(updatedHistory));
    syncToCloud(updatedHistory);
  };

  if (!isClient || history.length === 0) return null;

  return (
    <>
      <MediaRow 
        title="Continue Watching" 
        items={history} 
        onRemove={removeItem}
        action={
          <div className="flex items-center space-x-3">
            {showConfirm ? (
              <div className="flex items-center space-x-3 animate-in fade-in slide-in-from-right-2 duration-300">
                <button 
                  onClick={clearHistory}
                  className="text-[10px] md:text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-widest"
                >
                  Confirm Clear
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="text-[10px] md:text-xs text-white/40 hover:text-white font-bold uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowConfirm(true)}
                className="text-xs md:text-sm text-white/40 hover:text-red-500 transition-colors uppercase tracking-widest font-bold"
              >
                Clear
              </button>
            )}
          </div>
        }
      />
    </>
  );
}
