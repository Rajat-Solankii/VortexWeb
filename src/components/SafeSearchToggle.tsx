"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Shield, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SafeSearchToggle() {
  const [isSafe, setIsSafe] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Default to true if not set
    const safeSearchCookie = Cookies.get("safeSearch");
    if (safeSearchCookie === "false") {
      setIsSafe(false);
    }
  }, []);

  const toggleSafeSearch = () => {
    const newValue = !isSafe;
    setIsSafe(newValue);
    Cookies.set("safeSearch", newValue.toString(), { expires: 365 });
    // Refresh the router so server components pick up the new cookie
    router.refresh();
  };

  return (
    <button 
      onClick={toggleSafeSearch}
      className={`flex items-center gap-2 text-sm font-medium transition-all px-3 py-1.5 rounded-full border ${
        isSafe 
          ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20" 
          : "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
      }`}
      title={isSafe ? "Safe Search is ON" : "Safe Search is OFF"}
    >
      {isSafe ? <Shield className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
      <span className="hidden lg:inline">{isSafe ? "Safe Search" : "Unfiltered"}</span>
    </button>
  );
}
