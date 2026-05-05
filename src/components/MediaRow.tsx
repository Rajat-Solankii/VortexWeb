"use client";
import { TMDBItem } from "@/lib/tmdb";
import MediaCard from "./MediaCard";
import { useRef, useState, useEffect } from "react";

export default function MediaRow({ 
  title, 
  items, 
  action,
  onRemove
}: { 
  title: string; 
  items: TMDBItem[]; 
  action?: React.ReactNode;
  onRemove?: (id: number) => void;
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
        {action}
      </div>
      
      <div className="relative px-4 sm:px-6 lg:px-10 xl:px-16">
        {/* Left Arrow */}
        <button 
          onClick={() => scroll("left")}
          className={`absolute left-4 sm:left-6 lg:left-10 xl:left-16 top-0 bottom-4 w-12 sm:w-16 z-40 bg-black/50 hover:bg-black/80 items-center justify-center text-white transition-all opacity-0 group-hover/row:opacity-100 hidden ${isMoved ? 'md:flex' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Scroll Container (Strict Wrapper) */}
        <div 
          ref={rowRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-4 scrollbar-hide snap-x relative z-10"
        >
          {items.map((item) => (
            <div key={item.id} className="snap-start">
               <MediaCard item={item} onRemove={onRemove} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button 
          onClick={() => scroll("right")}
          className="absolute right-4 sm:right-6 lg:right-10 xl:right-16 top-0 bottom-4 w-12 sm:w-16 z-40 bg-black/50 hover:bg-black/80 items-center justify-center text-white transition-all opacity-0 group-hover/row:opacity-100 hidden md:flex"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
