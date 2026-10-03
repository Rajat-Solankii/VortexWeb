"use client";
import { TMDBItem } from "@/lib/tmdb";
import MediaCard from "./MediaCard";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

export default function MediaRow({ 
  title, 
  items, 
  action,
  onRemove,
  viewAllLink
}: { 
  title: string; 
  items: TMDBItem[]; 
  action?: React.ReactNode;
  onRemove?: (id: number) => void;
  viewAllLink?: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  // Check if we have scrolled from the start
  const handleScroll = () => {
    if (rowRef.current) {
      setIsMoved(rowRef.current.scrollLeft > 0);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!items || items.length === 0) return null;
  
  return (
    <div className="py-6 md:py-8 group/row relative">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-16 mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide flex items-center space-x-3">
            <span className="w-1.5 h-6 bg-vortex-blue rounded-full drop-shadow-[0_0_5px_rgba(0,176,255,0.8)]"></span>
            <span>{title}</span>
        </h2>
        
        <div className="flex items-center space-x-4">
          {action}
          {viewAllLink && (
            <Link href={viewAllLink} className="text-sm md:text-base font-medium text-vortex-purple hover:text-white transition-colors">
              View All
            </Link>
          )}
          <div className="hidden md:flex items-center space-x-2">
            <button 
              onClick={() => scroll("left")}
              className={`w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all border border-white/5 ${isMoved ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!isMoved}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all border border-white/5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="relative">
        {/* Scroll Container (Strict Wrapper) */}
        <div 
          ref={rowRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-4 scrollbar-hide snap-x relative z-10"
        >
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className={`snap-start shrink-0 ${index === 0 ? "pl-4 sm:pl-6 lg:pl-10 xl:pl-16" : ""} ${index === items.length - 1 ? "pr-4 sm:pr-6 lg:pr-10 xl:pr-16" : ""}`}
            >
               <div className="w-[140px] md:w-[180px]">
                 <MediaCard item={item} onRemove={onRemove} />
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
