import Link from "next/link";
import { Download } from "lucide-react";

export default function DownloadAppButton() {
  return (
    <Link 
      href="/android" 
      className="flex items-center gap-2 bg-vortex-purple hover:bg-vortex-blue text-white text-sm font-semibold py-2 px-4 rounded-full transition-all drop-shadow-[0_0_10px_rgba(124,77,255,0.4)] hover:drop-shadow-[0_0_15px_rgba(0,176,255,0.6)]"
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Download App</span>
    </Link>
  );
}
