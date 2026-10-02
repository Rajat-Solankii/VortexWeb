"use client";

import { useState } from "react";

export default function ProviderImage({ logo, name }: { logo: string | null; name: string }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {logo && !hasError && (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={`https://image.tmdb.org/t/p/w154${logo}`} 
          alt={name} 
          className="w-full h-full object-contain rounded-lg md:rounded-xl z-10"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      )}
      <div className={`absolute inset-0 flex items-center justify-center p-2 text-center text-xs font-bold text-white ${(logo && !hasError) ? 'hidden' : ''}`}>
        {name}
      </div>
    </div>
  );
}
