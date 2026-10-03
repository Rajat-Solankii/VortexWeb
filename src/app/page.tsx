"use client";

import Link from "next/link";
import { Zap, Globe, Smartphone, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LandingPage() {
  const router = useRouter();
  
  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/home");
      }
    };
    checkUser();
  }, [router]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07090e] text-[#f8fafc] font-sans -mt-16">
      {/* Glow Background */}
      <div 
        className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(112, 71, 235, 0.18) 0%, rgba(7, 9, 14, 0) 70%)"
        }}
      ></div>

      {/* Hero Section */}
      <header className="text-center pt-16 pb-16 px-6 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block px-4 py-1.5 rounded-full bg-[#7047eb]/15 border border-[#7047eb]/30 text-[#a78bfa] text-sm font-bold mb-6 tracking-wide"
        >
          Next-Gen Streaming Hub
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-5"
        >
          Everything You Stream, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-[#a78bfa]">
            All In One Universe.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-[#94a3b8] mb-10 leading-relaxed max-w-2xl mx-auto"
        >
          Vortex aggregates movies, shows, anime, and global television right into a clean, unified experience. Discover trending titles, check providers, and watch without friction.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            href="/home" 
            className="flex items-center gap-2 px-8 py-3.5 bg-[#7047eb] hover:bg-[#5d35d9] hover:-translate-y-0.5 text-white font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(112,71,235,0.4)] hover:shadow-[0_6px_24px_rgba(112,71,235,0.6)]"
          >
            <Play className="w-5 h-5 fill-current" />
            Start Watching Now
          </Link>
          <a 
            href="#about" 
            className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all"
          >
            Learn More
          </a>
        </motion.div>
      </header>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto py-24 px-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1 h-6 bg-[#06b6d4] rounded-sm"></div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Why Stream with Vortex?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-[#7047eb]/40 p-8 rounded-2xl transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#7047eb]/15 flex items-center justify-center text-[#b794f6] mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Unified Provider Discovery</h3>
            <p className="text-[#94a3b8] leading-relaxed">
              No more jumping between platforms. Browse unified availability from Netflix, Prime Video, Apple TV, Disney+, and more directly from a single catalog.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-[#7047eb]/40 p-8 rounded-2xl transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#7047eb]/15 flex items-center justify-center text-[#b794f6] mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Global Entertainment Library</h3>
            <p className="text-[#94a3b8] leading-relaxed">
              From mainstream Hollywood blockbusters and Bollywood hits to trending Anime series and regional dramas—curated without borders.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-[#7047eb]/40 p-8 rounded-2xl transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#7047eb]/15 flex items-center justify-center text-[#b794f6] mb-6 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Cross-Device Sync</h3>
            <p className="text-[#94a3b8] leading-relaxed">
              Seamlessly continue what you started. Whether via the web interface or dedicated mobile app, your library and progress remain perfectly synced.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="catalog" className="max-w-7xl mx-auto py-16 px-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-[#06b6d4] rounded-sm"></div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Explore by Category</h2>
        </div>
        <p className="text-[#94a3b8] mb-6 text-lg">Jump into your preferred genre instantly:</p>
        
        <div className="flex flex-wrap gap-3">
          {[
            { name: 'Anime', href: '/anime' },
            { name: 'Bollywood', href: '/bollywood' },
            { name: 'Cartoons', href: '/cartoons' },
            { name: 'Drama', href: '/drama' },
            { name: 'Hollywood', href: '/hollywood' },
            { name: 'Movies', href: '/movies' },
            { name: 'TV Shows', href: '/tv' },
          ].map((tag, i) => (
            <Link 
              key={tag.name}
              href={tag.href}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-[#94a3b8] hover:text-white font-medium text-sm transition-all"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </section>
      
      {/* The global footer handles the footer content */}
    </div>
  );
}
