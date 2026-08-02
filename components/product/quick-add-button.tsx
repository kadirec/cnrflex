"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Plus } from "lucide-react";
import { useQuoteCart } from "@/components/cart/QuoteCartContext";
import { RollCountDialog, buildRollQuantity } from "@/components/product/roll-count-dialog";
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
};

export function QuickAddButton({
  locale,
  productId,
  code,
  name,
  image,
  slug,
  categoryName,
  categorySlug,
  rollLength,
}: Props) {
  const { add, isInCart, hydrated } = useQuoteCart();
  const [open, setOpen] = useState(false);
  const inCart = hydrated && isInCart(productId);

  const commit = (count: number | null) => {
    const quantity =
      rollLength && count ? buildRollQuantity(count, rollLength, locale) : "";
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
    toast.success(locale === "tr" ? "Teklif listesine eklendi" : "Added to quote list");
    setOpen(false);
  };

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onClick = (e: React.MouseEvent) => {
    stop(e);
    if (inCart) return;
    if (rollLength) setOpen(true);
    else commit(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={
          inCart
            ? locale === "tr"
              ? "Zaten listede"
              : "Already in list"
            : locale === "tr"
              ? "Teklif listesine ekle"
              : "Add to quote list"
        }
        title={inCart
          ? locale === "tr" ? "Listede" : "In list"
          : locale === "tr" ? "Teklif listesine ekle" : "Add to quote list"}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-xs font-semibold shadow-md transition",
          inCart
            ? "bg-emerald-500 text-white cursor-default"
            : "bg-white text-brand-900 hover:bg-accent-500 hover:text-white",
        )}
      >
        {inCart ? (
          <>
            <Check className="w-3.5 h-3.5" />
            {locale === "tr" ? "Listede" : "In List"}
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" />
            {locale === "tr" ? "Listeye ekle" : "Add"}
          </>
        )}
      </button>

      {rollLength && (
        <div onClick={stop}>
          <RollCountDialog
            open={open}
            onOpenChange={setOpen}
            locale={locale}
            product={{ code, name, image, categoryName, rollLength }}
            onConfirm={commit}
          />
        </div>
      )}
    </>
  );
}
