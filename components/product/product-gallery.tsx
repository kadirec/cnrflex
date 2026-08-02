"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  alt: string;
  fallbackCode?: string;
};

export function ProductGallery({ images, alt, fallbackCode }: Props) {
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;

  if (!hasImages) {
    return (
      <div className="aspect-square rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 grid place-items-center">
        <span className="font-display font-bold text-5xl text-brand-300">
          {fallbackCode ?? ""}
        </span>
      </div>
    );
  }

  const current = images[Math.min(active, images.length - 1)];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white ring-1 ring-brand-100">
        <Image
          src={current}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {images.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Görsel ${i + 1}`}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden bg-white ring-1 transition",
                i === active
                  ? "ring-2 ring-accent-500"
                  : "ring-brand-100 hover:ring-brand-300",
              )}
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
