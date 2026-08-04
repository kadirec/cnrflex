"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  alt: string;
  fallbackCode?: string;
};

const THUMB_SLOTS = 3;

export function ProductGallery({ images, alt, fallbackCode }: Props) {
  const [page, setPage] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 grid place-items-center">
        <span className="font-display font-bold text-6xl text-brand-300">
          {fallbackCode ?? ""}
        </span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white ring-1 ring-brand-100">
        <Image
          src={images[0]}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 1200px, 100vw"
          className="object-contain p-4 md:p-6"
          priority
          unoptimized
        />
      </div>
    );
  }

  const pageCount = Math.ceil(images.length / 2);
  const p = Math.min(page, pageCount - 1);
  const leftIdx = p * 2;
  const rightIdx = leftIdx + 1;
  const left = images[leftIdx];
  const right = images[rightIdx] ?? images[0];
  const hasCarousel = images.length > 2;

  const prev = () => setPage((v) => Math.max(0, v - 1));
  const next = () => setPage((v) => Math.min(pageCount - 1, v + 1));

  const thumbs = images.slice(0, THUMB_SLOTS);
  const overflow = Math.max(0, images.length - THUMB_SLOTS);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white ring-1 ring-brand-100">
        <Image
          key={left}
          src={left}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 600px, 100vw"
          className="object-contain p-4 md:p-6"
          priority
          unoptimized
        />
        {hasCarousel && (
          <div className="absolute left-4 bottom-4 flex items-center rounded-full bg-white/95 shadow-md ring-1 ring-brand-100">
            <button
              type="button"
              onClick={prev}
              disabled={p === 0}
              aria-label="Önceki"
              className="grid place-items-center h-10 w-11 rounded-l-full text-brand-800 hover:bg-brand-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="w-px h-5 bg-brand-100" />
            <button
              type="button"
              onClick={next}
              disabled={p === pageCount - 1}
              aria-label="Sonraki"
              className="grid place-items-center h-10 w-11 rounded-r-full text-brand-800 hover:bg-brand-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white ring-1 ring-brand-100">
        <Image
          key={right}
          src={right}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 600px, 100vw"
          className="object-contain p-4 md:p-6"
          unoptimized
        />
        {hasCarousel && (
          <div className="absolute right-4 bottom-4 flex items-center gap-2">
            {thumbs.map((url, i) => {
              const isActive = i === leftIdx || i === rightIdx;
              const isLastSlot = i === THUMB_SLOTS - 1;
              const showOverflow = isLastSlot && overflow > 0;
              return (
                <button
                  key={`${url}-${i}`}
                  type="button"
                  onClick={() => setPage(Math.floor(i / 2))}
                  aria-label={`Görsel ${i + 1}`}
                  className={cn(
                    "relative h-14 w-20 rounded-md overflow-hidden bg-white ring-1 transition",
                    isActive ? "ring-2 ring-white shadow-lg" : "ring-black/10 hover:ring-black/30",
                  )}
                >
                  <Image src={url} alt="" fill sizes="80px" className="object-cover" unoptimized />
                  {showOverflow && (
                    <span className="absolute inset-0 grid place-items-center bg-black/60 text-white text-xs font-semibold">
                      +{overflow}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
