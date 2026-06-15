import { Metadata } from "next";
import APKDownloadButton from "@/components/APKDownloadButton";
import { CheckCircle2, MonitorPlay, Smartphone, History, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Vortex for Android | Download the App",
  description: "Download the official Vortex app for Android. Experience seamless, ad-free streaming with our custom Media3 player.",
};

export default function AndroidPage() {
  const features = [
    {
      title: "Ad-Free Experience",
      description: "Enjoy your favorite movies and shows without any interruptions.",
      icon: <MonitorPlay className="w-6 h-6 text-vortex-purple" />
    },
    {
      title: "Stunning Design",
      description: "Experience a gorgeous, modern interface with smooth animations tailored perfectly for your device.",
      icon: <Smartphone className="w-6 h-6 text-vortex-purple" />
    },
    {
      title: "Watch History",
      description: "Automatically saves your progress so you can pick up exactly where you left off.",
      icon: <History className="w-6 h-6 text-vortex-purple" />
    },
    {
      title: "Lightning Fast",
      description: "Enjoy seamless, high-quality playback without annoying buffering or slowdowns.",
      icon: <Zap className="w-6 h-6 text-vortex-purple" />
    }
  ];

  return (
    <div className="min-h-screen bg-vortex-black text-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block p-4 rounded-full bg-vortex-purple/20 mb-6">
            <Smartphone className="w-12 h-12 text-vortex-purple" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            Experience Vortex on <span className="text-vortex-purple">Android</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Take your entertainment anywhere. Our custom Android app brings the full power of Vortex directly to your pocket with an immersive, native experience.
          </p>
          
          <div className="flex justify-center">
            <APKDownloadButton />
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-vortex-purple/50 transition-colors shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/10">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Requirements */}
        <div className="mt-24 text-center border-t border-white/10 pt-16">
          <h2 className="text-2xl font-bold mb-6">System Requirements</h2>
          <div className="flex justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>Android 8.0 (Oreo) or later</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>50MB Free Space</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
