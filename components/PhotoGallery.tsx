"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type Photo = { url: string; alt: string | null };

type PhotoGalleryProps = {
  photos: Photo[];
  fallbackAlt: string;
};

export default function PhotoGallery({ photos, fallbackAlt }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  if (photos.length === 0) {
    photos = [{ url: "/images/placeholder-style.svg", alt: fallbackAlt }];
  }

  function handleScroll() {
    const container = containerRef.current;
    if (!container) return;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    setActiveIndex(index);
  }

  return (
    <div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth border border-line"
      >
        {photos.map((photo, index) => (
          <div key={`${photo.url}-${index}`} className="relative aspect-[4/3] w-full shrink-0 snap-center bg-ink">
            <Image
              src={photo.url}
              alt={photo.alt ?? fallbackAlt}
              fill
              className="object-cover"
              sizes="100vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      {photos.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
          {photos.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 w-1.5 rounded-full transition ${
                index === activeIndex ? "bg-clay" : "bg-line"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
