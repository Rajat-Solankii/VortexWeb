import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 animate-pulse">
          <Image
            src="/loader-logo.jpg"
            alt="Loading Vortex..."
            fill
            sizes="(max-width: 768px) 112px, 128px"
            className="object-contain rounded-2xl shadow-[0_0_40px_rgba(124,77,255,0.4)]"
            priority
          />
        </div>
        <div className="flex space-x-2 items-center">
          <div className="w-2.5 h-2.5 bg-vortex-purple rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2.5 h-2.5 bg-vortex-purple rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2.5 h-2.5 bg-vortex-purple rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
