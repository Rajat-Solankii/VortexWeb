import { UserX } from "lucide-react";
import Link from "next/link";

export default function DeletedScreen() {
  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/80 to-transparent"></div>
      
      <div className="relative z-10 max-w-lg w-full bg-white/[0.02] border border-red-500/10 rounded-3xl p-8 sm:p-12 backdrop-blur-2xl text-center shadow-[0_0_100px_rgba(239,68,68,0.1)]">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <UserX className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-black text-white mb-4 tracking-tight">Account Deleted</h1>
        
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-5 mb-8">
          <p className="text-red-200 text-sm leading-relaxed">
            Your account and all associated data have been permanently deleted by an administrator.
          </p>
        </div>
        
        <Link 
          href="/" 
          className="inline-flex w-full items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 px-6 rounded-xl transition-all border border-white/10"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
