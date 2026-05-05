"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()}
      className="group flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all active:scale-95"
      title="Go Back"
    >
      <ArrowLeft className="h-4 w-4 text-vortex-purple transition-transform group-hover:-translate-x-1" />
      <span className="text-xs font-bold text-gray-300 group-hover:text-white uppercase tracking-wider">Back</span>
    </button>
  );
}
