"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  alt: string;
  fallbackCode?: string;
};

const THUMB_SLOTS = 3;

export function ProductGallery({ images, alt, fallbackCode }: Props) {
  const [page, setPage] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const openAt = (i: number) => setLightbox(i);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const showPrevInLightbox = useCallback(() => {
    setLightbox((v) => (v === null ? v : (v - 1 + images.length) % images.length));
  }, [images.length]);
  const showNextInLightbox = useCallback(() => {
    setLightbox((v) => (v === null ? v : (v + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showPrevInLightbox();
      else if (e.key === "ArrowRight") showNextInLightbox();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox, closeLightbox, showPrevInLightbox, showNextInLightbox]);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 grid place-items-center">
        <span className="font-display font-bold text-6xl text-brand-300">
          {fallbackCode ?? ""}
        </span>
      </div>
    );
  }

  const renderTile = (
    src: string,
    idx: number,
    ratio: string,
    priority: boolean,
    overlay?: React.ReactNode,
  ) => (
    <button
      type="button"
      onClick={() => openAt(idx)}
      className={cn(
        "group relative w-full rounded-2xl overflow-hidden bg-white ring-1 ring-brand-100 cursor-zoom-in",
        ratio,
      )}
      aria-label={`${alt} — büyüt`}
    >
      <Image
        key={src}
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 600px, 100vw"
        className="object-contain p-4 md:p-6 transition group-hover:scale-[1.02]"
        priority={priority}
        unoptimized
      />
      {overlay}
    </button>
  );

  if (images.length === 1) {
    return (
      <>
        {renderTile(images[0], 0, "aspect-[4/3]", true)}
        {lightbox !== null && (
          <Lightbox
            images={images}
            index={lightbox}
            alt={alt}
            onClose={closeLightbox}
            onPrev={showPrevInLightbox}
            onNext={showNextInLightbox}
          />
        )}
      </>
    );
  }

  const pageCount = Math.ceil(images.length / 2);
  const p = Math.min(page, pageCount - 1);
  const leftIdx = p * 2;
  const rightIdx = leftIdx + 1;
  const left = images[leftIdx];
  const rightExists = rightIdx < images.length;
  const right = rightExists ? images[rightIdx] : images[0];
  const rightIdxForLightbox = rightExists ? rightIdx : 0;
  const hasCarousel = images.length > 2;

  const prev = () => setPage((v) => Math.max(0, v - 1));
  const next = () => setPage((v) => Math.min(pageCount - 1, v + 1));

  const thumbs = images.slice(0, THUMB_SLOTS);
  const overflow = Math.max(0, images.length - THUMB_SLOTS);

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {renderTile(
          left,
          leftIdx,
          "aspect-square",
          true,
          hasCarousel && (
            <div
              className="absolute left-4 bottom-4 flex items-center rounded-full bg-white/95 shadow-md ring-1 ring-brand-100"
              onClick={stop}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                disabled={p === 0}
                aria-label="Önceki"
                className="grid place-items-center h-10 w-11 rounded-l-full text-brand-800 hover:bg-brand-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="w-px h-5 bg-brand-100" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                disabled={p === pageCount - 1}
                aria-label="Sonraki"
                className="grid place-items-center h-10 w-11 rounded-r-full text-brand-800 hover:bg-brand-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ),
        )}

        {renderTile(
          right,
          rightIdxForLightbox,
          "aspect-square",
          false,
          hasCarousel && (
            <div className="absolute right-4 bottom-4 flex items-center gap-2" onClick={stop}>
              {thumbs.map((url, i) => {
                const isActive = i === leftIdx || i === rightIdx;
                const isLastSlot = i === THUMB_SLOTS - 1;
                const showOverflow = isLastSlot && overflow > 0;
                return (
                  <button
                    key={`${url}-${i}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPage(Math.floor(i / 2));
                    }}
                    aria-label={`Görsel ${i + 1}`}
                    className={cn(
                      "relative h-14 w-20 rounded-md overflow-hidden bg-white ring-1 transition",
                      isActive ? "ring-2 ring-white shadow-lg" : "ring-black/10 hover:ring-black/30",
                    )}
                  >
                    <Image
                      src={url}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized
                    />
                    {showOverflow && (
                      <span className="absolute inset-0 grid place-items-center bg-black/60 text-white text-xs font-semibold">
                        +{overflow}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ),
        )}
      </div>

      {lightbox !== null && (
        <Lightbox
          images={images}
          index={lightbox}
          alt={alt}
          onClose={closeLightbox}
          onPrev={showPrevInLightbox}
          onNext={showNextInLightbox}
        />
      )}
    </>
  );
}

function Lightbox({
  images,
  index,
  alt,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  index: number;
  alt: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const src = images[index];
  const multi = images.length > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Kapat"
        className="absolute top-4 right-4 grid place-items-center h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
      >
        <X className="h-5 w-5" />
      </button>

      {multi && (
        <span className="absolute top-5 left-5 text-xs font-medium text-white/80 rounded-full bg-white/10 px-3 py-1.5">
          {index + 1} / {images.length}
        </span>
      )}

      {multi && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Önceki"
            className="absolute left-4 md:left-8 grid place-items-center h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Sonraki"
            className="absolute right-4 md:right-8 grid place-items-center h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div
        className="relative w-[92vw] h-[86vh] md:w-[85vw] md:h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          sizes="90vw"
          className="object-contain"
          priority
          unoptimized
        />
      </div>
    </div>
  );
}
