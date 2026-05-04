"use client";
import { useEffect, useState } from "react";
import MediaRow from "./MediaRow";
import { HistoryItem } from "./HistoryTracker";

export default function RecentlyPlayedRow() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const historyJson = localStorage.getItem("vortex_history");
      if (historyJson) {
        setHistory(JSON.parse(historyJson));
      }
    } catch (error) {
      console.error("Failed to load history", error);
    }
  }, []);

  if (!isClient || history.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-vortex-purple/10 to-transparent">
      <MediaRow title="Continue Watching" items={history} />
    </div>
  );
}
