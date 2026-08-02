"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RollIcon } from "@/components/product/roll-icon";
import type { Locale } from "@/lib/site";

type Product = {
  code: string;
  name: string;
  image: string | null;
  categoryName: string;
  rollLength: number;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: Product | null;
  locale: Locale;
  onConfirm: (count: number) => void;
};

export function RollCountDialog({ open, onOpenChange, product, locale, onConfirm }: Props) {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (open) setCount(1);
  }, [open]);

  if (!product) return null;

  const adjust = (delta: number) => setCount((c) => Math.max(1, Math.min(999, c + delta)));
  const total = product.rollLength * count;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {locale === "tr" ? "Kaç top?" : "How many rolls?"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-3 items-center rounded-lg border border-brand-100 bg-brand-50/60 p-3">
          <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-white ring-1 ring-brand-100">
            {product.image ? (
              <Image src={product.image} alt={product.name} fill sizes="64px" className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full grid place-items-center text-[10px] text-brand-400 font-mono">
                {product.code}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-accent-600 truncate">
              {product.categoryName}
            </div>
            <div className="text-sm font-semibold text-brand-950 truncate">{product.name}</div>
            <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-brand-700">
              <RollIcon className="w-3.5 h-3.5 text-accent-600" />
              {locale === "tr" ? "Top Sarımı" : "Roll"} : {product.rollLength} MT
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-brand-800">
            {locale === "tr" ? "Top adedi" : "Roll count"}
          </label>
          <div className="flex items-stretch gap-2">
            <button
              type="button"
              onClick={() => adjust(-1)}
              disabled={count <= 1}
              className="w-10 rounded-md border border-brand-200 text-brand-700 hover:border-accent-500 hover:text-accent-600 disabled:opacity-40 disabled:pointer-events-none grid place-items-center"
              aria-label="-"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min={1}
              max={999}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(999, Number(e.target.value) || 1)))}
              className="flex-1 rounded-md border border-brand-200 px-3 py-2 text-center text-lg font-semibold text-brand-950 focus:border-accent-500 focus:ring-3 focus:ring-accent-500/15 outline-none"
            />
            <button
              type="button"
              onClick={() => adjust(1)}
              className="w-10 rounded-md border border-brand-200 text-brand-700 hover:border-accent-500 hover:text-accent-600 grid place-items-center"
              aria-label="+"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="rounded-md bg-accent-50 border border-accent-200 px-3.5 py-2.5 text-center">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-accent-700">
              {locale === "tr" ? "Toplam" : "Total"}
            </div>
            <div className="text-xl font-bold text-accent-700">
              {count} × {product.rollLength} MT = {total} MT
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            {locale === "tr" ? "İptal" : "Cancel"}
          </Button>
          <Button
            type="button"
            onClick={() => onConfirm(count)}
            className="gap-2 bg-accent-500 hover:bg-accent-600"
          >
            <ShoppingCart className="w-4 h-4" />
            {locale === "tr" ? "Teklif Listesine Ekle" : "Add to Quote List"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function buildRollQuantity(count: number, length: number, locale: Locale): string {
  if (!count || !length) return "";
  const unit = locale === "tr" ? "MT" : "M";
  const roll = locale === "tr" ? "top" : "roll";
  return `${count} ${roll} × ${length} ${unit} = ${count * length} ${unit}`;
}
