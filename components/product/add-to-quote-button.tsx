"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ArrowRight, Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { useQuoteCart } from "@/components/cart/QuoteCartContext";
import { RollIcon } from "@/components/product/roll-icon";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/site";

type Props = {
  locale: Locale;
  productId: number;
  code: string;
  name: string;
  image: string | null;
  slug: string;
  categoryName: string;
  categorySlug: string;
  rollLength: number | null;
  label: string;
};

export function AddToQuoteButton({
  locale,
  productId,
  code,
  name,
  image,
  slug,
  categoryName,
  categorySlug,
  rollLength,
  label,
}: Props) {
  const router = useRouter();
  const { add, isInCart, hydrated } = useQuoteCart();
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [rollCount, setRollCount] = useState(1);
  const inCart = hydrated && isInCart(productId);

  const commit = (count: number | null) => {
    const quantity =
      rollLength && count
        ? locale === "tr"
          ? `${count} top × ${rollLength} MT = ${count * rollLength} MT`
          : `${count} roll × ${rollLength} M = ${count * rollLength} M`
        : "";
    add({
      productId,
      code,
      name,
      image,
      slug,
      categoryName,
      categorySlug,
      quantity,
      note: "",
      rollLength: rollLength ?? null,
      rollCount: count ?? null,
    });
    toast.success(
      locale === "tr" ? "Teklif listesine eklendi" : "Added to quote list",
    );
    setOpen(false);
  };

  const onClick = () => {
    if (inCart) {
      startTransition(() => router.push(`/${locale}/teklif-al`));
      return;
    }
    if (rollLength) {
      setRollCount(1);
      setOpen(true);
    } else {
      commit(null);
    }
  };

  const totalMeters = rollLength ? rollLength * rollCount : 0;
  const adjust = (delta: number) =>
    setRollCount((c) => Math.max(1, Math.min(999, c + delta)));

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group inline-flex items-center gap-2 rounded-md px-6 py-3 text-base font-semibold text-white shadow-lg transition",
          inCart
            ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
            : "bg-accent-500 hover:bg-accent-600 shadow-accent-500/30",
        )}
      >
        {inCart ? (
          <>
            <Check className="h-4 w-4" />
            {locale === "tr" ? "Listede · Listeyi Gör" : "In List · View"}
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            {label}
          </>
        )}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {locale === "tr" ? "Kaç top?" : "How many rolls?"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex gap-3 items-center rounded-lg border border-brand-100 bg-brand-50/60 p-3">
            <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-white ring-1 ring-brand-100">
              {image ? (
                <Image src={image} alt={name} fill sizes="64px" className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full grid place-items-center text-[10px] text-brand-400 font-mono">
                  {code}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-accent-600 truncate">
                {categoryName}
              </div>
              <div className="text-sm font-semibold text-brand-950 truncate">{name}</div>
              <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-brand-700">
                <RollIcon className="w-3.5 h-3.5 text-accent-600" />
                {locale === "tr" ? "Top Sarımı" : "Roll"} : {rollLength} MT
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
                disabled={rollCount <= 1}
                className="w-10 rounded-md border border-brand-200 text-brand-700 hover:border-accent-500 hover:text-accent-600 disabled:opacity-40 disabled:pointer-events-none grid place-items-center"
                aria-label="-"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min={1}
                max={999}
                value={rollCount}
                onChange={(e) => setRollCount(Math.max(1, Math.min(999, Number(e.target.value) || 1)))}
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
                {rollCount} × {rollLength} MT = {totalMeters} MT
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              {locale === "tr" ? "İptal" : "Cancel"}
            </Button>
            <Button
              type="button"
              onClick={() => commit(rollCount)}
              className="gap-2 bg-accent-500 hover:bg-accent-600"
            >
              <ShoppingCart className="w-4 h-4" />
              {locale === "tr" ? "Teklif Listesine Ekle" : "Add to Quote List"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
