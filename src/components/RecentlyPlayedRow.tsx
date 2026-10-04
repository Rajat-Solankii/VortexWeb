"use client";
import { useEffect, useState } from "react";
import MediaRow from "./MediaRow";
import { HistoryItem } from "./HistoryTracker";
import { useSession } from "next-auth/react";

export default function RecentlyPlayedRow() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: session } = useSession();

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

        // Try to fetch from Custom API
        if (session?.user) {
          const res = await fetch("/api/history");
          if (res.ok) {
            const data = await res.json();
            if (data.history && data.history.length > 0) {
              setHistory(data.history);
              localStorage.setItem("vortex_history", JSON.stringify(data.history));
            }
          }
        }
      } catch (error) {
        console.error("Failed to load history", error);
      }
    };
    
    loadHistory();
  }, [session]);

  const syncToCloud = async (newHistory: HistoryItem[]) => {
    if (session?.user) {
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: newHistory })
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
